/**
 * Address-related type definitions
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface DeliveryAddress {
    street: string;
    city: string;
    postalCode: string;
    district?: string;
    buildingNo?: string;
    apartmentNo?: string;
    note?: string;
    coordinates?: Coordinates;
}

export interface UserAddress {
    id: string;
    user_id: string;
    title: string;
    street: string;
    city: string;
    district?: string;
    postalCode?: string;
    buildingNo?: string;
    apartmentNo?: string;
    note?: string;
    coordinates?: Coordinates;
    is_default: boolean;
    created_at: string;
    updated_at?: string;
}
