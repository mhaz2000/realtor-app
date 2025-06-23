import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UnitDetail } from '../types/unit';
import { getUnitDetail } from '../api/units';
import { Stethoscope, Pill, HelpCircle, School } from 'lucide-react';
import LocationMap from '../components/LocationMap';

const HouseDetailPage = () => {
    const { unitCode } = useParams<{ unitCode: string }>();
    const [unit, setUnit] = useState<UnitDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pic = queryParams.get('pic');

    useEffect(() => {
        if (!unitCode) return;

        setLoading(true);
        getUnitDetail(unitCode)
            .then((data) => setUnit(data))
            .catch((err) => console.error('Failed to load unit details', err))
            .finally(() => setLoading(false));
    }, [unitCode]);


    const getIconForFacility = (category: string, type: string) => {
        if (category === 'healthcare') {
            if (type.toLowerCase().includes('clinic')) return <Stethoscope className="w-4 h-4 inline mr-1 text-blue-600" />;
            if (type.toLowerCase().includes('pharmacy')) return <Pill className="w-4 h-4 inline mr-1 text-green-600" />;
            return <HelpCircle className="w-4 h-4 inline mr-1 text-gray-400" />;
        }

        if (category === 'education') {
            return <School className="w-4 h-4 inline mr-1 text-purple-600" />;
        }

        return null;
    };


    if (loading)
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/buildings.jpg')" }}
            >
                <p className="text-center text-8xl py-20 text-white">{t('loading') || 'Loading...'}</p>
            </div>
        );

    if (!unit)
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/buildings.jpg')" }}
            >
                <p className="text-center text-lg py-20">{t('unit_not_found') || 'Unit not found.'}</p>
            </div>
        );

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/buildings.jpg')" }}
        >
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 mt-5 bg-white rounded-md">

                {/* Return button */}
                <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                    {isRtl ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            {/* Right arrow */}
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            {/* Left arrow */}
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    )}
                    {t('return_to_list') || 'Return to List'}
                </Link>

                <h1 className="text-3xl font-extrabold text-blue-700">{unit.project_name}</h1>

                {/* Main grid: Image + Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Image */}
                    <div className="md:col-span-1 rounded-lg overflow-hidden shadow-md h-64 bg-gray-100">
                        <img
                            src={pic || '/default-house.jpg'}
                            alt={t('unit_code') + ': ' + unit.unit_code}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/default-house.jpg';
                            }}
                        />
                    </div>

                    {/* Unit Details */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6">
                        {/* Left Column */}
                        <div className="space-y-3">
                            <DetailRow label={t('unit_code')} value={unit.unit_code} />
                            <DetailRow label={t('type')} value={unit.unit_type} />
                            <DetailRow label={t('floor')} value={unit.floor} />
                            <DetailRow label={t('view')} value={unit.view} />
                            <DetailRow label={t('status')} value={unit.status} />
                            <DetailRow label={t('completion_date')} value={unit.completion_date} />
                            <DetailRow label={t('currency')} value={unit.currency} />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            <DetailRow
                                label={t('area')}
                                value={!unit.total_area ? ' - ' : `${unit.total_area} ${unit.area_unit}`}
                            />
                            <DetailRow
                                label={t('net_area')}
                                value={!unit.net_area ? ' - ' : `${unit.net_area} ${unit.area_unit}`}
                            />
                            <DetailRow
                                label={t('terrace_area')}
                                value={!unit.terrace_area ? ' - ' : `${unit.terrace_area} ${unit.area_unit}`}
                            />
                            <DetailRow
                                label={t('balcony_area')}
                                value={!unit.balcony_area ? ' - ' : `${unit.balcony_area} ${unit.area_unit}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        {t('payment_info')}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 text-gray-700">
                        <DetailRow
                            label={t('asking_price')}
                            value={
                                unit.asking_price
                                    ? `${unit.asking_price.toLocaleString()} ${unit.currency}`
                                    : '-'
                            }
                            small
                        />
                        <DetailRow
                            label={t('full_payment')}
                            value={
                                unit.full_payment
                                    ? `${unit.full_payment.toLocaleString()} ${unit.currency}`
                                    : '-'
                            }
                            small
                        />
                        <DetailRow
                            label={t('payment_20_percent')}
                            value={
                                unit.payment_20_percent
                                    ? `${unit.payment_20_percent.toLocaleString()} ${unit.currency}`
                                    : '-'
                            }
                            small
                        />
                        <DetailRow
                            label={t('payment_50_percent')}
                            value={
                                unit.payment_50_percent
                                    ? `${unit.payment_50_percent.toLocaleString()} ${unit.currency}`
                                    : '-'
                            }
                            small
                        />
                        <DetailRow
                            label={t('payment_70_percent')}
                            value={
                                unit.payment_70_percent
                                    ? `${unit.payment_70_percent.toLocaleString()} ${unit.currency}`
                                    : '-'
                            }
                            small
                        />
                    </div>
                </section>

                {/* Location Info */}
                <section className="bg-white rounded-lg shadow-md p-6 mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('location_info')}</h2>
                    <div className="space-y-2 text-gray-700 text-sm">
                        <p>
                            <b>{t('mapped_address')}:</b> {unit.location_info.project_location.mapped_address}
                        </p>
                        <p>
                            <b>{t('coordinates')}:</b> {unit.location_info.project_location.latitude}, {unit.location_info.project_location.longitude}
                        </p>
                        <div>
                            <LocationMap
                                lat={unit.location_info.project_location.latitude}
                                lng={unit.location_info.project_location.longitude}
                                title={unit.project_name}
                            />
                        </div>
                    </div>
                </section>

                {/* Nearby Facilities */}
                <section className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('nearby_facilities')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                        {['healthcare', 'education', 'transport'].map((category) => {
                            const facilities = unit.location_info.nearby_facilities[category as keyof typeof unit.location_info.nearby_facilities];
                            return (
                                <div key={category}>
                                    <h3 className="font-semibold text-blue-600 mb-2">{t(category)}</h3>
                                    {facilities
                                        .sort((a, b) => a.distance_meters - b.distance_meters)
                                        .map((f, index) => (
                                            <li key={index} className="flex items-center gap-1">
                                                {getIconForFacility(category, f.type)}
                                                <span className="flex-1">
                                                    {f.name} – {f.distance_meters} m
                                                </span>
                                            </li>
                                        ))}
                                </div>
                            );
                        })}

                    </div>
                </section>

            </div>
        </div>
    );
};

type DetailRowProps = {
    label: string;
    value: string | number | null | undefined;
    small?: boolean;
};

const DetailRow = ({ label, value, small = false }: DetailRowProps) => (
    <div className={`flex justify-between ${small ? 'text-sm' : 'text-base'} font-medium`}>
        <span className="text-gray-600">{label}:</span>
        <span className="text-gray-900">{value ?? '-'}</span>
    </div>
);

export default HouseDetailPage;
