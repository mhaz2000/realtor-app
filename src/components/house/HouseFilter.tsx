import { useEffect, useRef, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Ruler, Layers, ParkingCircle } from 'lucide-react';
import {
  getAreaRange,
  getFloorRange,
  getPriceRange,
  getUnitTypes,
} from '../../api/units';
import RangeSliderSection from '../RangeSliderSection';
import FilterPanel from '../FilterPanel';
import ViewInput from './ViewInput';
import UnitTypeSelect from './UnitTypeSelect';

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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const icons: Record<string, JSX.Element> = {
    price: <Wallet className="w-5 h-5 text-blue-600" />,
    area: <Ruler className="w-5 h-5 text-blue-600" />,
    floor: <Layers className="w-5 h-5 text-blue-600" />,
    parking: <ParkingCircle className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Filter Nav */}
      <div ref={containerRef} className="flex flex-wrap justify-center gap-6 py-3 px-6 bg-white border border-gray-200 rounded-full shadow-md max-w-4xl mx-auto">
        {[
          { key: 'price', label: t('priceRange') },
          { key: 'area', label: t('areaRange') },
          { key: 'floor', label: t('floorRange') },
          { key: 'type', label: t('unit_type') },
          { key: 'parking', label: t('parking_slots') },
          { key: 'view', label: t('view') },
        ].map(({ key, label }) => (
          <div key={key} className="relative">
            <button
              onClick={() => setActiveFilter(activeFilter === key ? null : key)}
              className={`
              relative
              px-6 py-2.5
              rounded-full
              font-semibold text-sm
              transition
              duration-300
              focus:outline-none
              focus:ring-2 focus:ring-blue-400
              ${activeFilter === key
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}
            `}
            >
              {label}
              {activeFilter === key && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full shadow-md"></span>
              )}
            </button>

            {/* Dropdown */}
            {activeFilter === key && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 mt-3 z-50 bg-white border border-gray-300 rounded-2xl shadow-xl p-6 w-[90vw] max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <FilterPanel isActive={true}>
                  {key === 'price' && priceRange && (
                    <RangeSliderSection
                      range={priceRange}
                      tempVals={tempPrice}
                      setTempVals={setTempPrice}
                      icon={icons.price}
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

                  {key === 'area' && areaRange && (
                    <RangeSliderSection
                      range={areaRange}
                      tempVals={tempArea}
                      setTempVals={setTempArea}
                      icon={icons.area}
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

                  {key === 'floor' && floorRange && (
                    <RangeSliderSection
                      range={floorRange}
                      tempVals={tempFloor}
                      setTempVals={setTempFloor}
                      icon={icons.floor}
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


                  {key === 'type' && (
                    <UnitTypeSelect
                      unitTypes={unitTypes}
                      selectedUnitType={selectedUnitType}
                      onChange={onUnitTypeChange!}
                      allLabel={t('All')}
                    />
                  )}

                  {key === 'parking' && (
                    <RangeSliderSection
                      range={parkingRange}
                      tempVals={tempParking}
                      setTempVals={setTempParking}
                      icon={icons.parking}
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
                  )}

                  {key === 'view' && (
                    <ViewInput
                      value={viewFilter}
                      onChange={onViewFilterChange}
                      placeholder={t('enter_view') ?? ''}
                    />
                  )}
                </FilterPanel>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );




};

export default HouseFilter;
