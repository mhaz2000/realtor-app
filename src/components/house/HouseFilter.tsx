import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPriceRange } from '../../api/units';
import { Bot } from 'lucide-react';

type HouseFilterProps = {
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  setIsOpen: (status: boolean) => void
};

const HouseFilter = ({
  minPrice,
  maxPrice,
  onPriceChange,
  setIsOpen
}: HouseFilterProps) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const [range, setRange] = useState<{ min_price: number; max_price: number } | null>(null);

  const [tempMin, setTempMin] = useState<string>('');
  const [tempMax, setTempMax] = useState<string>('');

  useEffect(() => {
    getPriceRange()
      .then((data) => {
        setRange(data);
        onPriceChange(data.min_price, data.max_price);
        setTempMin(minPrice?.toString() ?? '');
        setTempMax(maxPrice?.toString() ?? '');
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setTempMin(minPrice?.toString() ?? '');
  }, [minPrice]);

  useEffect(() => {
    setTempMax(maxPrice?.toString() ?? '');
  }, [maxPrice]);

  const handleMinBlur = () => {
    if (!range) return;
    const value = parseInt(tempMin, 10);

    if (isNaN(value)) {
      onPriceChange(null, maxPrice);
      setTempMin(''); // reset local state to empty
    } else {
      let adjustedMin = Math.max(range.min_price, value);
      let adjustedMax = maxPrice;

      if (adjustedMax !== null && adjustedMax < adjustedMin) {
        adjustedMax = adjustedMin;
      }

      setTempMin(adjustedMin.toString());  // update local state here
      onPriceChange(adjustedMin, adjustedMax);
    }
  };

  const handleMaxBlur = () => {
    if (!range) return;
    const value = parseInt(tempMax, 10);

    if (isNaN(value)) {
      onPriceChange(minPrice, null);
      setTempMax('');
    } else {
      let adjustedMax = Math.min(range.max_price, value);
      let adjustedMin = minPrice;

      if (adjustedMin !== null && adjustedMax < adjustedMin) {
        adjustedMax = adjustedMin;
      }

      setTempMax(adjustedMax.toString()); // update local state here
      onPriceChange(adjustedMin, adjustedMax);
    }
  };


  return (
    <aside
      className={`
        h-screen w-full sm:w-1/4 p-4 bg-white rounded shadow
        ${dir === 'rtl' ? 'sm:order-2' : 'sm:order-1'}
      `}
    >
      <h2 className="text-xl font-semibold mb-4">{t('filterHouses')}</h2>

      {range && (
        <div className="space-y-2">
          <label className="block font-medium">{t('priceRange')}</label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempMin}
              placeholder={`${range.min_price}`}
              onChange={(e) => setTempMin(e.target.value)}
              onBlur={handleMinBlur}
              className="w-full border rounded p-2"
            />
            <span>-</span>
            <input
              type="number"
              value={tempMax}
              placeholder={`${range.max_price}`}
              onChange={(e) => setTempMax(e.target.value)}
              onBlur={handleMaxBlur}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      )}


      <button
        className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 ...`}
        onClick={() => setIsOpen(true)}
      >
        <div className='p-3 bg-blue-600 rounded-full'>
          <Bot className="w-6 h-6 text-white" />
        </div>
      </button>

      {/* <textarea
        placeholder={t('searchByAI')}
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mt-4 h-60"
      /> */}

    </aside>
  );
};

export default HouseFilter;
