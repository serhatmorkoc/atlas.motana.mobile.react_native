import { useQuery, useMutation } from '@apollo/client/react';
import { USER_ADDRESSES_QUERY } from '@/lib/apollo/queries/UserAddressesQuery';
import {
  CREATE_USER_ADDRESS_MUTATION,
} from '@/lib/apollo/mutations/CreateUserAddressMutation';
import {
  UPDATE_USER_ADDRESS_MUTATION,
} from '@/lib/apollo/mutations/UpdateUserAddressMutation';
import {
  DELETE_USER_ADDRESS_MUTATION,
} from '@/lib/apollo/mutations/DeleteUserAddressMutation';
import {
  SET_SELECTED_ADDRESS_MUTATION,
} from '@/lib/apollo/mutations/SetSelectedAddressMutation';
import { useCallback, useMemo } from 'react';
import { useAuthUser } from './useAuthUser';

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

  const { data, loading, error, refetch: apolloRefetch } = useQuery(USER_ADDRESSES_QUERY, {
    variables: { userId: finalUserId || '00000000-0000-0000-0000-000000000000' },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [createAddressMutation, { loading: isCreating }] = useMutation(CREATE_USER_ADDRESS_MUTATION, {
    refetchQueries: [{ query: USER_ADDRESSES_QUERY, variables: { userId: finalUserId } }],
  });

  const [updateAddressMutation, { loading: isUpdating }] = useMutation(UPDATE_USER_ADDRESS_MUTATION, {
    refetchQueries: [{ query: USER_ADDRESSES_QUERY, variables: { userId: finalUserId } }],
  });

  const [deleteAddressMutation, { loading: isDeleting }] = useMutation(DELETE_USER_ADDRESS_MUTATION, {
    refetchQueries: [{ query: USER_ADDRESSES_QUERY, variables: { userId: finalUserId } }],
  });

  const [setSelectedMutation] = useMutation(SET_SELECTED_ADDRESS_MUTATION, {
    refetchQueries: [{ query: USER_ADDRESSES_QUERY, variables: { userId: finalUserId } }],
  });

  const addresses = useMemo(() => {
    if (shouldSkip) return [];
    return (data as any)?.user_addressesCollection?.edges?.map((edge: any) => mapAddressToUI(edge.node)) || [];
  }, [data, shouldSkip]);

  const refetch = useCallback(async () => {
    await apolloRefetch();
  }, [apolloRefetch]);

  const createAddress = useCallback(async (addressData: any) => {
    if (!finalUserId) return { success: false, error: 'User ID is required' };
    const deliveryAddress = formatDeliveryAddress(
      addressData.street, addressData.district, addressData.city,
      addressData.region, addressData.postalCode, addressData.country
    );
    try {
      const response = await createAddressMutation({
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
      if ((response.data as any)?.insertIntouser_addressesCollection?.records?.[0]) {
        return { success: true, address: mapAddressToUI((response.data as any).insertIntouser_addressesCollection.records[0]) };
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
      const response = await updateAddressMutation({
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
      if ((response.data as any)?.updateuser_addressesCollection?.records?.[0]) {
        return { success: true, address: mapAddressToUI((response.data as any).updateuser_addressesCollection.records[0]) };
      } else {
        return { success: false, error: 'Failed to update address' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [updateAddressMutation]);

  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      const response = await deleteAddressMutation({
        variables: { id: addressId },
      });
      if ((response.data as any)?.deleteFromuser_addressesCollection?.records?.[0]) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete address' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [deleteAddressMutation]);

  const setSelectedAddress = useCallback(async (addressId: string) => {
    const currentlySelected = addresses.find((addr: Address) => addr.selected && addr.id !== addressId);
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

  const isLoading = authLoading || loading;

  return {
    addresses,
    loading: isLoading,
    error: error ? error.message : null,
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
