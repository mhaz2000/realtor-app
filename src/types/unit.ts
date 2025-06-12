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

export type UnitFilter = {
    min_price: number;
    max_price: number;
    limit: number;
}