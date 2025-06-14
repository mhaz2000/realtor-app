export type Unit = {
    unit_code: string;
    project_name: string;
    full_payment: number;
    unit_type: string;
    floor: number;
    view: string;
    total_area: number;
    completion_date: number;
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