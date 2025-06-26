import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';
import type { DashboardData } from '../types/dashboard';
import { getDashboardData } from '../api/dashboard';

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        getDashboardData().then(setData).catch(console.error);
    }, []);

    if (!data) {
        return <div className="text-center py-16">{t('loading')}...</div>;
    }

    const { price_distribution, area_distribution } = data;

    const priceData = [
        { label: t('min_price'), value: price_distribution.min_price },
        { label: t('avg_price'), value: price_distribution.avg_price },
        { label: t('median_price'), value: price_distribution.median_price },
        { label: t('max_price'), value: price_distribution.max_price }
    ];

    const areaData = [
        { label: t('min_area'), value: area_distribution.min_area },
        { label: t('avg_area'), value: area_distribution.avg_area },
        { label: t('median_area'), value: area_distribution.median_area },
        { label: t('max_area'), value: area_distribution.max_area }
    ];

    return (
        <div className="p-6 space-y-10">
            <h1 className="text-3xl font-bold text-blue-700">{t('statistics')}</h1>

            {/* 📊 Price Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">{t('price_distribution')}</h2>
                <div dir='ltr'>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={priceData}
                            layout="vertical"
                            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis
                                type="category"
                                dataKey="label"
                                tick={{ fontSize: 14 }}
                                orientation="left" // <- always left, no RTL flip
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="value"
                                fill="url(#priceGradient)"
                                radius={[0, 8, 8, 0]} // rounded end
                            />
                            <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 📏 Area Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl">
                <h2 className="text-xl font-semibold text-green-600 mb-4">{t('area_distribution')}</h2>
                <div dir='ltr'>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={areaData}
                            layout="vertical"
                            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis
                                type="category"
                                dataKey="label"
                                tick={{ fontSize: 14 }}
                                orientation="left"
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="value"
                                fill="url(#areaGradient)"
                                radius={[0, 8, 8, 0]}
                            />
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#6EE7B7" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
