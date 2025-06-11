import type { PriceRange } from '../types/stats';
import { anonymousAxios } from './axios/index';

export const getPriceRange = async (): Promise<PriceRange> => {
    const { data } = await anonymousAxios.get<PriceRange>('stats/price-range');
    return data;
};