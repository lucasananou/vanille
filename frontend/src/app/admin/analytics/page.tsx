'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminDashboardApi, type GoogleAnalyticsDashboard } from '@/lib/api/admin-dashboard';

const numberFmt = new Intl.NumberFormat('fr-FR');
const percentFmt = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins} min ${secs.toString().padStart(2, '0')} s`;
}

export default function AdminAnalyticsPage() {
    const { token } = useAdminAuth();
    const [analytics, setAnalytics] = useState<GoogleAnalyticsDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!token) return;

            try {
                const data = await adminDashboardApi.getAnalytics(token);
                setAnalytics(data);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setError('Impossible de charger les données Google Analytics.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [token]);

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-zinc-200 rounded w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-zinc-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    {error || 'Impossible de charger les analytics'}
                </div>
            </div>
        );
    }

    const summaryCards = [
        { label: 'Utilisateurs actifs', value: numberFmt.format(analytics.summary.activeUsers) },
        { label: 'Sessions', value: numberFmt.format(analytics.summary.sessions) },
        { label: 'Pages vues', value: numberFmt.format(analytics.summary.pageViews) },
        { label: 'Durée moy. session', value: formatDuration(analytics.summary.averageSessionDuration || 0) },
    ];

    const topSeriesValue = Math.max(
        ...analytics.timeseries.flatMap((point) => [point.activeUsers, point.sessions, point.pageViews]),
        1,
    );

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Analytics</h1>
                    <p className="mt-1 text-zinc-500">
                        Vue détaillée Google Analytics sur les {analytics.periodLabel.toLowerCase()}.
                        {analytics.propertyId ? ` Propriété ${analytics.propertyId}.` : ''}
                    </p>
                </div>
                <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${analytics.configured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {analytics.configured ? 'GA4 connecté' : 'Configuration requise'}
                </span>
            </div>

            {!analytics.configured && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                    <p className="font-medium">Les identifiants Google Analytics ne permettent pas encore de lire les rapports détaillés.</p>
                    {analytics.error && <p className="mt-2 text-sm">{analytics.error}</p>}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-xl border border-zinc-200 bg-white p-6">
                        <p className="text-sm font-medium text-zinc-500">{card.label}</p>
                        <p className="mt-3 text-3xl font-bold text-zinc-900">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 rounded-xl border border-zinc-200 bg-white p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900">Évolution quotidienne</h2>
                            <p className="text-sm text-zinc-500">Utilisateurs, sessions et pages vues.</p>
                        </div>
                        <div className="text-sm text-zinc-500">
                            Taux de rebond : <span className="font-semibold text-zinc-900">{percentFmt.format(analytics.summary.bounceRate)}%</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {analytics.timeseries.map((point) => (
                            <div key={point.date}>
                                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                                    <span>{point.date}</span>
                                    <span>{numberFmt.format(point.sessions)} sessions</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="rounded-full bg-zinc-100 h-2 overflow-hidden">
                                        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(point.activeUsers / topSeriesValue) * 100}%` }} />
                                    </div>
                                    <div className="rounded-full bg-zinc-100 h-2 overflow-hidden">
                                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(point.sessions / topSeriesValue) * 100}%` }} />
                                    </div>
                                    <div className="rounded-full bg-zinc-100 h-2 overflow-hidden">
                                        <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(point.pageViews / topSeriesValue) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Acquisition</h2>
                    <div className="space-y-3">
                        {analytics.channels.map((channel) => (
                            <div key={channel.label} className="rounded-lg bg-zinc-50 px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-zinc-700">{channel.label}</span>
                                    <span className="text-sm font-semibold text-zinc-900">{numberFmt.format(channel.value)} sessions</span>
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">{numberFmt.format(channel.secondaryValue || 0)} utilisateurs</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Top pages</h2>
                    <div className="space-y-3">
                        {analytics.topPages.map((page) => (
                            <div key={page.label} className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-zinc-900 break-all">{page.label}</p>
                                    <p className="text-xs text-zinc-500">{numberFmt.format(page.secondaryValue || 0)} utilisateurs</p>
                                </div>
                                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">{numberFmt.format(page.value)} vues</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Événements</h2>
                    <div className="space-y-3">
                        {analytics.events.map((event) => (
                            <div key={event.eventName} className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">{event.eventName}</p>
                                    <p className="text-xs text-zinc-500">{numberFmt.format(event.users)} utilisateurs</p>
                                </div>
                                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">{numberFmt.format(event.eventCount)} events</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Pays</h2>
                    <div className="space-y-3">
                        {analytics.countries.map((country) => (
                            <div key={country.label} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
                                <span className="text-sm text-zinc-700">{country.label}</span>
                                <span className="text-sm font-semibold text-zinc-900">{numberFmt.format(country.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Appareils</h2>
                    <div className="space-y-3">
                        {analytics.devices.map((device) => (
                            <div key={device.label} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
                                <span className="text-sm capitalize text-zinc-700">{device.label}</span>
                                <span className="text-sm font-semibold text-zinc-900">{numberFmt.format(device.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
