import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USER_ADDRESSES } from '@/lib/apollo/queries/userAddresses';
import {
  CREATE_USER_ADDRESS,
  UPDATE_USER_ADDRESS,
  DELETE_USER_ADDRESS,
  SET_SELECTED_ADDRESS,
} from '@/lib/apollo/mutations/userAddresses';
import React, { useCallback, useMemo, useEffect } from 'react';
import { useAuthUser } from './useAuthUser';
import { apolloClient } from '@/lib/apollo/client';

export interface Address {
  id: string;
  title: string;
  address: string;
  type: "home" | "work" | "other";
  selected: boolean;
  floor?: string;
  building?: string;
  street?: string;
  landmark?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

const mapLabelToType = (label: string | null): "home" | "work" | "other" => {
  if (!label) return "other";
  const lowerLabel = label.toLowerCase();
  if (lowerLabel === "home" || lowerLabel === "h") return "home";
  if (lowerLabel === "work" || lowerLabel === "w" || lowerLabel === "office") return "work";
  return "other";
};

const mapTypeToLabel = (type: "home" | "work" | "other"): string => {
  switch (type) {
    case "home": return "Home";
    case "work": return "Work";
    default: return "Other";
  }
};

const parseDeliveryAddress = (deliveryAddress: string | null): {
  street?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country?: string;
} => {
  if (!deliveryAddress) return {};
  const parts = deliveryAddress.split(",").map(p => p.trim());
  return {
    street: parts[0] || undefined,
    district: parts[1] || undefined,
    city: parts[2] || undefined,
    region: parts[3] || undefined,
    postalCode: parts[4] || undefined,
    country: parts[5] || undefined,
  };
};

const formatDeliveryAddress = (
  street?: string,
  district?: string,
  city?: string,
  region?: string,
  postalCode?: string,
  country?: string
): string => {
  const parts = [street, district, city, region, postalCode, country].filter(Boolean);
  return parts.join(", ");
};

const mapAddressToUI = (node: {
  id: string;
  label: string | null;
  delivery_address: string | null;
  details: string | null;
  building: string | null;
  floor: string | null;
  landmark: string | null;
  latitude: string | null;
  longitude: string | null;
  is_selected: boolean | null;
}): Address => {
  const parsed = parseDeliveryAddress(node.delivery_address);
  return {
    id: node.id,
    title: node.label || "Address",
    address: node.delivery_address || "",
    type: mapLabelToType(node.label),
    selected: node.is_selected || false,
    floor: node.floor || undefined,
    building: node.building || undefined,
    street: parsed.street,
    district: parsed.district,
    city: parsed.city,
    region: parsed.region,
    postalCode: parsed.postalCode,
    country: parsed.country,
    landmark: node.landmark || undefined,
    latitude: node.latitude ? Number(node.latitude) : undefined,
    longitude: node.longitude ? Number(node.longitude) : undefined,
  };
};

export const useUserAddresses = (userId?: string) => {
  const { userId: authUserId, loading: authLoading } = useAuthUser();
  const finalUserId = userId || authUserId;
  const shouldSkip = authLoading || !finalUserId;
  
  const { data, loading, error, refetch } = useQuery(GET_USER_ADDRESSES, {
    variables: { userId: finalUserId || '00000000-0000-0000-0000-000000000000' },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Debug: Log query status
  useEffect(() => {
    if (__DEV__) {
      console.log('[useUserAddresses] Query status:', {
        loading,
        hasData: !!data,
        hasError: !!error,
        dataLength: data?.user_addressesCollection?.edges?.length || 0,
        error: error?.message,
        shouldSkip,
        finalUserId,
      });
    }
  }, [loading, data, error, shouldSkip, finalUserId]);

  const [createAddressMutation, { loading: isCreating }] = useMutation(CREATE_USER_ADDRESS, {
    refetchQueries: [{ query: GET_USER_ADDRESSES, variables: { userId: finalUserId } }],
  });

  const [updateAddressMutation, { loading: isUpdating }] = useMutation(UPDATE_USER_ADDRESS, {
    refetchQueries: [{ query: GET_USER_ADDRESSES, variables: { userId: finalUserId } }],
  });

  const [deleteAddressMutation, { loading: isDeleting }] = useMutation(DELETE_USER_ADDRESS, {
    refetchQueries: [{ query: GET_USER_ADDRESSES, variables: { userId: finalUserId } }],
  });

  const [setSelectedMutation] = useMutation(SET_SELECTED_ADDRESS, {
    refetchQueries: [{ query: GET_USER_ADDRESSES, variables: { userId: finalUserId } }],
  });

  const addresses = useMemo(() => {
    if (shouldSkip) return [];
    return data?.user_addressesCollection?.edges?.map((edge: any) => mapAddressToUI(edge.node)) || [];
  }, [data?.user_addressesCollection?.edges, shouldSkip]);

  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      // Ignore AbortError - it's normal when component unmounts or query is cancelled
      if (err?.name !== 'AbortError' && err?.message !== 'The operation was aborted.') {
        console.error('Error refetching addresses:', err);
      }
    }
  }, [refetch]);

