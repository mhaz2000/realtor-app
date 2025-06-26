import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Hospital,
  School,
  Bus,
  ShoppingCart,
  Utensils
} from 'lucide-react';
import type { AdminLocation } from '../../types/admin';
import { SendLocation } from '../../api/admin';
import LocationMap from '../LocationMap';

const AdminLocationSearch = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [result, setResult] = useState<AdminLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await SendLocation({ location });
      setResult(data);
    } catch (err: any) {
      setError(t('location_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-purple-600">
        {t('location_search')}
      </h2>

      <div className="flex gap-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('enter_location')}
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !location.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {loading ? t('searching') : t('search')}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {result && (
        <div className="space-y-4">
          {/* Map */}
          <LocationMap
            lat={result.coordinates.latitude}
            lng={result.coordinates.longitude}
            title={result.location}
          />

          {/* Coordinates + Radius */}
          <div className="text-sm text-gray-600">
            <p>
              <strong>{t('coordinates')}:</strong>{' '}
              {result.coordinates.latitude}, {result.coordinates.longitude}
            </p>
            <p>
              <strong>{t('search_radius')}:</strong>{' '}
              {result.search_radius_meters.toLocaleString()} {t('meters')}
            </p>
          </div>

          {/* Facilities */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Hospital className="text-red-500 w-5 h-5" />
              <span>{t('healthcare')}: {result.facilities_summary.healthcare}</span>
            </div>
            <div className="flex items-center gap-2">
              <School className="text-yellow-500 w-5 h-5" />
              <span>{t('education')}: {result.facilities_summary.education}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bus className="text-blue-500 w-5 h-5" />
              <span>{t('transport')}: {result.facilities_summary.transport}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-green-500 w-5 h-5" />
              <span>{t('shopping')}: {result.facilities_summary.shopping}</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="text-pink-500 w-5 h-5" />
              <span>{t('restaurants')}: {result.facilities_summary.restaurants}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocationSearch;
