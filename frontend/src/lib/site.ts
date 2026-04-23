export const DEFAULT_SITE_URL = 'https://msv-nosy-bemada.fr';
export const DEFAULT_API_URL = 'https://vanille-production.up.railway.app';
export const DEFAULT_CONTACT_EMAIL = 'contact@vanille-nosybe.fr';
export const DEFAULT_CONTACT_PHONE_DISPLAY = '+261 32 98 595 50';
export const DEFAULT_CONTACT_PHONE_RAW = '261329859550';
export const DEFAULT_CONTACT_HOURS_FR = 'Lundi au samedi, 8h à 18h (heure de Madagascar)';
export const DEFAULT_CONTACT_HOURS_EN = 'Monday to Saturday, 8 AM to 6 PM (Madagascar time)';
export const DEFAULT_WHATSAPP_MESSAGE_FR = 'Bonjour, j’ai une question avant de commander sur M.S.V-NOSY BE.';
export const DEFAULT_WHATSAPP_MESSAGE_EN = 'Hello, I have a question before placing an order on M.S.V-NOSY BE.';

export function getSiteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
}

export function getApiUrl() {
    return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}

function normalizePhone(value: string) {
    return value.replace(/\D/g, '');
}

export function getContactEmail() {
    return (process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL).trim();
}

export function getContactPhoneDisplay() {
    return (process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || DEFAULT_CONTACT_PHONE_DISPLAY).trim();
}

export function getContactPhoneRaw() {
    const source = process.env.NEXT_PUBLIC_CONTACT_PHONE_RAW
        || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
        || DEFAULT_CONTACT_PHONE_RAW;

    return normalizePhone(source);
}

export function getContactPhoneHref() {
    return `tel:+${getContactPhoneRaw()}`;
}

export function getWhatsappHref(locale: 'fr' | 'en' = 'fr') {
    const phone = getContactPhoneRaw();
    const message = locale === 'en'
        ? (process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE_EN || DEFAULT_WHATSAPP_MESSAGE_EN)
        : (process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE_FR || DEFAULT_WHATSAPP_MESSAGE_FR);

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getContactHours(locale: 'fr' | 'en' = 'fr') {
    return locale === 'en'
        ? (process.env.NEXT_PUBLIC_CONTACT_HOURS_EN || DEFAULT_CONTACT_HOURS_EN)
        : (process.env.NEXT_PUBLIC_CONTACT_HOURS_FR || DEFAULT_CONTACT_HOURS_FR);
}
