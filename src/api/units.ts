import type { AreaRange, AreaStatistics, FloorRange, PriceRange, UnitType } from '../types/stats';
import type { UnifiedUnit, UnitFilter } from '../types/unit';
import { authorizedAxios } from './axios/index';

export const getPriceRange = async (): Promise<PriceRange> => {
    const { data } = await authorizedAxios.get<PriceRange>('stats/price-range');
    return data;
};

export const searchUnits = async (filter: UnitFilter, take: number, skip: number): Promise<UnifiedUnit> => {
    const { data } = await authorizedAxios.post<UnifiedUnit>(`search/unified?take=${take}&skip=${skip}`, filter);
    return data;
};


export const getAreaRange = async (): Promise<AreaRange> => {
    const { data } = await authorizedAxios.get<AreaStatistics>('available-areas');
    return data.area_statistics;
};

export const getFloorRange = async (): Promise<FloorRange> => {
    const { data } = await authorizedAxios.get<FloorRange>('available-floors');
    return data;
};

export const getUnitTypes = async (): Promise<string[]> => {
    const { data } = await authorizedAxios.get<UnitType>('available-unit-types');
    return data.available_unit_types;
};