  const createAddress = useCallback(async (addressData: any) => {
    if (!finalUserId) return { success: false, error: 'User ID is required' };
    const deliveryAddress = formatDeliveryAddress(
      addressData.street, addressData.district, addressData.city,
      addressData.region, addressData.postalCode, addressData.country
    );
    try {
      const { data: response } = await createAddressMutation({
        variables: {
          user_id: finalUserId,
          label: mapTypeToLabel(addressData.type),
          delivery_address: deliveryAddress,
          details: addressData.landmark || null,
          building: addressData.building || null,
          floor: addressData.floor || null,
          landmark: addressData.landmark || null,
          latitude: addressData.latitude ? addressData.latitude.toString() : null,
          longitude: addressData.longitude ? addressData.longitude.toString() : null,
          is_selected: addressData.is_selected || false,
        },
      });
      if (response?.insertIntouser_addressesCollection?.records?.[0]) {
        return { success: true, address: mapAddressToUI(response.insertIntouser_addressesCollection.records[0]) };
      } else {
        return { success: false, error: 'Failed to create address' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [finalUserId, createAddressMutation]);

  const updateAddress = useCallback(async (addressId: string, addressData: any) => {
    const deliveryAddress = formatDeliveryAddress(
      addressData.street, addressData.district, addressData.city,
      addressData.region, addressData.postalCode, addressData.country
    );
    try {
      const { data: response } = await updateAddressMutation({
        variables: {
          id: addressId,
          label: addressData.type ? mapTypeToLabel(addressData.type) : addressData.label || null,
          delivery_address: deliveryAddress || null,
          details: addressData.landmark || null,
          building: addressData.building || null,
          floor: addressData.floor || null,
          landmark: addressData.landmark || null,
          latitude: addressData.latitude ? addressData.latitude.toString() : null,
          longitude: addressData.longitude ? addressData.longitude.toString() : null,
        },
      });
      if (response?.updateuser_addressesCollection?.records?.[0]) {
        return { success: true, address: mapAddressToUI(response.updateuser_addressesCollection.records[0]) };
      } else {
        return { success: false, error: 'Failed to update address' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [updateAddressMutation]);

  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      const { data: response } = await deleteAddressMutation({
        variables: { id: addressId },
      });
      if (response?.deleteFromuser_addressesCollection?.records?.[0]) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete address' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [deleteAddressMutation]);

  const setSelectedAddress = useCallback(async (addressId: string) => {
    const currentlySelected = addresses.find(addr => addr.selected && addr.id !== addressId);
    try {
      if (currentlySelected) {
        await setSelectedMutation({
          variables: { id: currentlySelected.id, is_selected: false },
        });
      }
      await setSelectedMutation({
        variables: { id: addressId, is_selected: true },
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [addresses, setSelectedMutation]);

  const isLoading = authLoading || (shouldSkip ? false : loading);

  return {
    addresses,
    loading: isLoading,
    error: error as Error | null,
    refetch: handleRefetch,
    createAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    creating: isCreating,
    updating: isUpdating,
    deleting: isDeleting,
  };
};
