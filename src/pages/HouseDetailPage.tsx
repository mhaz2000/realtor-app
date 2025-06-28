import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UnitDetail, UnitNearbyFacility } from '../types/unit';
import { getUnitDetail, toggleUnitLike } from '../api/units';
import LocationMap from '../components/LocationMap';
import {
    Hospital,
    GraduationCap,
    Bus,
    Utensils,
    ShoppingBag,
    Landmark,
    Phone,
    MapPin,
    PhoneCall,
    Heart
} from 'lucide-react';
import Modal from '../components/Modal';

const HouseDetailPage = () => {
    const { unitCode } = useParams<{ unitCode: string }>();
    const [unit, setUnit] = useState<UnitDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        if (!unitCode) return;

        setLoading(true);
        getUnitDetail(unitCode)
            .then((data) => setUnit(data))
            .catch((err) => console.error('Failed to load unit details', err))
            .finally(() => setLoading(false));
    }, [unitCode]);


    const getFacilityIcon = (category: keyof UnitNearbyFacility) => {
        switch (category) {
            case 'healthcare':
                return <Hospital className="w-4 h-4 text-red-600" />;
            case 'education':
                return <GraduationCap className="w-4 h-4 text-blue-600" />;
            case 'transport':
                return <Bus className="w-4 h-4 text-yellow-600" />;
            case 'restaurants':
                return <Utensils className="w-4 h-4 text-orange-600" />;
            case 'shopping':
                return <ShoppingBag className="w-4 h-4 text-green-600" />;
            default:
                return <Landmark className="w-4 h-4 text-gray-400" />;
        }
    };

    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        if (unit) {
            setIsLiked(unit.is_liked ?? false);
        }
    }, [unit]);

    const handleToggleLike = async () => {
        if (!unit) return;
        try {
            await toggleUnitLike(unit.unit_code);
            setIsLiked((prev) => !prev);
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    const [showContactModal, setShowContactModal] = useState(false);



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
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 my-5 bg-white rounded-md">

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

                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-3xl font-extrabold text-blue-700">{unit.project_name}</h1>

                    <button
                        onClick={() => setShowContactModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        <PhoneCall className="w-4 h-4" />
                        {t('contact_info') || 'Contact Info'}
                    </button>
                </div>

                {/* Main grid: Image + Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Image */}
                    <div className="relative h-64 rounded-lg overflow-hidden shadow-md bg-gray-100">
                        <img
                            src={
                                unit.location_info?.photos?.has_photos && unit.location_info.photos.main_photo_url
                                    ? unit.location_info.photos.main_photo_url
                                    : '/default-house.jpg'
                            }
                            alt={`${t('unit_code')}: ${unit.unit_code}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/default-house.jpg';
                            }}
                        />

                        <button
                            onClick={handleToggleLike}
                            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition"
                            aria-label={isLiked ? 'Unlike' : 'Like'}
                        >
                            <Heart
                                className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'
                                    }`}
                            />
                        </button>
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

                {unit.location_info?.project_details?.address ? (
                    <section className="bg-white rounded-lg shadow-md p-6 mt-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('location_info')}</h2>
                        <div className="space-y-2 text-gray-700 text-sm">
                            <p>
                                <b>{t('mapped_address')}:</b> {unit.location_info.project_details.address}
                            </p>
                            <p>
                                <b>{t('coordinates')}:</b> {unit.location_info.coordinates.latitude}, {unit.location_info.coordinates.longitude}
                            </p>
                            <div className="h-72">
                                <LocationMap
                                    lat={unit.location_info.coordinates.latitude}
                                    lng={unit.location_info.coordinates.longitude}
                                    title={unit.project_name}
                                />
                            </div>
                        </div>
                    </section>
                ) : null}


                {/* Nearby Facilities */}
                {unit.location_info?.facilities_data ? (
                    <section className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('nearby_facilities')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
                            {(['healthcare', 'education', 'transport', 'restaurants', 'shopping'] as const).map((category) => {
                                const facilities = unit.location_info.facilities_data[category];
                                if (!facilities || facilities.length === 0) return null;

                                return (
                                    <div key={category}>
                                        <h3 className="font-semibold text-blue-600 mb-2 flex items-center gap-1">
                                            {getFacilityIcon(category)}
                                            {t(category)}
                                        </h3>
                                        <ul className="space-y-2">
                                            {facilities
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                .map((f, index) => (
                                                    <li key={index} className="flex gap-2">
                                                        <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                                                        <div>
                                                            <div className="font-medium">{f.name}</div>
                                                            <div className="text-gray-600 text-xs">
                                                                {f.address ?? t('address_not_available')}
                                                                {f.phone && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Phone className="w-3 h-3 text-gray-400" />
                                                                        {f.phone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ) : null}
            </div>

            <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)}>
                <div className="text-center space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-blue-700">{t('contact_details') || 'Contact Details'}</h2>
                        <p className="text-sm text-gray-500">{t('project_contact_summary') || 'Get in touch with the builder or visit their website for more info.'}</p>
                    </div>

                    <div className="bg-blue-50 p-5 rounded-xl shadow-inner text-left space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-600">{t('builder') || 'Builder'}:</span>
                            <span className="text-blue-900 font-medium">
                                {unit.location_info?.project_details?.builder || '-'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-600">{t('contact_info') || 'Contact Info'}:</span>
                            {unit.location_info?.project_details?.contact_info ? (
                                <a
                                    href={unit.location_info.project_details.contact_info}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800 break-all"
                                >
                                    {unit.location_info.project_details.contact_info}
                                </a>
                            ) : (
                                <span className="text-gray-500">-</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowContactModal(false)}
                        className="mt-2 inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        {t('close') || 'Close'}
                    </button>
                </div>
            </Modal>

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
