import { useEffect, useState } from 'react';
import type { Unit, UnitFilter } from '../../types/unit';
import { searchUnits } from '../../api/units';
import HouseFilter from './HouseFilter';

type HouseListType = {
  setIsOpen: (value: boolean) => void;
  filterText: string
}

const HouseListPage = ({ filterText, setIsOpen }: HouseListType) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const fetchUnits = async (min: number | null, max: number | null) => {
    if (min === null || max === null) return;

    const filter: UnitFilter = {
      min_price: min,
      max_price: max,
      limit: 6, // set your desired limit
    };

    try {
      const data = await searchUnits(filter);
      setUnits(data);
    } catch (err) {
      console.error('Failed to fetch units:', err);
    }
  };

  useEffect(() => {
    if (minPrice !== null && maxPrice !== null) {
      fetchUnits(minPrice, maxPrice);
    }
  }, [minPrice, maxPrice]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <HouseFilter
        setIsOpen={setIsOpen}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
      />

      <section className="flex-1">
        {units.length === 0 ? (
          <p>No houses found.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => (
              <li key={unit.unit_code} className="border p-4 rounded shadow">
                <h3 className="font-bold">{unit.project_name}</h3>
                <p>Type: {unit.unit_type}</p>
                <p>Floor: {unit.floor}</p>
                <p>Area: {unit.total_area} sqm</p>
                <p>View: {unit.view}</p>
                <p>Completion: {unit.completion_date}</p>
                <p className="text-green-600 font-semibold">
                  Price: ${unit.full_payment.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default HouseListPage;
