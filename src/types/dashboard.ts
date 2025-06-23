export type DashboardData = {
    price_distribution: PriceDistribution,
    area_distribution: AreaDistribution
}

export type PriceDistribution = {
    total_units_with_prices: number;
    min_price: number;
    max_price: number;
    avg_price: number;
    median_price: number;
}

export type AreaDistribution = {
    total_units_with_areas : number;
    min_area : number;
    max_area : number;
    avg_area : number;
    median_area : number;
}