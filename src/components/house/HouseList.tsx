import { useEffect, useState } from 'react';
import type { Unit, UnitFilter } from '../../types/unit';
import { searchUnits } from '../../api/units';
import HouseFilter from './HouseFilter';
import { useTranslation } from 'react-i18next';


const HouseListPage = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [t] = useTranslation();

  const LIMIT = 6;

  const fetchUnits = async (min: number | null, max: number | null, page: number) => {
    if (min === null || max === null) return;

    const filter: UnitFilter = {
      min_price: min,
      max_price: max,
      limit: LIMIT,
      // page: page,
    };

    try {
      const data = await searchUnits(filter);
      setUnits(data);
      setHasMore(data.length === LIMIT);
    } catch (err) {
      console.error('Failed to fetch units:', err);
    }
  };

  useEffect(() => {
    if (minPrice !== null && maxPrice !== null) {
      fetchUnits(minPrice, maxPrice, page);
    }
  }, [minPrice, maxPrice, page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));

  const handlePriceChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1); // Reset page when filter changes
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <HouseFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
      />

      <section className="flex-1">
        {units.length === 0 ? (
          <p>{t('no_houses_found') || 'No houses found.'}</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.map((unit) => (
                <li key={unit.unit_code} className="border p-4 rounded shadow flex flex-col justify-around cursor-pointer hover:bg-blue-50">
                  <h3 className="font-bold">{unit.project_name}</h3>
                  <div>
                    <br />

                    <p>{t('type')}: {unit.unit_type}</p>
                    <p>{t('floor')}: {unit.floor}</p>
                    <p>{t('area')}: {unit.total_area} sqm</p>
                    <p>{t('view')}: {unit.view}</p>
                    <p>{t('completion')}: {unit.completion_date}</p>
                    <br />
                  </div>
                  <p className="text-green-600 font-semibold">
                    {t('price')}: ${unit.full_payment.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                {t('previous') || 'Previous'}
              </button>

              <span className="text-sm text-gray-600">{t('page') || 'Page'} {page}</span>

              <button
                onClick={handleNext}
                disabled={!hasMore}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                {t('next') || 'Next'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default HouseListPage;
