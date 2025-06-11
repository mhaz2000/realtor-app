import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import HouseFilter from '../components/house/HouseFilter';

const houses = [
  { id: 1, title: 'Modern Apartment', location: 'New York', price: 500000 },
  { id: 2, title: 'Cottage by Lake', location: 'Michigan', price: 300000 },
  { id: 3, title: 'Luxury Villa', location: 'California', price: 1200000 },
];

const Home = () => {
  const { i18n, t } = useTranslation();
  const dir = i18n.dir();

  const [filterText, setFilterText] = useState('');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const handlePriceChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const filteredHouses = houses.filter((house) => {
    const matchesText =
      house.title.toLowerCase().includes(filterText.toLowerCase()) ||
      house.location.toLowerCase().includes(filterText.toLowerCase());

    const matchesMin = minPrice === null || house.price >= minPrice;
    const matchesMax = maxPrice === null || house.price <= maxPrice;

    return matchesText && matchesMin && matchesMax;
  });

  return (
    <div dir={dir} className="min-h-screen flex flex-col sm:flex-row bg-gray-100 p-4">
      <HouseFilter
        filterText={filterText}
        onFilterTextChange={setFilterText}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
      />

      <main className="flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('availableHouses')}</h2>
        {filteredHouses.length === 0 ? (
          <p>{t('noHousesFound')}</p>
        ) : (
          <ul className="space-y-4">
            {filteredHouses.map((house) => (
              <li key={house.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{house.title}</h3>
                <p>{house.location}</p>
                <p className="text-blue-600 font-bold">${house.price.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Home;
