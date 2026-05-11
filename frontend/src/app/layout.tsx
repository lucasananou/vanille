import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import CartDrawer from "@/components/cart-drawer";
import QuickContact from "@/components/quick-contact";
import { GoogleAnalytics } from '@next/third-parties/google';
import { normalizeGaMeasurementId } from "@/lib/analytics-config";
import { getSiteUrl } from "@/lib/site";
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { LocaleProvider } from '@/lib/locale-context';
import { normalizeLocale, stripLocalePrefix, withLocale } from '@/lib/i18n';

const googleAnalyticsId = normalizeGaMeasurementId(process.env.NEXT_PUBLIC_GA_ID || 'G-R6KF4N6CCF');
const googleTagManagerId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || '';
const siteUrl = getSiteUrl();

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const locale = normalizeLocale(headerStore.get('x-locale'));
  const visiblePath = headerStore.get('x-visible-pathname') || `/${locale}`;
  const strippedPath = stripLocalePrefix(visiblePath);
  const frPath = withLocale(strippedPath, 'fr');
  const enPath = withLocale(strippedPath, 'en');

  const title = locale === 'en'
    ? 'M.S.V-NOSY BE | Premium Madagascar Vanilla'
    : 'M.S.V-NOSY BE | Vanille de Madagascar premium';
  const description = locale === 'en'
    ? 'Premium Madagascar vanilla selected in Nosy-Be. Bourbon vanilla pods, discovery sets, and delivery across France, Europe and the USA.'
    : 'Vanille de Madagascar premium sélectionnée à Nosy-Be. Gousses de vanille Bourbon, packs découverte, livraison France, Europe et USA.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: '%s | M.S.V-NOSY BE',
    },
    description,
    keywords: locale === 'en'
      ? [
          'Madagascar vanilla',
          'Bourbon vanilla',
          'premium vanilla pods',
          'Nosy-Be vanilla',
          'Madagascar gourmet vanilla',
        ]
      : [
          'vanille Madagascar',
          'vanille bourbon',
          'gousses de vanille premium',
          'vanille Nosy-Be',
          'vanille de Madagascar premium',
        ],
    alternates: {
      canonical: locale === 'en' ? enPath : frPath,
      languages: {
        'fr-FR': frPath,
        'en-US': enPath,
        'x-default': frPath,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      url: `${siteUrl}${locale === 'en' ? enPath : frPath}`,
      siteName: 'M.S.V-NOSY BE',
      title,
      description,
      images: [
        {
          url: '/logo_msv.png',
          width: 1200,
          height: 1200,
          alt: 'Logo M.S.V-NOSY BE',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo_msv.png'],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const locale = normalizeLocale(headerStore.get('x-locale') || cookieStore.get('site_locale')?.value);

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased bg-jungle-900 text-vanilla-50 font-sans">
        {googleTagManagerId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <QuickContact />
            </CartProvider>
          </AuthProvider>
        </LocaleProvider>
        {googleTagManagerId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${googleTagManagerId}');
            `}
          </Script>
        ) : null}
        {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
        <Script id="global-structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'M.S.V-NOSY BE',
              url: siteUrl,
              logo: `${siteUrl}/logo_msv.png`,
              sameAs: [
                'https://www.instagram.com/m.s.vnosybe',
                'https://www.facebook.com/abou.moridy',
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'M.S.V-NOSY BE',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/shop?search={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
          ])}
        </Script>
      </body>
    </html>
  );
}
