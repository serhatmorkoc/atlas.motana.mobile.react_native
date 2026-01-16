import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USER_ADDRESSES } from "@/lib/apollo/queries/users";
import {
  CREATE_USER_ADDRESS,
  UPDATE_USER_ADDRESS,
  DELETE_USER_ADDRESS,
  SET_SELECTED_ADDRESS,
} from "@/lib/apollo/mutations/users";
import React from "react";
import { apolloClient } from "@/lib/apollo/client";

const HARDCODE_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02";

interface UserAddressNode {
  id: string;
  user_id: string;
  label: string | null;
  delivery_address: string | null;
  details: string | null;
  building: string | null;
  floor: string | null;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  is_selected: boolean | null;
}

interface GetUserAddressesData {
  user_addressesCollection: {
    edges: Array<{
      node: UserAddressNode;
    }>;
  };
}

interface CreateUserAddressData {
  insertIntouser_addressesCollection: {
    records: UserAddressNode[];
  };
}

interface UpdateUserAddressData {
  updateuser_addressesCollection: {
    records: UserAddressNode[];
  };
}

interface DeleteUserAddressData {
  deleteFromuser_addressesCollection: {
    records: Array<{ id: string }>;
  };
}

interface SetSelectedAddressData {
  updateuser_addressesCollection: {
    records: Array<{ id: string; is_selected: boolean | null }>;
  };
}

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

/**
 * Maps database address type (label) to UI type
 */
const mapLabelToType = (label: string | null): "home" | "work" | "other" => {
  if (!label) return "other";
  const lowerLabel = label.toLowerCase();
  if (lowerLabel === "home" || lowerLabel === "h") return "home";
  if (lowerLabel === "work" || lowerLabel === "w" || lowerLabel === "office") return "work";
  return "other";
};

/**
 * Maps UI type to database label
 */
const mapTypeToLabel = (type: "home" | "work" | "other"): string => {
  switch (type) {
    case "home":
      return "Home";
    case "work":
      return "Work";
    default:
      return "Other";
  }
};

/**
 * Parses delivery_address string into address components
 */
const parseDeliveryAddress = (deliveryAddress: string | null): {
  street?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country?: string;
} => {
  if (!deliveryAddress) return {};
  
  // Simple parsing - assumes format: "Street, District, City, Region, PostalCode, Country"
  // This is a basic implementation, can be improved
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

/**
 * Formats address components into delivery_address string
 */
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

/**
 * Maps database address to UI Address type
 */
const mapAddressToUI = (node: UserAddressNode): Address => {
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

/**
 * Hook to fetch and manage user addresses
 */
export const useUserAddresses = (userId: string = HARDCODE_USER_ID) => {
  const { data, loading, error, refetch } = useQuery<GetUserAddressesData>(
    GET_USER_ADDRESSES,
    {
      variables: { userId },
      fetchPolicy: 'network-only', // Always fetch fresh data
    }
  );

  const [createAddressMutation, { loading: creating }] = useMutation<CreateUserAddressData>(
    CREATE_USER_ADDRESS
  );

  const [updateAddressMutation, { loading: updating }] = useMutation<UpdateUserAddressData>(
    UPDATE_USER_ADDRESS
  );

  const [deleteAddressMutation, { loading: deleting }] = useMutation<DeleteUserAddressData>(
    DELETE_USER_ADDRESS
  );

  const [setSelectedMutation] = useMutation<SetSelectedAddressData>(
    SET_SELECTED_ADDRESS
  );

  const addresses = React.useMemo(() => {
    return data?.user_addressesCollection?.edges?.map(edge => mapAddressToUI(edge.node)) || [];
  }, [data]);

  const createAddress = async (addressData: {
    label: string;
    type: "home" | "work" | "other";
    street?: string;
    district?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    building?: string;
    floor?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    is_selected?: boolean;
  }) => {
    try {
      const deliveryAddress = formatDeliveryAddress(
        addressData.street,
        addressData.district,
        addressData.city,
        addressData.region,
        addressData.postalCode,
        addressData.country
      );

      const { data: result } = await createAddressMutation({
        variables: {
          user_id: userId,
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

      if (result?.insertIntouser_addressesCollection?.records?.[0]) {
        await refetch();
        return { success: true, address: mapAddressToUI(result.insertIntouser_addressesCollection.records[0]) };
      }
      return { success: false, error: 'Failed to create address' };
    } catch (e) {
      console.error('Error creating address:', e);
      return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
  };

  const updateAddress = async (
    addressId: string,
    addressData: {
      label?: string;
      type?: "home" | "work" | "other";
      street?: string;
      district?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
      building?: string;
      floor?: string;
      landmark?: string;
      latitude?: number;
      longitude?: number;
    }
  ) => {
    try {
      const deliveryAddress = formatDeliveryAddress(
        addressData.street,
        addressData.district,
        addressData.city,
        addressData.region,
        addressData.postalCode,
        addressData.country
      );

      const { data: result } = await updateAddressMutation({
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

      if (result?.updateuser_addressesCollection?.records?.[0]) {
        await refetch();
        return { success: true, address: mapAddressToUI(result.updateuser_addressesCollection.records[0]) };
      }
      return { success: false, error: 'Failed to update address' };
    } catch (e) {
      console.error('Error updating address:', e);
      return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const { data: result } = await deleteAddressMutation({
        variables: { id: addressId },
      });

      if (result?.deleteFromuser_addressesCollection?.records?.[0]) {
        await refetch();
        return { success: true };
      }
      return { success: false, error: 'Failed to delete address' };
    } catch (e) {
      console.error('Error deleting address:', e);
      return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
  };

  const setSelectedAddress = async (addressId: string) => {
    try {
      // Find the currently selected address
      const currentlySelected = addresses.find(addr => addr.selected && addr.id !== addressId);
      
      // Execute mutations in parallel for better performance
      const mutations = [];
      
      // If there's a currently selected address, unselect it
      if (currentlySelected) {
        mutations.push(
          setSelectedMutation({
            variables: { id: currentlySelected.id, is_selected: false },
          })
        );
      }

      // Select the specified address
      mutations.push(
        setSelectedMutation({
          variables: { id: addressId, is_selected: true },
        })
      );

      // Wait for all mutations to complete
      const results = await Promise.all(mutations);
      
      // Check if the select mutation was successful
      const selectResult = currentlySelected ? results[1] : results[0];
      if (selectResult?.data?.updateuser_addressesCollection?.records?.[0]) {
        // Refetch in the background without blocking
        // AbortError is expected during fast navigations/unmounts; don't log it as an error.
        refetch().catch((err) => {
          if (err?.name === 'AbortError' || err?.message === 'The operation was aborted.') {
            return;
          }
          console.error('Error refetching addresses:', err);
        });
        return { success: true };
      }
      return { success: false, error: 'Failed to set selected address' };
    } catch (e) {
      console.error('Error setting selected address:', e);
      return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
  };

  return {
    addresses,
    loading,
    error,
    refetch,
    createAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    creating,
    updating,
    deleting,
  };
};
