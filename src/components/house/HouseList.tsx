import { useEffect, useState } from 'react';
import type { Unit, UnitFilter } from '../../types/unit';
import { searchUnits } from '../../api/units';
import HouseFilter from './HouseFilter';
import { useTranslation } from 'react-i18next';


const HouseListPage = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [filters, setFilters] = useState({
    price: { min: null as number | null, max: null as number | null },
    area: { min: null as number | null, max: null as number | null },
    floor: { min: null as number | null, max: null as number | null },
    unit_type: null as string | null,
  });


  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [t] = useTranslation();

  const [unitsLoading, setUintsLoading] = useState(true);

  const updateRange = (
    key: 'price' | 'area' | 'floor',
    min: number | null,
    max: number | null
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: { min, max },
    }));
    setPage(1); // reset pagination
  };

  const updateUnitType = (value: string | null) => {
    setFilters(prev => ({
      ...prev,
      unit_type: value === 'All' ? null : value,
    }));
  };

  const fetchUnits = async () => {
    const filter: UnitFilter = {
      min_price: filters.price.min,
      max_price: filters.price.max,
      min_area: filters.area.min,
      max_area: filters.area.max,
      min_floor: filters.floor.min,
      max_floor: filters.floor.max,
      unit_type: filters.unit_type,
    };

    try {
      setUintsLoading(true);
      const data = await searchUnits(filter, 6, (page - 1) * 6);
      setUnits(data.units);
      setHasMore(data.pagination.has_next);
    } catch (err) {
      console.error('Failed to fetch units:', err);
    } finally {
      setUintsLoading(false);
    }
  };


  useEffect(() => {
    fetchUnits();
  }, [filters, page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));


  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <HouseFilter
        minPrice={filters.price.min}
        maxPrice={filters.price.max}
        minArea={filters.area.min}
        maxArea={filters.area.max}
        minFloor={filters.floor.min}
        maxFloor={filters.floor.max}
        selectedUnitType={filters.unit_type}
        onPriceChange={(min, max) => updateRange('price', min, max)}
        onAreaChange={(min, max) => updateRange('area', min, max)}
        onFloorChange={(min, max) => updateRange('floor', min, max)}
        onUnitTypeChange={(type) => updateUnitType(type)}
      />
      {unitsLoading ? (
        <section className="flex-1 p-4">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </section>
      ) : <section className="flex-1">
        {units.length === 0 ? (
          <p>{t('no_houses_found') || 'No houses found.'}</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.map((unit) => (
                <li
                  key={unit.unit_code}
                  className="bg-white border rounded-xl shadow hover:shadow-md overflow-hidden flex flex-col transition duration-200"
                >
                  {/* Default image */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src="/default-house.jpg"
                      alt="House"
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-house.jpg'; // fallback if not loading
                      }}
                    />
                  </div>

                  {/* Unit Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 mb-1">{unit.project_name}</h3>
                      <p className="text-sm text-gray-600">{t('type')}: {unit.unit_type}</p>
                      <p className="text-sm text-gray-600">{t('floor')}: {unit.floor}</p>
                      <p className="text-sm text-gray-600">{t('area')}: {unit.total_area} sqm</p>
                      <p className="text-sm text-gray-600">{t('view')}: {unit.view}</p>
                      <p className="text-sm text-gray-600">{t('completion')}: {unit.completion_date}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-green-600 text-md font-bold">
                        {t('price')}: {unit.full_payment.toLocaleString()} AED
                      </p>
                    </div>
                  </div>
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
      </section>}
    </div>
  );
};

export default HouseListPage;
