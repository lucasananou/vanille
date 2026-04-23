'use client';

import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';

const frFaqs = [
    {
        question: 'Quelle est la différence entre la vanille TK et la vanille Gourmet ?',
        answer: 'La vanille Gourmet est plus charnue, plus souple et mieux adaptée aux usages premium, aux cadeaux gourmands et à certaines finitions visuelles. La vanille TK garde un très beau profil aromatique et convient parfaitement à la pâtisserie, à l’infusion et à l’extrait maison.'
    },
    {
        question: 'Comment conserver mes gousses de vanille ?',
        answer: 'Conservez vos gousses dans leur conditionnement d’origine, à l’abri de la chaleur, de la lumière et de l’humidité. Évitez le réfrigérateur. Une bonne conservation aide à préserver leur souplesse et leur intensité aromatique.'
    },
    {
        question: 'Comment utiliser la vanille en pâtisserie ou pour un extrait maison ?',
        answer: 'Vous pouvez fendre la gousse, gratter les grains puis utiliser à la fois les grains et l’enveloppe pour infuser une crème, un lait, un sirop ou un rhum. Les formats proposés conviennent aussi bien à la pâtisserie du quotidien qu’à l’extrait maison.'
    },
    {
        question: 'Quels sont les délais de livraison ?',
        answer: 'Les commandes sont généralement préparées sous 24 à 48 heures ouvrées. Les délais de transport varient ensuite selon la destination et le transporteur sélectionné.'
    },
    {
        question: 'Proposez-vous des commandes professionnelles ou en volume ?',
        answer: 'Oui. Nous accompagnons les professionnels, importateurs, pâtissiers, restaurateurs et revendeurs avec des formats adaptés, des volumes spécifiques et une réponse dédiée via la page Professionnels ou WhatsApp.'
    },
    {
        question: 'Puis-je vous contacter avant de commander ?',
        answer: 'Oui. Vous pouvez nous écrire via la page contact ou directement sur WhatsApp si vous avez besoin d’un conseil sur le grade, la longueur, le conditionnement ou un besoin B2B.'
    }
];

const enFaqs = [
    {
        question: 'What is the difference between TK and Gourmet vanilla?',
        answer: 'Gourmet vanilla pods are fleshier, more supple and better suited to premium presentation, gifting and top-end recipes. TK vanilla still delivers an excellent aromatic profile and works perfectly for pastry, infusion and homemade extract.'
    },
    {
        question: 'How should I store vanilla pods?',
        answer: 'Keep your pods in their original packaging, away from heat, light and humidity. Avoid the refrigerator. Proper storage helps preserve both suppleness and aromatic intensity.'
    },
    {
        question: 'How can I use vanilla for baking or homemade extract?',
        answer: 'Split the pod, scrape the seeds and use both the seeds and the shell to infuse cream, milk, syrup or rum. Our formats are suitable for everyday pastry work as well as homemade extract.'
    },
    {
        question: 'What are your delivery times?',
        answer: 'Orders are usually prepared within 24 to 48 business hours. Shipping times then depend on the destination and the selected carrier.'
    },
    {
        question: 'Do you support wholesale or trade orders?',
        answer: 'Yes. We work with professionals, importers, pastry chefs, restaurants and resellers with tailored formats, volume requests and dedicated support through the trade page or WhatsApp.'
    },
    {
        question: 'Can I contact you before ordering?',
        answer: 'Yes. You can use the contact page or reach us directly on WhatsApp if you need advice about grade, length, packaging or a B2B request.'
    }
];

export default function FAQPage() {
    const { locale } = useLocale();
    const faqs = locale === 'en' ? enFaqs : frFaqs;

    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-16">
                <h1 className="text-4xl font-serif mb-4 text-center">{locale === 'en' ? 'Frequently Asked Questions' : 'Foire Aux Questions'}</h1>
                <p className="text-zinc-500 text-center mb-12 font-light">
                    {locale === 'en'
                        ? 'Answers to the most common questions about our Madagascar vanilla, delivery and trade requests.'
                        : 'Les réponses aux questions les plus fréquentes sur notre vanille de Madagascar, la livraison et les demandes professionnelles.'}
                </p>

                <div className="space-y-8">
                    {faqs.map((faq) => (
                        <div key={faq.question} className="border-b border-zinc-100 pb-8">
                            <h3 className="text-lg font-medium text-zinc-900 mb-3">{faq.question}</h3>
                            <p className="text-zinc-500 leading-relaxed font-light">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-zinc-50 rounded-lg text-center">
                    <h2 className="text-xl font-serif mb-4">{locale === 'en' ? 'Still have questions?' : 'Encore des questions ?'}</h2>
                    <p className="text-zinc-500 mb-6 font-light text-sm">
                        {locale === 'en' ? 'Our team is available by email, phone or WhatsApp.' : 'Notre équipe est disponible par email, téléphone ou WhatsApp.'}
                    </p>
                    <Link href={withLocale('/contact', locale)} className="inline-block bg-zinc-900 text-white px-8 py-3 text-sm font-medium transition-all hover:bg-zinc-800">
                        {locale === 'en' ? 'Contact us' : 'Nous contacter'}
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
