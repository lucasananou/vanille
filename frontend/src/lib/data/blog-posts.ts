export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string; // HTML content
    coverImage: string;
    category: string;
    readTime: string;
    date: string;
    author: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'art-du-sechage-vanille',
        title: "L'art du séchage : une étape cruciale pour l'arôme de la vanille",
        excerpt: "Découvrez comment le soleil de Madagascar transforme les gousses vertes en trésors de la gastronomie mondiale.",
        content: `
            <p class="lead text-lg text-zinc-600 mb-6 font-semibold">Le séchage est l'étape où la vanille développe toute sa complexité aromatique. À Nosy-Be, nous respectons un processus ancestral qui allie patience et savoir-faire.</p>
            
            <h2 class="text-2xl font-serif mt-8 mb-4">Un processus lent pour une qualité supérieure</h2>
            <p class="mb-4">Après l'échaudage et l'étuvage, les gousses de vanille sont exposées quotidiennement au soleil pendant quelques heures. Ce séchage solaire doit être parfaitement maîtrisé : trop de soleil pourrait dessécher la gousse prématurément, tandis qu'un manque de chaleur empêcherait le développement de la vanilline.</p>

            <figure class="my-8">
                <img src="/photos-produit-vanille/galerie-photos-qui-sommes-nous/sechage-au-soleil.jpg" alt="Séchage de la vanille au soleil de Madagascar" class="w-full h-auto rounded-lg shadow-sm" />
                <figcaption class="text-center text-sm text-zinc-500 mt-2">Les gousses sont méticuleusement étalées sur des draps pour capter la chaleur du matin.</figcaption>
            </figure>

            <h2 class="text-2xl font-serif mt-8 mb-4">Le repos à l'ombre : l'affinage en caisse</h2>
            <p class="mb-4">Une fois le séchage au soleil terminé, les gousses passent plusieurs mois dans des caisses en bois tapissées de papier sulfurisé. C'est durant cette période de repos à l'ombre que la vanille s'affine, un peu comme un grand vin. Les arômes se stabilisent et la texture devient souple et huileuse, caractéristique de la qualité MSV Nosy-Be.</p>
        `,
        coverImage: "/photos-produit-vanille/galerie-photos-qui-sommes-nous/sechage-au-soleil.jpg",
        category: "Savoir-faire",
        readTime: "4 min",
        date: "2024-03-01",
        author: "Abou Moridy"
    },
    {
        slug: 'choisir-gousse-vanille-gourmet',
        title: "Comment bien choisir ses gousses de vanille Gourmet ?",
        excerpt: "Aspect, souplesse, parfum... Voici les critères indispensables pour reconnaître une vanille d'exception.",
        content: `
            <p class="lead text-lg text-zinc-600 mb-6 font-semibold">Toutes les vanilles ne se valent pas. Pour vos pâtisseries les plus fines, il est essentiel de savoir distinguer une gousse de qualité professionnelle d'un produit standard.</p>
            
            <h2 class="text-2xl font-serif mt-8 mb-4">La brillance et la souplesse</h2>
            <p class="mb-4">Une gousse de qualité "Gourmet" ou "Noire" doit être souple. Vous devriez pouvoir l'enrouler autour de votre doigt sans qu'elle ne casse. Sa peau doit être légèrement huileuse et brillante, signe qu'elle regorge de grains aromatiques à l'intérieur.</p>

            <figure class="my-8">
                <img src="/photos-produit-vanille/galerie-photos-qui-sommes-nous/triage-et-calibrage.jpg" alt="Contrôle qualité de la vanille" class="w-full h-auto rounded-lg shadow-sm" />
                <figcaption class="text-center text-sm text-zinc-500 mt-2">Le triage manuel permet d'isoler les plus belles gousses pour la catégorie Gourmet.</figcaption>
            </figure>

            <h2 class="text-2xl font-serif mt-8 mb-4">La taille, un critère de prestige</h2>
            <p class="mb-4">Chez MSV Nosy-Be, nous classons nos vanilles par taille. Les gousses de 16 à 18 cm sont particulièrement recherchées par les chefs car elles offrent un rendement en graines bien supérieur aux gousses plus courtes.</p>
        `,
        coverImage: "/photos-produit-vanille/galerie-photos-qui-sommes-nous/triage-et-calibrage.jpg",
        category: "Conseils",
        readTime: "3 min",
        date: "2024-02-15",
        author: "Expert MSV"
    },
    {
        slug: 'poivre-sauvage-madagascar-tresor',
        title: "Le Poivre Sauvage de Madagascar : un trésor méconnu",
        excerpt: "Aussi appelé Voatsiperifery, ce poivre rare offre des notes boisées et florales uniques au monde.",
        content: `
            <p class="lead text-lg text-zinc-600 mb-6 font-semibold">S'il y a une épice qui rivalise avec la vanille en termes de prestige à Madagascar, c'est bien le poivre sauvage, le Voatsiperifery.</p>
            
            <h2 class="text-2xl font-serif mt-8 mb-4">Une récolte périlleuse</h2>
            <p class="mb-4">Contrairement au poivre noir classique, le Voatsiperifery pousse à l'état sauvage sur des lianes pouvant atteindre 20 mètres de haut. La récolte se fait manuellement dans les forêts malgaches, ce qui en fait un produit rare et précieux.</p>

            <figure class="my-8">
                <img src="/photos-produit-vanille/poivre-sauvage-madagascar.jpg" alt="Grains de poivre sauvage de Madagascar" class="w-full h-auto rounded-lg shadow-sm" />
                <figcaption class="text-center text-sm text-zinc-500 mt-2">Le poivre sauvage se reconnaît à sa petite queue caractéristique fixée à la graine.</figcaption>
            </figure>

            <h2 class="text-2xl font-serif mt-8 mb-4">En cuisine : subtilité et puissance</h2>
            <p class="mb-4">Moins piquant que le poivre noir, il développe des notes d'agrumes, de bois et de terre. Il est le compagnon idéal des viandes blanches, mais aussi, plus surprenant, des desserts au chocolat ou aux fruits rouges où il magnifie le sucre sans le masquer.</p>
        `,
        coverImage: "/photos-produit-vanille/poivre-sauvage-madagascar.jpg",
        category: "Découverte",
        readTime: "5 min",
        date: "2024-01-20",
        author: "Abou Moridy"
    }
];
