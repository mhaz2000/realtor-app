export type PriceRange = {
    min_price: number;
    max_price: number;
};

export type AreaStatistics = {
    area_statistics: AreaRange
}

export type AreaRange = {
    min_area: number;
    max_area: number;
};

export type FloorRange = {
    min_floor: number;
    max_floor: number;
};


export type UnitType = {
    available_unit_types: string[];
};
