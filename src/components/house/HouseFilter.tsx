import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getAreaRange,
  getFloorRange,
  getPriceRange,
  getUnitTypes,
} from '../../api/units';
import RangeSliderSection from '../RangeSliderSection';

type HouseFilterProps = {
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;

  minArea: number | null;
  maxArea: number | null;
  onAreaChange: (min: number | null, max: number | null) => void;

  minFloor: number | null;
  maxFloor: number | null;
  onFloorChange: (min: number | null, max: number | null) => void;

  selectedUnitType?: string | null;
  onUnitTypeChange?: (unitType: string | null) => void;
};

type Range = { min: number; max: number };

const HouseFilter: React.FC<HouseFilterProps> = ({
  minPrice,
  maxPrice,
  minArea,
  maxArea,
  minFloor,
  maxFloor,
  selectedUnitType,
  onAreaChange,
  onFloorChange,
  onPriceChange,
  onUnitTypeChange,
}) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir() as 'ltr' | 'rtl';

  const [priceRange, setPriceRange] = useState<Range | null>(null);
  const [areaRange, setAreaRange] = useState<Range | null>(null);
  const [floorRange, setFloorRange] = useState<Range | null>(null);
  const [unitTypes, setUnitTypes] = useState<string[]>([]);

  const [tempPrice, setTempPrice] = useState<[string, string]>(['', '']);
  const [tempArea, setTempArea] = useState<[string, string]>(['', '']);
  const [tempFloor, setTempFloor] = useState<[string, string]>(['', '']);

  useEffect(() => {
    getPriceRange().then((d) => {
      const r = { min: d.min_price, max: d.max_price };
      setPriceRange(r);
      onPriceChange(r.min, r.max);
      setTempPrice([r.min.toString(), r.max.toString()]);
    });

    getAreaRange().then((d) => {
      const r = { min: d.min_area, max: d.max_area };
      setAreaRange(r);
      onAreaChange(r.min, r.max);
      setTempArea([r.min.toString(), r.max.toString()]);
    });

    getFloorRange()
      .then((d) => {
        const r = { min: d.min_floor, max: d.max_floor };
        setFloorRange(r);
        onFloorChange(r.min, r.max);
        setTempFloor([r.min.toString(), r.max.toString()]);
      })
      .catch(() => setFloorRange({ min: 0, max: 30 }));

    getUnitTypes().then((data) => setUnitTypes(data));
  }, []);

  useEffect(() => {
    if (priceRange) setTempPrice([minPrice?.toString() ?? '', maxPrice?.toString() ?? '']);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (areaRange) setTempArea([minArea?.toString() ?? '', maxArea?.toString() ?? '']);
  }, [minArea, maxArea]);

  useEffect(() => {
    if (floorRange) setTempFloor([minFloor?.toString() ?? '', maxFloor?.toString() ?? '']);
  }, [minFloor, maxFloor]);

  const [isOpen, setIsOpen] = useState(true);


  return (
    <div
      className={`w-full px-6 py-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-300 max-w-6xl mx-auto ${dir === 'rtl' ? 'sm:order-2' : 'sm:order-1'
        }`}
    >
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 border-blue-400 pb-2 text-center">
        {t('filterHouses')}
      </h2>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-1000 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-wrap gap-6 justify-start">
          {priceRange && (
            <RangeSliderSection
              label={t('priceRange')}
              range={priceRange}
              tempVals={tempPrice}
              setTempVals={setTempPrice}
              onBlur={() => {
                const [min, max] = tempPrice.map((v) => {
                  const num = parseFloat(v);
                  return isNaN(num)
                    ? null
                    : Math.min(Math.max(priceRange.min, num), priceRange.max);
                }) as [number | null, number | null];
                onPriceChange(min, max);
              }}
            />
          )}

          {areaRange && (
            <RangeSliderSection
              label={t('areaRange')}
              range={areaRange}
              tempVals={tempArea}
              setTempVals={setTempArea}
              onBlur={() => {
                const [min, max] = tempArea.map((v) => {
                  const num = parseFloat(v);
                  return isNaN(num)
                    ? null
                    : Math.min(Math.max(areaRange.min, num), areaRange.max);
                }) as [number | null, number | null];
                onAreaChange(min, max);
              }}
            />
          )}

          {floorRange && (
            <RangeSliderSection
              label={t('floorRange')}
              range={floorRange}
              tempVals={tempFloor}
              setTempVals={setTempFloor}
              onBlur={() => {
                const [min, max] = tempFloor.map((v) => {
                  const num = parseInt(v, 10);
                  return isNaN(num)
                    ? null
                    : Math.min(Math.max(floorRange.min, num), floorRange.max);
                }) as [number | null, number | null];
                onFloorChange(min, max);
              }}
            />
          )}

          {unitTypes.length > 0 && onUnitTypeChange && (
            <div className="flex-1 min-w-[280px] max-w-sm mx-auto p-5 bg-blue-50 rounded-2xl border border-blue-300 shadow-inner space-y-3">
              <label className="block font-semibold text-blue-700 text-sm mb-1">{t('unit_type')}</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-md border border-blue-400 px-3 py-2 text-sm text-blue-900 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
                  value={selectedUnitType ?? ''}
                  onChange={(e) => onUnitTypeChange(e.target.value || null)}
                >
                  <option value="All" className="text-blue-700">
                    {t('All')}
                  </option>
                  {unitTypes.map((type) => (
                    <option key={type} value={type} className="text-blue-900">
                      {t(type)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-blue-400 select-none">
                  ▼
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? t('collapseFilters') || 'Collapse Filters' : t('expandFilters') || 'Expand Filters'}
        className="flex justify-center cursor-pointer pt-4 select-none"
      >
        <svg
          className={`w-6 h-6 text-blue-600 transition-transform duration-700 hover:text-blue-800 ${isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );



};

export default HouseFilter;
