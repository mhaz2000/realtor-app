export type Unit = {
    unit_code: string;
    project_name: string;
    full_payment: number;
    unit_type: string;
    floor: number;
    view: string;
    total_area: number;
    completion_date: number;
    main_photo_url: string;
}

export type UnifiedUnit = {
    units: Unit[],
    pagination: UnitPagination
}

export type UnitPagination = {
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
    page_size: number;
    skip: number;
    take: number;
    total_count: number;
    total_pages: number;
}

export type UnitFilter = {
    min_price: number | null;
    max_price: number | null;
    min_floor: number | null;
    max_floor: number | null;
    min_area: number | null;
    max_area: number | null;
    unit_type: string | null;
}

export type UnitDetail = {
    unit_code: string;
    unit_type: string;
    is_liked: boolean;
    floor: number;
    view: string;
    remarks: any;
    status: string;
    project_id: number,
    project_name: string;
    completion_date: string;
    file_source: string;
    asking_price: number | null;
    payment_20_percent: number | null;
    payment_50_percent: number | null;
    payment_70_percent: number | null;
    full_payment: number | null;
    payment_structure_20_50_30: any;
    payment_structure_50_20_30: any;
    payment_structure_70_30: any;
    total_area: number | null;
    net_area: number | null;
    terrace_area: number | null;
    balcony_area: number | null;
    unit_area: number | null;
    currency: string;
    area_unit: string;
    unknown_data: any;
    unit_created_at: string;
    unit_updated_at: string;
    details_created_at: string;
    details_updated_at: string;
    location_info: LocationInfo;
}

export type UnitNearbyFacility = {
    healthcare: Facility[];
    education: Facility[];
    transport: Facility[];
    restaurants: Facility[];
    shopping: Facility[];
}


export type LocationInfo = {
    coordinates: coordinate;
    error: any;
    photos: UnitPhoto;
    total_facilities: number;
    search_radius_meters: number;
    project_details: ProjectLocationDetail;
    facilities_data: UnitNearbyFacility;
}

export type UnitPhoto = {
    main_photo_url: string;
    has_photos: boolean;
}

export type ProjectLocationDetail = {
    address: string;
    builder: string;
    completion_date: string;
    website: string | null;
    contact_info: string;
}

export type coordinate = {
    longitude: number;
    latitude: number;
}

export type Facility = {
    name: string;
    type: string;
    phone: string | null;
    address: string | null;
    website: string | null;
}
