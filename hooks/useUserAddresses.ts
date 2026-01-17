import { useLazyLoadQuery, useMutation } from 'react-relay';
import { userAddressesQuery } from '@/lib/relay/queries/UserAddressesQuery';
import {
  createUserAddressMutation,
} from '@/lib/relay/mutations/CreateUserAddressMutation';
import {
  updateUserAddressMutation,
} from '@/lib/relay/mutations/UpdateUserAddressMutation';
import {
  deleteUserAddressMutation,
} from '@/lib/relay/mutations/DeleteUserAddressMutation';
import {
  setSelectedAddressMutation,
} from '@/lib/relay/mutations/SetSelectedAddressMutation';
import React, { useCallback, useMemo, useState } from 'react';
import { useAuthUser } from './useAuthUser';
import type { UserAddressesQuery } from '@/__generated__/UserAddressesQuery.graphql';
import type { CreateUserAddressMutation } from '@/__generated__/CreateUserAddressMutation.graphql';
import type { UpdateUserAddressMutation } from '@/__generated__/UpdateUserAddressMutation.graphql';
import type { DeleteUserAddressMutation } from '@/__generated__/DeleteUserAddressMutation.graphql';
import type { SetSelectedAddressMutation } from '@/__generated__/SetSelectedAddressMutation.graphql';

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
  
  const [refetchKey, setRefetchKey] = useState(0);

  const data = useLazyLoadQuery<UserAddressesQuery>(
    userAddressesQuery,
    { userId: finalUserId || '00000000-0000-0000-0000-000000000000' },
    { 
      fetchPolicy: 'store-and-network',
      fetchKey: shouldSkip ? 'skip' : `${finalUserId}-${refetchKey}`,
    }
  );

  const [commitCreateAddress, isCreating] = useMutation<CreateUserAddressMutation>(createUserAddressMutation);
  const [commitUpdateAddress, isUpdating] = useMutation<UpdateUserAddressMutation>(updateUserAddressMutation);
  const [commitDeleteAddress, isDeleting] = useMutation<DeleteUserAddressMutation>(deleteUserAddressMutation);
  const [commitSetSelected] = useMutation<SetSelectedAddressMutation>(setSelectedAddressMutation);

  const addresses = useMemo(() => {
    if (shouldSkip) return [];
    return data?.user_addressesCollection?.edges?.map(edge => mapAddressToUI(edge.node)) || [];
  }, [data, shouldSkip]);

  const refetch = useCallback(async () => {
    setRefetchKey(prev => prev + 1);
  }, []);

  const createAddress = useCallback(async (addressData: any) => {
    if (!finalUserId) return { success: false, error: 'User ID is required' };
    const deliveryAddress = formatDeliveryAddress(
      addressData.street, addressData.district, addressData.city,
      addressData.region, addressData.postalCode, addressData.country
    );
    return new Promise<{ success: boolean; error?: string; address?: Address }>((resolve) => {
      commitCreateAddress({
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
        onCompleted: (response) => {
          if (response?.insertIntouser_addressesCollection?.records?.[0]) {
            resolve({ success: true, address: mapAddressToUI(response.insertIntouser_addressesCollection.records[0]) });
          } else {
            resolve({ success: false, error: 'Failed to create address' });
          }
        },
        onError: (error) => resolve({ success: false, error: error.message || 'Unknown error' }),
      });
    });
  }, [finalUserId, commitCreateAddress]);

  const updateAddress = useCallback(async (addressId: string, addressData: any) => {
    const deliveryAddress = formatDeliveryAddress(
      addressData.street, addressData.district, addressData.city,
      addressData.region, addressData.postalCode, addressData.country
    );
    return new Promise<{ success: boolean; error?: string; address?: Address }>((resolve) => {
      commitUpdateAddress({
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
        onCompleted: (response) => {
          if (response?.updateuser_addressesCollection?.records?.[0]) {
            resolve({ success: true, address: mapAddressToUI(response.updateuser_addressesCollection.records[0]) });
          } else {
            resolve({ success: false, error: 'Failed to update address' });
          }
        },
        onError: (error) => resolve({ success: false, error: error.message || 'Unknown error' }),
      });
    });
  }, [commitUpdateAddress]);

  const deleteAddress = useCallback(async (addressId: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      commitDeleteAddress({
        variables: { id: addressId },
        onCompleted: (response) => {
          if (response?.deleteFromuser_addressesCollection?.records?.[0]) resolve({ success: true });
          else resolve({ success: false, error: 'Failed to delete address' });
        },
        onError: (error) => resolve({ success: false, error: error.message || 'Unknown error' }),
      });
    });
  }, [commitDeleteAddress]);

  const setSelectedAddress = useCallback(async (addressId: string) => {
    const currentlySelected = addresses.find(addr => addr.selected && addr.id !== addressId);
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      const selectNew = () => {
        commitSetSelected({
          variables: { id: addressId, is_selected: true },
          onCompleted: () => resolve({ success: true }),
          onError: (error) => resolve({ success: false, error: error.message || 'Unknown error' }),
        });
      };
      if (currentlySelected) {
        commitSetSelected({
          variables: { id: currentlySelected.id, is_selected: false },
          onCompleted: selectNew,
          onError: (error) => resolve({ success: false, error: error.message || 'Unknown error' }),
        });
      } else {
        selectNew();
      }
    });
  }, [addresses, commitSetSelected]);

  const isLoading = authLoading || (shouldSkip ? false : !data);

  return {
    addresses,
    loading: isLoading,
    error: null,
    refetch,
    createAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    creating: isCreating,
    updating: isUpdating,
    deleting: isDeleting,
  };
};
