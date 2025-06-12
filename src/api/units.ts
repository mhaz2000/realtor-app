import type { PriceRange } from '../types/stats';
import type { Unit, UnitFilter } from '../types/unit';
import { authorizedAxios } from './axios/index';

export const getPriceRange = async (): Promise<PriceRange> => {
    const { data } = await authorizedAxios.get<PriceRange>('stats/price-range');
    return data;
};

export const searchUnits = async (filter: UnitFilter): Promise<Unit[]> => {
    const { data } = await authorizedAxios.post<Unit[]>('search/price-range', filter);
    return data;
};
