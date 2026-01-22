'use client';

export default function TestimonialsSection() {
    const testimonials = [
        {
            author: "Sarah B.",
            rating: 5,
            date: "Il y a 2 semaines",
            title: "La perfection !",
            content: "Enfin une marque qui allie style et pudeur sans compromis. La qualité de la robe est incroyable, le tissu retombe parfaitement. Je me sens belle et à l'aise."
        },
        {
            author: "Léa C.",
            rating: 5,
            date: "Il y a 1 mois",
            title: "Service client au top",
            content: "J'avais un doute sur la taille et j'ai été très bien conseillée. L'envoi a été très rapide et le packaging est soigné. Une belle expérience client."
        },
        {
            author: "Rebecca M.",
            rating: 5,
            date: "Il y a 3 semaines",
            title: "Coup de cœur",
            content: "Je cherchais une tenue pour un mariage et j'ai trouvé mon bonheur. Les finitions sont dignes des grandes marques. Je recommanderai c'est sûr !"
        }
    ];

    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-[#a1b8ff]">
                        Avis Clients
                    </span>
                    <h2 className="text-4xl font-serif text-zinc-900">
                        Elles nous font <span className="italic text-[#a1b8ff]">confiance</span>
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-8 bg-zinc-50 rounded-sm">
                            <div className="flex gap-1 mb-4 text-[#a1b8ff]">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <h3 className="text-lg font-medium text-zinc-900 mb-2">{testimonial.title}</h3>
                            <p className="text-zinc-600 font-light italic mb-6">"{testimonial.content}"</p>
                            <div className="mt-auto">
                                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-900">{testimonial.author}</p>
                                <p className="text-xs text-zinc-400 mt-1">{testimonial.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
