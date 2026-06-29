'use client';

import type { Order, Product, ProductVariant } from './types';
import { normalizeGaMeasurementId, normalizeGoogleAdsId } from './analytics-config';

type AnalyticsItem = {
    item_id: string;
    item_name: string;
    item_variant?: string;
    item_category?: string;
    price: number;
    quantity?: number;
};

declare global {
    interface Window {
        dataLayer?: Array<Record<string, unknown>>;
        gtag?: (...args: unknown[]) => void;
    }
}

const DEFAULT_CURRENCY = 'EUR';

function canTrack() {
    return typeof window !== 'undefined';
}

function pushDataLayer(payload: Record<string, unknown>) {
    if (!canTrack()) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
    if (!canTrack()) return;

    pushDataLayer({ event: eventName, ...params });

    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }
}

function buildAnalyticsItem(product: Product, quantity = 1, variant?: ProductVariant): AnalyticsItem {
    return {
        item_id: variant?.sku || product.sku || product.id,
        item_name: product.title,
        item_variant: variant?.title,
        item_category: product.collection?.name || product.tags?.[0] || 'Vanille',
        price: ((variant?.price ?? product.price) || 0) / 100,
        quantity,
    };
}

export function trackViewItem(product: Product, variant?: ProductVariant) {
    const item = buildAnalyticsItem(product, 1, variant);
    trackEvent('view_item', {
        currency: DEFAULT_CURRENCY,
        value: item.price,
        items: [item],
    });
}

export function trackAddToCart(product: Product, quantity = 1, variant?: ProductVariant) {
    const item = buildAnalyticsItem(product, quantity, variant);
    trackEvent('add_to_cart', {
        currency: DEFAULT_CURRENCY,
        value: Number((item.price * quantity).toFixed(2)),
        items: [item],
    });
}

export function trackBeginCheckout(args: {
    items: Array<{ product: Product; quantity: number; price: number; variant?: ProductVariant }>;
    total: number;
}) {
    const items = args.items.map((item) => ({
        item_id: item.variant?.sku || item.product.sku || item.product.id,
        item_name: item.product.title,
        item_variant: item.variant?.title,
        item_category: item.product.collection?.name || item.product.tags?.[0] || 'Vanille',
        price: item.price / 100,
        quantity: item.quantity,
    }));

    trackEvent('begin_checkout', {
        currency: DEFAULT_CURRENCY,
        value: Number((args.total / 100).toFixed(2)),
        items,
    });
}

export function trackFormSubmit(formName: string, params: Record<string, unknown> = {}) {
    trackEvent('form_submit', { form_name: formName, ...params });
    // Generic conversion-friendly alias so it is easy to flag as a key event in GA4.
    trackEvent('generate_lead', { form_name: formName, ...params });
}

export function trackWhatsAppClick(location: string) {
    trackEvent('whatsapp_click', { link_location: location });
}

export function trackPurchase(order: Order) {
    const items = order.items.map((item) => ({
        item_id: item.product?.sku || item.productId,
        item_name: item.product?.title || 'Produit',
        item_variant: item.variantId,
        item_category: item.product?.collection?.name || item.product?.tags?.[0] || 'Vanille',
        price: item.price / 100,
        quantity: item.quantity,
    }));

    const value = Number((order.total / 100).toFixed(2));

    trackEvent('purchase', {
        transaction_id: order.orderNumber,
        currency: DEFAULT_CURRENCY,
        value,
        shipping: Number((((order.shippingCost ?? 0) || 0) / 100).toFixed(2)),
        tax: Number((((order.tax ?? 0) || 0) / 100).toFixed(2)),
        items,
    });

    const googleAdsId = normalizeGoogleAdsId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
    const purchaseLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL?.trim();

    if (googleAdsId && purchaseLabel && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
            send_to: `${googleAdsId}/${purchaseLabel}`,
            value,
            currency: DEFAULT_CURRENCY,
            transaction_id: order.orderNumber,
        });
    }
}
