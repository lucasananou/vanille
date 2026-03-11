'use client';

import { useEffect, useRef, useState } from 'react';
import { paymentsApi } from '@/lib/api/payments';

declare global {
    interface Window {
        paypal?: any;
    }
}

interface PayPalButtonProps {
    amountInCents: number;
    subtotalAmountInCents?: number;
    shippingRateId?: string;
    taxInCents?: number;
    currency?: string;
    disabled?: boolean;
    onApproved: (paypalOrderId: string) => Promise<void>;
    onError: (message: string) => void;
}

function loadPayPalScript(clientId: string, currency: string) {
    const scriptId = 'paypal-sdk-script';
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existing) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture&components=buttons`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
        document.body.appendChild(script);
    });
}

export default function PayPalButton({
    amountInCents,
    subtotalAmountInCents,
    shippingRateId,
    taxInCents = 0,
    currency = 'EUR',
    disabled = false,
    onApproved,
    onError,
}: PayPalButtonProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        let buttonsInstance: any = null;

        const mountButtons = async () => {
            const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
            if (!clientId) {
                onError('PayPal indisponible: NEXT_PUBLIC_PAYPAL_CLIENT_ID manquant.');
                return;
            }

            try {
                await loadPayPalScript(clientId, currency);
                if (isCancelled || !containerRef.current || !window.paypal?.Buttons) return;

                containerRef.current.innerHTML = '';

                buttonsInstance = window.paypal.Buttons({
                    style: {
                        shape: 'pill',
                        layout: 'vertical',
                        label: 'paypal',
                        height: 48,
                    },
                    createOrder: async () => {
                        const order = await paymentsApi.createPayPalOrder(
                            amountInCents,
                            currency,
                            subtotalAmountInCents,
                            shippingRateId,
                            taxInCents,
                        );
                        return order.id;
                    },
                    onApprove: async (data: { orderID: string }) => {
                        await onApproved(data.orderID);
                    },
                    onError: (err: any) => {
                        console.error('PayPal error:', err);
                        onError('Le paiement PayPal a échoué. Veuillez réessayer.');
                    },
                });

                if (!buttonsInstance.isEligible()) {
                    onError('PayPal n’est pas disponible sur cet appareil/navigateur.');
                    return;
                }

                await buttonsInstance.render(containerRef.current);
                if (!isCancelled) {
                    setIsReady(true);
                }
            } catch (error: any) {
                console.error('Failed to init PayPal:', error);
                onError(error?.message || 'Impossible de charger PayPal.');
            }
        };

        setIsReady(false);
        mountButtons();

        return () => {
            isCancelled = true;
            if (buttonsInstance?.close) {
                buttonsInstance.close();
            }
        };
    }, [amountInCents, subtotalAmountInCents, shippingRateId, taxInCents, currency, onApproved, onError]);

    return (
        <div>
            {disabled && (
                <p className="text-sm text-cacao-600 mb-3">
                    Veuillez compléter vos informations de livraison pour payer avec PayPal.
                </p>
            )}
            <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
                <div ref={containerRef} />
            </div>
            {!isReady && (
                <p className="text-xs text-cacao-500 mt-2">Chargement de PayPal...</p>
            )}
        </div>
    );
}
