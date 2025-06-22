import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  getAreaRange,
  getFloorRange,
  getPriceRange,
  getUnitTypes,
} from '../../api/units';

type Range = { min: number; max: number };
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

const SliderSection = ({
  label,
  range,
  tempVals,
  setTempVals,
  onBlur,
}: {
  label: string;
  range: Range;
  tempVals: [string, string];
  setTempVals: (vals: [string, string]) => void;
  onBlur: () => void;
  dir: 'ltr' | 'rtl';
  t: (s: string) => string;
}) => (
  <div className="space-y-2 w-full">
    <label className="block font-medium">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="w-full border rounded p-2"
        value={tempVals[0]}
        placeholder={`${range.min}`}
        onChange={(e) =>
          setTempVals([e.target.value, tempVals[1]])
        }
        onBlur={onBlur}
      />
      <span>-</span>
      <input
        type="number"
        className="w-full border rounded p-2"
        value={tempVals[1]}
        placeholder={`${range.max}`}
        onChange={(e) =>
          setTempVals([tempVals[0], e.target.value])
        }
        onBlur={onBlur}
      />
    </div>
    {/* rc-slider component */}
    <Slider
      range
      min={range.min}
      max={range.max}
      value={[
        parseInt(tempVals[0]) || range.min,
        parseInt(tempVals[1]) || range.max,
      ]}
      onChange={(value) => {
        const [min, max] = value as number[];
        setTempVals([min.toString(), max.toString()]);
      }}
      onChangeComplete={(value) => {
        const [min, max] = value as number[];
        setTempVals([min.toString(), max.toString()]);
        onBlur();
      }}
      allowCross={false}
      styles={{
        rail: { backgroundColor: '#d1d5db', height: 6 },
        track: { backgroundColor: '#34D399', height: 6 },
        handle: { borderColor: '#34D399', backgroundColor: 'white' },  // OK per type
      }}
    />
  </div>
);

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

  // Load base ranges once
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
      .catch(() =>
        setFloorRange({ min: 0, max: 30 })
      );
    getUnitTypes().then((data) => setUnitTypes(data));
  }, []);

  // sync props
  useEffect(() => {
    if (priceRange) setTempPrice([minPrice?.toString() ?? '', maxPrice?.toString() ?? '']);
  }, [minPrice, maxPrice]);
  useEffect(() => {
    if (areaRange) setTempArea([minArea?.toString() ?? '', maxArea?.toString() ?? '']);
  }, [minArea, maxArea]);
  useEffect(() => {
    if (floorRange) setTempFloor([minFloor?.toString() ?? '', maxFloor?.toString() ?? '']);
  }, [minFloor, maxFloor]);

  return (
    <div className={`max-h-max w-full p-4 bg-white rounded shadow ${dir === 'rtl' ? 'sm:order-2' : 'sm:order-1'}`}>
      <h2 className="text-xl font-semibold mb-4">{t('filterHouses')}</h2>

      <section className="flex flex-col items-center justify-around gap-4 sm:flex-row sm:gap-12">
        {priceRange && (
          <SliderSection
            label={t('priceRange')}
            range={priceRange}
            tempVals={tempPrice}
            setTempVals={setTempPrice}
            onBlur={() => {
              const [min, max] = tempPrice.map((v) => {
                const num = parseInt(v, 10);
                return isNaN(num) ? null : Math.min(Math.max(priceRange.min, num), priceRange.max);
              }) as [number | null, number | null];
              onPriceChange(min, max);
            }}
            dir={dir}
            t={t}
          />
        )}
        {areaRange && (
          <SliderSection
            label={t('areaRange')}
            range={areaRange}
            tempVals={tempArea}
            setTempVals={setTempArea}
            onBlur={() => {
              const [min, max] = tempArea.map((v) => {
                const num = parseInt(v, 10);
                return isNaN(num) ? null : Math.min(Math.max(areaRange.min, num), areaRange.max);
              }) as [number | null, number | null];
              onAreaChange(min, max);
            }}
            dir={dir}
            t={t}
          />
        )}
      </section>

      <section className="flex flex-col items-center justify-around gap-4 mt-4 sm:flex-row sm:gap-12">
        {floorRange && (
          <SliderSection
            label={t('floorRange')}
            range={floorRange}
            tempVals={tempFloor}
            setTempVals={setTempFloor}
            onBlur={() => {
              const [min, max] = tempFloor.map((v) => {
                const num = parseInt(v, 10);
                return isNaN(num) ? null : Math.min(Math.max(floorRange.min, num), floorRange.max);
              }) as [number | null, number | null];
              onFloorChange(min, max);
            }}
            dir={dir}
            t={t}
          />
        )}
        {unitTypes.length > 0 && onUnitTypeChange && (
          <div className="flex flex-col w-full">
            <label className="block font-medium mb-2">{t('unit_type')}</label>
            <select
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={selectedUnitType ?? ''}
              onChange={(e) => onUnitTypeChange(e.target.value || null)}
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
      </section>
    </div>
  );
};

export default HouseFilter;
