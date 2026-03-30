'use client';

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '';
const whatsappMessage = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Bonjour, j’ai une question avant de commander sur M.S.V-NOSY BE.'
);

export default function QuickContact() {
    if (!whatsappNumber) {
        return null;
    }

    return (
        <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-[80] inline-flex items-center gap-3 rounded-full border border-[#25D366]/20 bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            aria-label="Contacter M.S.V-NOSY BE sur WhatsApp"
        >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A11.8 11.8 0 0 0 12.12 0C5.5 0 .12 5.38.12 12c0 2.12.56 4.19 1.61 6.02L0 24l6.17-1.62A11.92 11.92 0 0 0 12.12 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.6-8.52Zm-8.4 18.5a9.96 9.96 0 0 1-5.08-1.4l-.36-.21-3.66.96.98-3.56-.24-.37a9.9 9.9 0 0 1-1.54-5.4c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.1 1.02 6.97 2.9A9.8 9.8 0 0 1 22 12.1c0 5.45-4.44 9.88-9.88 9.88Zm5.42-7.4c-.3-.16-1.78-.88-2.06-.98-.28-.1-.48-.16-.68.16-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.08-.3-.16-1.28-.48-2.44-1.52-.9-.8-1.52-1.8-1.7-2.1-.18-.32-.02-.48.14-.64.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.06-.38-.02-.54-.08-.16-.68-1.64-.94-2.24-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.54.08-.82.38-.28.3-1.08 1.06-1.08 2.58 0 1.52 1.1 3 1.26 3.2.16.2 2.14 3.26 5.18 4.56.72.32 1.28.5 1.72.64.72.22 1.38.18 1.9.12.58-.08 1.78-.72 2.04-1.42.26-.7.26-1.3.18-1.42-.08-.12-.28-.2-.58-.36Z" />
            </svg>
            WhatsApp
        </a>
    );
}

