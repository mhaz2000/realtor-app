import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAreaRange, getFloorRange, getPriceRange, getUnitTypes } from '../../api/units';

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

  selectedUnitType?: string | null; // add this
  onUnitTypeChange?: (unitType: string | null) => void; // add this
};
type Range = { min: number; max: number };

const HouseFilter = ({
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
  onUnitTypeChange
}: HouseFilterProps) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const [priceRange, setPriceRange] = useState<Range | null>(null);
  const [areaRange, setAreaRange] = useState<Range | null>(null);
  const [floorRange, setFloorRange] = useState<Range | null>(null);

  const [tempPriceMin, setTempPriceMin] = useState<string>('');
  const [tempPriceMax, setTempPriceMax] = useState<string>('');
  const [tempAreaMin, setTempAreaMin] = useState('');
  const [tempAreaMax, setTempAreaMax] = useState('');
  const [tempFloorMin, setTempFloorMin] = useState('');
  const [tempFloorMax, setTempFloorMax] = useState('');

  const [unitTypes, setUnitTypes] = useState<string[]>([]);



  useEffect(() => {
    getPriceRange().then((data) => {
      setPriceRange({ max: data.max_price, min: data.min_price });
      onPriceChange(data.min_price, data.max_price);
      setTempPriceMin(data.min_price.toString());
      setTempPriceMax(data.max_price.toString());
    });

    getAreaRange().then((data) => {
      setAreaRange({ max: data.max_area, min: data.min_area });
      onAreaChange(data.min_area, data.max_area);
      setTempAreaMin(data.min_area.toString());
      setTempAreaMax(data.max_area.toString());
    });

    getFloorRange().then((data) => {
      setFloorRange({ max: data.max_floor, min: data.min_floor });
      onFloorChange(data.min_floor, data.max_floor);
      setTempFloorMin(data.min_floor.toString());
      setTempFloorMax(data.max_floor.toString());
    }).catch(() => setFloorRange({ max: 30, min: 0 }));

    getUnitTypes().then((data) => {
      setUnitTypes(data); // Assuming { unit_types: string[] }
    });

  }, []);

  useEffect(() => {
    setTempPriceMin(minPrice?.toString() ?? '');
  }, [minPrice]);

  useEffect(() => {
    setTempPriceMax(maxPrice?.toString() ?? '');
  }, [maxPrice]);

  useEffect(() => {
    setTempAreaMin(minArea?.toString() ?? '');
  }, [minArea]);

  useEffect(() => {
    setTempAreaMax(maxArea?.toString() ?? '');
  }, [maxArea]);

  useEffect(() => {
    setTempFloorMin(minFloor?.toString() ?? '');
  }, [minFloor]);

  useEffect(() => {
    setTempFloorMax(maxFloor?.toString() ?? '');
  }, [maxFloor]);

  const handleMinBlur = () => {
    if (!priceRange) return;
    const value = parseInt(tempPriceMin, 10);

    if (isNaN(value)) {
      onPriceChange(null, maxPrice);
      setTempPriceMin(''); // reset local state to empty
    } else {
      let adjustedMin = Math.max(priceRange.min, value);
      let adjustedMax = maxPrice;

      if (adjustedMax !== null && adjustedMax < adjustedMin) {
        adjustedMax = adjustedMin;
      }

      setTempPriceMin(adjustedMin.toString());  // update local state here
      onPriceChange(adjustedMin, adjustedMax);
    }
  };

  const handleMaxBlur = () => {
    if (!priceRange) return;
    const value = parseInt(tempPriceMax, 10);

    if (isNaN(value)) {
      onPriceChange(minPrice, null);
      setTempPriceMax('');
    } else {
      let adjustedMax = Math.min(priceRange.max, value);
      let adjustedMin = minPrice;

      if (adjustedMin !== null && adjustedMax < adjustedMin) {
        adjustedMax = adjustedMin;
      }

      setTempPriceMax(adjustedMax.toString()); // update local state here
      onPriceChange(adjustedMin, adjustedMax);
    }
  };

  const handleAreaBlur = () => {
    if (!areaRange) return;
    const min = parseInt(tempAreaMin, 10);
    const max = parseInt(tempAreaMax, 10);

    const newMin = isNaN(min) ? null : Math.max(areaRange.min, min);
    const newMax = isNaN(max) ? null : Math.min(areaRange.max, max);

    if (newMin !== null && newMax !== null && newMax < newMin) {
      onAreaChange(newMin, newMin);
      setTempAreaMax(newMin.toString());
    } else {
      onAreaChange(newMin, newMax);
    }
  };

  const handleFloorBlur = () => {
    if (!floorRange) return;
    const min = parseInt(tempFloorMin, 10);
    const max = parseInt(tempFloorMax, 10);

    const newMin = isNaN(min) ? null : Math.max(floorRange.min, min);
    const newMax = isNaN(max) ? null : Math.min(floorRange.max, max);

    if (newMin !== null && newMax !== null && newMax < newMin) {
      onFloorChange(newMin, newMin);
      setTempFloorMax(newMin.toString());
    } else {
      onFloorChange(newMin, newMax);
    }
  };

  return (
    <aside
      className={`
        h-h-[calc(h-screen-64px)] w-full sm:w-1/4 p-4 bg-white rounded shadow
        ${dir === 'rtl' ? 'sm:order-2' : 'sm:order-1'}
      `}
    >
      <h2 className="text-xl font-semibold mb-4">{t('filterHouses')}</h2>

      {priceRange && (
        <div className="space-y-2">
          <label className="block font-medium">{t('priceRange')}</label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempPriceMin}
              placeholder={`${priceRange.min.toLocaleString()}`}
              onChange={(e) => setTempPriceMin(e.target.value)}
              onBlur={handleMinBlur}
              className="w-full border rounded p-2"
            />
            <span>-</span>
            <input
              type="number"
              value={tempPriceMax}
              placeholder={`${priceRange.max.toLocaleString()}`}
              onChange={(e) => setTempPriceMax(e.target.value)}
              onBlur={handleMaxBlur}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      )}

      {areaRange && (
        <div className="space-y-2 mt-4">
          <label className="block font-medium">{t('areaRange')}</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempAreaMin}
              placeholder={`${areaRange.min.toLocaleString()}`}
              onChange={(e) => setTempAreaMin(e.target.value)}
              onBlur={handleAreaBlur}
              className="w-full border rounded p-2"
            />
            <span>-</span>
            <input
              type="number"
              value={tempAreaMax}
              placeholder={`${areaRange.max.toLocaleString()}`}
              onChange={(e) => setTempAreaMax(e.target.value)}
              onBlur={handleAreaBlur}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      )}

      {/* Floor Range Filter */}
      {floorRange && (
        <div className="space-y-2 mt-4">
          <label className="block font-medium">{t('floorRange')}</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempFloorMin}
              placeholder={`${floorRange.min}`}
              onChange={(e) => setTempFloorMin(e.target.value)}
              onBlur={handleFloorBlur}
              className="w-full border rounded p-2"
            />
            <span>-</span>
            <input
              type="number"
              value={tempFloorMax}
              placeholder={`${floorRange.max}`}
              onChange={(e) => setTempFloorMax(e.target.value)}
              onBlur={handleFloorBlur}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      )}


      {unitTypes && unitTypes.length > 0 && (
        <div className="flex flex-col">
          <label className="block font-medium">{t('unit_type')}</label>
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={selectedUnitType ?? ''}
            onChange={(e) => {
              const value = e.target.value || null;
              onUnitTypeChange?.(value);
            }}
          >
            <option value="All">{t('All')}</option>
            {unitTypes.map((type) => (
              <option key={type} value={type}>
                {t(type)}
              </option>
            ))}
          </select>
        </div>
      )}


    </aside>
  );
};

export default HouseFilter;
