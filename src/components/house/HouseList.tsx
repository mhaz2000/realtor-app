import { useEffect, useState } from 'react';
import type { Unit, UnitFilter } from '../../types/unit';
import { searchUnits } from '../../api/units';
import HouseFilter from './HouseFilter';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const HouseListPage = () => {


  const [units, setUnits] = useState<Unit[]>([]);
  const [filters, setFilters] = useState({
    price: { min: null as number | null, max: null as number | null },
    area: { min: null as number | null, max: null as number | null },
    floor: { min: null as number | null, max: null as number | null },
    unit_type: null as string | null,
    view: null as string | null,
    parkingSlot: { min: null as number | null, max: null as number | null }
  });


  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [t] = useTranslation();

  const [unitsLoading, setUintsLoading] = useState(true);

  const updateRange = (
    key: 'price' | 'area' | 'floor' | 'parking',
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

  const updateView = (value: string | null) => {
    setFilters(prev => ({
      ...prev,
      view: value,
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
      const data = await searchUnits(filter, 8, (page - 1) * 8);
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
    <div className="flex flex-col gap-4 sm:flex-col">
      <HouseFilter
        minPrice={filters.price.min}
        maxPrice={filters.price.max}
        minArea={filters.area.min}
        maxArea={filters.area.max}
        minFloor={filters.floor.min}
        maxFloor={filters.floor.max}
        selectedUnitType={filters.unit_type}
        maxParking={filters.parkingSlot.max}
        minParking={filters.parkingSlot.min}
        viewFilter={filters.view}
        onPriceChange={(min, max) => updateRange('price', min, max)}
        onAreaChange={(min, max) => updateRange('area', min, max)}
        onFloorChange={(min, max) => updateRange('floor', min, max)}
        onParkingChange={(min, max) => updateRange('parking', min, max)}
        onUnitTypeChange={(type) => updateUnitType(type)}
        onViewFilterChange={(view) => updateView(view)}
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
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {units.map((unit) => (
                <li
                  key={unit.unit_code}
                  className="bg-white border rounded-xl shadow hover:shadow-md overflow-hidden flex flex-col transition duration-200"
                >
                  {/* Default image */}
                  <Link to={`/house/${unit.unit_code}`} target='_blank' className="relative flex-1 group">
                    <div className="relative h-96 overflow-hidden">
                      <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105">
                        <img
                          src={unit.main_photo_url || '/default-house.jpg'}
                          alt="House"
                          className="object-cover h-full w-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-house.jpg';
                          }}
                        />
                      </div>

                      {/* Overlay Info */}
                      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white p-4 overflow-hidden">
                        {/* Default view: name + price */}
                        <div className="pt-8 group-hover:opacity-0 group-hover:translate-y-2 transition-all duration-500 ease-in-out">
                          <h3 className="text-lg font-semibold">{unit.project_name}</h3>
                          <hr className="border-t border-white/30 my-1" />
                          <p className="text-green-400 text-md font-bold">
                            {t('price')}: {unit.full_payment.toLocaleString()} AED
                          </p>
                        </div>

                        {/* Hover view: full details */}
                        <div className="absolute inset-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                          <div className="space-y-1 text-sm">
                            <h3 className="text-lg font-semibold">{unit.project_name}</h3>
                            <p><b>{t('price')}</b>: {unit.full_payment.toLocaleString()} AED</p>
                            <p><b>{t('type')}</b>: {unit.unit_type}</p>
                            <p><b>{t('floor')}</b>: {unit.floor}</p>
                            <p><b>{t('area')}</b>: {unit.total_area} sqm</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </Link>
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
