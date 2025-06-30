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

  minParking: number | null;
  maxParking: number | null;
  onParkingChange: (min: number | null, max: number | null) => void;

  viewFilter: string | null;
  onViewFilterChange: (value: string) => void;
};

type Range = { min: number; max: number };

const HouseFilter: React.FC<HouseFilterProps> = ({
  minPrice,
  maxPrice,
  minArea,
  maxArea,
  minFloor,
  maxFloor,
  minParking,
  maxParking,
  selectedUnitType,
  viewFilter,
  onParkingChange,
  onViewFilterChange,
  onAreaChange,
  onFloorChange,
  onPriceChange,
  onUnitTypeChange,
}) => {
  const { t } = useTranslation();

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

  const parkingRange = { min: 1, max: 3 }; // or fetch from API if needed
  const [tempParking, setTempParking] = useState<[string, string]>([
    parkingRange.min.toString(),
    parkingRange.max.toString(),
  ]);

  useEffect(() => {
    setTempParking([
      minParking?.toString() ?? '',
      maxParking?.toString() ?? '',
    ]);
  }, [minParking, maxParking]);

  return (
  <div
    className={`w-full px-6 py-6 rounded-2xl shadow-lg border border-blue-300 max-w-6xl mx-auto transition-all duration-700 ease-in-out 
    ${isOpen ? 'bg-gradient-to-br from-blue-50 to-white' : 'bg-white'}`}
  >
    {/* Header Toggle */}
    <div
      className="flex items-center justify-between cursor-pointer group"
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={isOpen ? t('collapseFilters') || 'Collapse Filters' : t('expandFilters') || 'Expand Filters'}
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-800 tracking-wide flex items-center gap-2">
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 10h18M3 16h18" />
        </svg>
        {t('filterHouses')}
      </h2>

      <svg
        className={`w-6 h-6 text-blue-600 transition-transform duration-500 group-hover:text-blue-800 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    {/* Filter Controls */}
    <div
      className={`transition-[max-height,opacity] duration-1000 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Range Sliders */}
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

        <RangeSliderSection
          label={t('parking_slots')}
          range={parkingRange}
          tempVals={tempParking}
          setTempVals={setTempParking}
          onBlur={() => {
            const [min, max] = tempParking.map((v) => {
              const num = parseInt(v, 10);
              return isNaN(num)
                ? null
                : Math.min(Math.max(parkingRange.min, num), parkingRange.max);
            }) as [number | null, number | null];
            onParkingChange(min, max);
          }}
        />

        {/* Unit Type */}
        {unitTypes.length > 0 && onUnitTypeChange && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
            <label className="block text-sm font-medium text-blue-700 font-semibold mb-2">{t('unit_type')}</label>
            <select
              className="w-full border border-blue-400 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedUnitType ?? ''}
              onChange={(e) => onUnitTypeChange(e.target.value || null)}
            >
              <option value="">{t('All')}</option>
              {unitTypes.map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* View Filter */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
          <label className="block text-sm font-semibold text-blue-700 mb-2">{t('view')}</label>
          <input
            type="text"
            className="w-full border border-blue-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('enter_view') ?? ''}
            value={viewFilter ?? ''}
            onChange={(e) => onViewFilterChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
);



};

export default HouseFilter;
