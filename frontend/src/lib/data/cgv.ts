// Conditions Générales de Vente Internationales M.S.V-Nosy Be — Version 2026.
// Source : documents officiels du client (14 août 2026). Prix de référence : 250 €/kg FOB.
// `c` : chaque entrée est un paragraphe (string) ou une liste à puces (string[]).

export type CgvArticle = { t: string; c: Array<string | string[]> };
export type CgvContent = {
    title: string;
    subtitle: string;
    intro: Array<string | string[]>;
    articles: CgvArticle[];
    signature: string[];
    footerNote: string;
};

export const CGV_FR: CgvContent = {
    title: 'Conditions Générales de Vente Internationales',
    subtitle: 'MORIDY SOANJARA VANILLE NOSY-BE (M.S.V – NOSY-BE)',
    intro: [
        'ENTRE LES SOUSSIGNÉS',
        'LE VENDEUR — MORIDY SOANJARA VANILLE NOSY-BE (M.S.V-NOSY-BE), Société à responsabilité limitée (SARL) de droit malgache.',
        [
            'Siège social : Lot n°109B 0163 à Befitina, Hell-Ville, Nosy-Be, Madagascar',
            'Tél. Madagascar : +261 32 98 595 50',
            'Tél. France : +33 6 81 82 64 78',
            'RCS Nosy-Be : 2023 B 00054',
            'N° STAT : 46101 71 2023 0 10373',
            'Représentée par son Directeur Général, Monsieur ABOU MORIDY',
        ],
        'Ci-après dénommée « M.S.V-Nosy Be », « le Vendeur » ou « la Société ».',
        'ET — Toute personne physique ou morale agissant en qualité d’importateur, distributeur, grossiste, professionnel, revendeur ou client final et souhaitant acquérir les produits commercialisés par M.S.V-Nosy Be. Ci-après dénommée « le Client » ou « l’Acheteur ».',
        'M.S.V-Nosy Be et le Client sont ci-après collectivement dénommés « les Parties ».',
    ],
    articles: [
        {
            t: 'Article 1 – Objet',
            c: [
                'Les présentes Conditions Générales de Vente Internationales ont pour objet de définir les conditions commerciales, financières, logistiques et contractuelles applicables aux ventes internationales de produits commercialisés par M.S.V-Nosy Be, notamment de vanille naturelle de Madagascar – Vanilla planifolia, produite, préparée, conditionnée et/ou commercialisée par M.S.V-Nosy Be à Nosy-Be, Madagascar.',
                'Les présentes CGV s’appliquent à toute offre, devis, commande, facture, contrat ou opération commerciale conclue entre M.S.V-Nosy Be et le Client, sauf accord écrit contraire signé par les Parties.',
                'Toute commande confirmée par le Client vaut acceptation pleine et entière des présentes CGV.',
            ],
        },
        {
            t: 'Article 2 – Produits',
            c: [
                'M.S.V-Nosy Be commercialise notamment de la vanille naturelle de Madagascar sous différentes qualités, longueurs, taux d’humidité, calibres, catégories et niveaux de préparation. Les caractéristiques précises du produit vendu sont celles figurant sur :',
                ['le devis ;', 'la confirmation de commande ;', 'la facture commerciale ;', 'la fiche technique ;', 'ou tout document commercial expressément accepté par les Parties.'],
                'Les photographies, échantillons et présentations commerciales sont fournis à titre indicatif, sauf stipulation contraire écrite.',
                'En raison du caractère naturel et agricole du produit, les caractéristiques de chaque lot peuvent présenter des variations raisonnables liées notamment à la récolte, à l’origine, au millésime, au calibre, à la longueur, au taux d’humidité et aux conditions de préparation et de conservation. Sauf engagement écrit contraire, ces variations naturelles ne constituent pas en elles-mêmes une non-conformité.',
            ],
        },
        {
            t: 'Article 3 – Identification du Client et du client final',
            c: [
                'Toute opération internationale est subordonnée à l’identification complète et vérifiable du Client et, lorsqu’il est différent, du client final ou importateur. Le Client devra communiquer, lorsque cela est nécessaire :',
                ['sa dénomination sociale ;', 'son adresse ;', 'son numéro d’immatriculation ;', 'son numéro fiscal ou équivalent ;', 'ses coordonnées bancaires ;', 'l’identité de son représentant légal ;', 'le pays de destination ;', 'l’identité de l’importateur final ;', 'toute information nécessaire aux formalités douanières et réglementaires.'],
                'M.S.V-Nosy Be se réserve le droit de demander tout document permettant de vérifier l’identité, l’activité et la conformité du Client. En cas d’information incomplète, inexacte ou non vérifiable, M.S.V-Nosy Be pourra suspendre ou refuser la commande.',
            ],
        },
        {
            t: 'Article 4 – Offres, devis et commandes',
            c: [
                'Les offres et devis de M.S.V-Nosy Be sont valables pendant la période indiquée sur le document commercial. À défaut de durée spécifique, le devis est valable 15 jours calendaires, sous réserve de disponibilité des produits et de l’évolution des conditions du marché.',
                'La commande devient ferme après : acceptation écrite du devis par le Client ; réception de l’acompte prévu ; validation des informations commerciales et réglementaires nécessaires à l’exportation.',
                'M.S.V-Nosy Be se réserve le droit de refuser ou de suspendre toute commande pour des raisons commerciales, réglementaires, financières, logistiques, de conformité ou de disponibilité.',
            ],
        },
        {
            t: 'Article 5 – Prix de vente',
            c: [
                'Le prix de vente applicable est celui indiqué dans le devis, l’offre commerciale ou la confirmation de commande acceptée par les Parties.',
                'Prix de référence 2026 — Prix professionnel indicatif de référence : 250 € / kg FOB, port d’embarquement convenu à Madagascar, Incoterms® 2020, sauf offre commerciale ou accord écrit différent.',
                'Ce prix constitue une base commerciale de référence et non un tarif définitivement applicable à toutes les opérations. Le prix peut varier notamment en fonction :',
                ['de la qualité de la vanille ;', 'du calibre et de la longueur des gousses ;', 'du volume commandé ;', 'de la disponibilité du produit ;', 'du conditionnement ;', 'de l’Incoterm choisi ;', 'des coûts logistiques et réglementaires ;', 'des conditions de paiement ;', 'des exigences particulières du Client ;', 'des conditions du marché.'],
                'Les frais qui ne sont pas expressément inclus dans le prix sont facturés séparément ou restent à la charge de la Partie désignée par l’Incoterm applicable.',
            ],
        },
        {
            t: 'Article 6 – Conditions commerciales et négociation',
            c: [
                'Les prix, quantités minimales de commande, conditions de paiement, modalités de livraison et autres conditions commerciales applicables sont ceux indiqués dans l’offre commerciale, le devis ou le contrat conclu entre M.S.V-Nosy Be et l’Acheteur.',
                'M.S.V-Nosy Be demeure ouverte à toute discussion commerciale avec l’Acheteur et peut, à titre exceptionnel et après examen de chaque opération, consentir des conditions tarifaires ou commerciales particulières. Ces éventuels ajustements peuvent notamment tenir compte des volumes commandés, de la récurrence des commandes, de la durée de la relation commerciale, des modalités et délais de paiement, des engagements annuels ou pluriannuels, ainsi que des conditions générales de l’opération.',
                'Toute négociation commerciale demeure facultative et relève de la libre appréciation de M.S.V-Nosy Be. Aucun prix, remise, avantage ou condition commerciale particulière ne pourra être considéré comme acquis tant qu’il n’aura pas fait l’objet d’un accord écrit et exprès entre les Parties.',
                'En conséquence, les prix et conditions mentionnés dans les présentes CGV constituent une base commerciale de référence, susceptible d’être adaptée d’un commun accord selon les caractéristiques de chaque opération. Toute condition particulière négociée et acceptée par écrit entre les Parties prévaudra, pour l’opération concernée, sur les dispositions générales des présentes CGV.',
            ],
        },
        {
            t: 'Article 7 – Conditions de paiement',
            c: [
                'Sauf accord écrit contraire :',
                ['30 % d’acompte sont exigibles à la confirmation de la commande ;', 'Le solde de 70 % est exigible après expédition de la marchandise par M.S.V-Nosy Be.'],
                'Les documents nécessaires au dédouanement et/ou à la prise en charge de la marchandise demeurent sous le contrôle de M.S.V-Nosy Be jusqu’à confirmation par sa banque de la réception effective et irrévocable du paiement du solde. Dès confirmation bancaire du règlement, les documents concernés sont transmis au Client ou à son transitaire afin de permettre le dédouanement de la marchandise.',
                'L’acompte constitue un engagement ferme du Client et permet notamment à M.S.V-Nosy Be de réserver, préparer, conditionner et organiser l’expédition de la marchandise. En cas d’annulation par le Client après confirmation de la commande, M.S.V-Nosy Be pourra retenir l’acompte et/ou les sommes correspondant aux frais, engagements et dépenses effectivement engagés, sous réserve des dispositions impératives applicables.',
                'Aucune marchandise ne sera expédiée avant réception et validation effective du paiement conformément aux conditions convenues. Les frais bancaires liés au paiement international sont à la charge du Client, sauf accord écrit contraire. Tout délai de paiement exceptionnellement accordé au Client devra être expressément prévu dans un écrit accepté par M.S.V-Nosy Be.',
            ],
        },
        {
            t: 'Article 8 – Retard ou défaut de paiement',
            c: [
                'En cas de retard ou de défaut de paiement, M.S.V-Nosy Be pourra, sans préjudice de ses autres droits :',
                ['suspendre l’exécution de la commande ;', 'suspendre les expéditions en cours ;', 'demander le paiement immédiat de toute somme due ;', 'refuser toute nouvelle commande ou livraison ;', 'annuler la commande dans les conditions applicables ;', 'réclamer les frais, coûts et préjudices directement liés au défaut de paiement, dans les limites autorisées par la législation applicable.'],
                'Tout nouveau délai de paiement accordé au Client devra faire l’objet d’un accord écrit.',
            ],
        },
        {
            t: 'Article 9 – Incoterms®',
            c: [
                'Sauf stipulation contraire figurant sur la facture ou le contrat, les opérations internationales peuvent être réalisées selon les Incoterms® 2020 de la Chambre de Commerce Internationale (ICC). L’Incoterm applicable sera expressément indiqué sur le devis, la facture ou le contrat commercial.',
                'Lorsque l’Incoterm FOB est convenu, celui-ci s’entend au sens des Incoterms® 2020, au port d’embarquement convenu à Madagascar. L’Incoterm définit notamment la répartition des coûts, obligations et risques entre le Vendeur et l’Acheteur. Le transfert des risques intervient conformément à l’Incoterm expressément convenu entre les Parties.',
            ],
        },
        {
            t: 'Article 10 – Exportation et documents',
            c: [
                'M.S.V-Nosy Be assure, dans le cadre de ses obligations de Vendeur et d’exportateur agréé, les démarches et documents relevant de son intervention. Selon la nature de l’opération, les documents peuvent notamment comprendre :',
                ['facture commerciale ;', 'packing list ;', 'documents de transport ;', 'documents douaniers ;', 'certificat d’origine, lorsque requis ;', 'certificat phytosanitaire ou autre certificat requis ;', 'documents relatifs à la traçabilité ;', 'tout autre document légalement exigé.'],
                'Les documents spécifiques exigés par le pays d’importation doivent être communiqués suffisamment à l’avance par le Client. M.S.V-Nosy Be ne pourra être tenue responsable d’une impossibilité ou d’un retard résultant d’une exigence d’importation qui n’aurait pas été communiquée en temps utile par le Client. Les documents ou certifications supplémentaires non compris dans l’offre initiale peuvent faire l’objet d’une facturation complémentaire.',
            ],
        },
        {
            t: 'Article 11 – Obligations du Client importateur',
            c: [
                'Le Client est responsable des obligations qui lui incombent dans son pays de destination, notamment :',
                ['formalités d’importation ;', 'licences et autorisations d’importation ;', 'droits et taxes ;', 'TVA ou taxes équivalentes ;', 'dédouanement à destination ;', 'conformité aux exigences locales ;', 'étiquetage spécifique ;', 'enregistrement sanitaire ou alimentaire lorsque nécessaire ;', 'respect de la réglementation applicable à la commercialisation du produit.'],
                'Le Client doit informer M.S.V-Nosy Be, avant la commande, de toute exigence particulière applicable dans son pays. Le Client demeure responsable de l’utilisation, de la revente et de la commercialisation des produits après leur transfert conformément à l’Incoterm convenu.',
            ],
        },
        {
            t: 'Article 12 – Conformité réglementaire',
            c: [
                'Les Parties s’engagent à respecter les lois et règlements applicables à leurs obligations respectives. Cela comprend notamment :',
                ['la réglementation douanière ;', 'les règles sanitaires et phytosanitaires ;', 'la réglementation alimentaire applicable ;', 'les règles de traçabilité ;', 'les obligations fiscales ;', 'les réglementations relatives aux changes et aux paiements internationaux ;', 'les règles de lutte contre la fraude, la corruption et le blanchiment de capitaux ;', 'les sanctions et restrictions commerciales applicables.'],
                'Chaque Partie est responsable de ses propres obligations réglementaires.',
            ],
        },
        {
            t: 'Article 13 – Rapatriement des recettes d’exportation',
            c: [
                'Les recettes provenant des exportations réalisées par M.S.V-Nosy Be sont soumises aux règles malgaches applicables en matière de domiciliation bancaire, de rapatriement des devises et, le cas échéant, de cession des recettes d’exportation.',
                'M.S.V-Nosy Be s’engage à respecter les obligations qui lui sont applicables conformément à la réglementation malgache en vigueur. Le Client s’engage à fournir les informations et documents nécessaires au traitement bancaire et réglementaire de l’opération.',
                'Tout retard ou difficulté résultant d’une obligation bancaire, réglementaire ou de change applicable à l’opération pourra entraîner un report du calendrier d’exécution, sans engager la responsabilité de M.S.V lorsque cette difficulté échappe raisonnablement à son contrôle.',
            ],
        },
        {
            t: 'Article 14 – Qualité, contrôle et réclamations',
            c: [
                'M.S.V-Nosy Be s’engage à fournir des produits correspondant aux caractéristiques convenues dans le devis, la fiche technique ou la confirmation de commande. En raison du caractère naturel de la vanille, certaines variations raisonnables de couleur, d’aspect, de longueur, de calibre, de texture, d’arôme ou de taux d’humidité peuvent exister entre les lots, dans les limites des caractéristiques convenues.',
                'Lorsque le Client souhaite effectuer un contrôle ou une inspection avant expédition, celui-ci devra être demandé avant la préparation définitive de la commande. Sauf accord contraire, les éventuels frais d’inspection demandés par le Client sont à sa charge.',
                'Le Client doit vérifier la marchandise dès sa réception. Toute réclamation concernant une non-conformité apparente devra être notifiée par écrit à M.S.V-Nosy Be dans un délai maximal de 5 jours ouvrés suivant la réception de la marchandise, sauf délai différent expressément convenu par écrit. Toute non-conformité non apparente devra être signalée à M.S.V-Nosy Be dans les meilleurs délais après sa découverte.',
                'Toute réclamation devra être accompagnée de preuves suffisantes permettant à M.S.V-Nosy Be d’identifier le lot concerné et d’examiner la réclamation, notamment, lorsque nécessaire :',
                ['numéro ou référence du lot ;', 'photographies ;', 'quantité concernée ;', 'description précise de la non-conformité ;', 'documents de livraison ;', 'tout rapport d’analyse ou d’inspection disponible.'],
                'Le Client devra conserver la marchandise concernée dans des conditions appropriées et permettre à M.S.V-Nosy Be d’effectuer les vérifications nécessaires. Aucune destruction, transformation ou revente d’une marchandise faisant l’objet d’une réclamation ne devra intervenir avant que M.S.V-Nosy Be ait pu raisonnablement examiner le problème, sauf nécessité légale ou sanitaire. Une réclamation ne suspend pas automatiquement l’obligation de paiement des sommes non contestées.',
            ],
        },
        {
            t: 'Article 15 – Traçabilité',
            c: [
                'M.S.V met en œuvre une politique de traçabilité permettant, selon les produits et les documents disponibles, d’identifier notamment :',
                ['l’origine du produit ;', 'le lot ;', 'la période de récolte ;', 'les opérations de préparation ;', 'les conditions de stockage ;', 'le conditionnement ;', 'les documents d’exportation.'],
                'Les informations de traçabilité communiquées au Client sont destinées à l’usage commercial et réglementaire prévu et ne peuvent être reproduites, publiées ou exploitées à d’autres fins sans accord écrit de M.S.V-Nosy Be, sauf obligation légale.',
            ],
        },
        {
            t: 'Article 16 – Emballage et conditionnement',
            c: [
                'Les produits sont conditionnés selon les exigences convenues entre les Parties et adaptées à la nature du produit et au mode de transport. Tout emballage, étiquetage ou conditionnement spécial demandé par le Client doit être communiqué avant confirmation de la commande.',
                'Les coûts supplémentaires résultant d’exigences particulières du Client peuvent être facturés séparément. Le Client est responsable de toute exigence particulière d’étiquetage ou de conditionnement propre au pays de destination qui n’aurait pas été communiquée à M.S.V avant la confirmation de la commande.',
            ],
        },
        {
            t: 'Article 17 – Délais de préparation et d’expédition',
            c: [
                'Les délais communiqués par M.S.V-Nosy Be sont donnés à titre indicatif, sauf engagement écrit spécifique. Ils peuvent être affectés notamment par :',
                ['les formalités administratives ;', 'les contrôles douaniers ;', 'les contrôles phytosanitaires ;', 'les procédures bancaires ;', 'les conditions météorologiques ;', 'les disponibilités de transport ;', 'les décisions ou restrictions gouvernementales ;', 'les événements de force majeure ;', 'les contraintes liées aux opérations d’exportation.'],
                'Un retard ne pourra donner lieu à une pénalité, indemnité ou annulation automatique que si celle-ci a été expressément prévue par écrit dans le contrat concerné.',
            ],
        },
        {
            t: 'Article 18 – Transfert de propriété et des risques',
            c: [
                'Sauf disposition impérative contraire, la propriété de la marchandise est transférée au Client après paiement intégral du prix dû à M.S.V-Nosy Be. Le transfert des risques est, quant à lui, déterminé exclusivement par l’Incoterm convenu entre les Parties.',
                'Le transfert des risques ne vaut pas transfert de propriété lorsque le prix n’a pas été intégralement payé.',
            ],
        },
        {
            t: 'Article 19 – Force majeure',
            c: [
                'Aucune Partie ne pourra être tenue responsable d’un retard ou d’une inexécution résultant d’un événement échappant raisonnablement à son contrôle et empêchant ou retardant l’exécution de ses obligations. Sont notamment susceptibles de constituer des cas de force majeure, dans la mesure où ils répondent aux conditions applicables :',
                ['catastrophes naturelles ;', 'cyclones ;', 'inondations ;', 'incendies ;', 'épidémies ou pandémies ;', 'guerres ;', 'troubles civils ;', 'grèves générales ;', 'décisions gouvernementales ;', 'restrictions d’exportation ou d’importation ;', 'fermeture des frontières ;', 'blocage des ports ou transports ;', 'défaillance exceptionnelle des infrastructures ;', 'restrictions bancaires ou internationales ;', 'événements affectant gravement les récoltes ou l’approvisionnement.'],
                'La Partie concernée devra informer l’autre Partie dans les meilleurs délais et prendre, dans la mesure du raisonnable, les mesures nécessaires pour limiter les conséquences de l’événement.',
            ],
        },
        {
            t: 'Article 20 – Responsabilité',
            c: [
                'M.S.V-Nosy Be s’engage à exécuter ses obligations avec diligence et conformément aux documents contractuels acceptés.',
                'Sauf disposition légale impérative contraire, M.S.V-Nosy Be ne pourra être tenue responsable des dommages indirects, pertes commerciales, pertes de chiffre d’affaires, pertes de clientèle ou pertes de bénéfices résultant d’un événement indépendant de sa volonté. La responsabilité éventuelle de M.S.V-Nosy Be est limitée aux dommages directs, prouvés et imputables à un manquement de M.S.V-Nosy Be, dans les limites autorisées par la législation applicable.',
                'Sauf disposition impérative contraire, M.S.V-Nosy Be ne pourra être tenue responsable des conséquences résultant d’une mauvaise conservation, d’une mauvaise manipulation, d’une transformation, d’un stockage inadapté ou d’une utilisation non conforme du produit après transfert des risques.',
            ],
        },
        {
            t: 'Article 21 – Confidentialité',
            c: [
                'Les informations commerciales, techniques, financières, tarifaires, contractuelles et relatives aux fournisseurs, producteurs, partenaires ou clients communiquées dans le cadre de la relation commerciale sont confidentielles.',
                'Le Client s’engage à ne pas communiquer ces informations à des tiers sans l’accord écrit préalable de M.S.V-Nosy Be, sauf obligation légale ou nécessité liée à l’exécution de l’opération commerciale. Cette obligation de confidentialité demeure applicable après la fin de la relation commerciale, dans la mesure permise par la législation applicable.',
            ],
        },
        {
            t: 'Article 22 – Non-contournement et protection de la relation commerciale',
            c: [
                'Lorsque M.S.V-Nosy Be met directement ou indirectement en relation le Client avec un producteur, fournisseur, partenaire, transporteur, intermédiaire ou autre opérateur de sa chaîne commerciale, le Client s’engage à ne pas utiliser cette mise en relation dans le but de contourner M.S.V-Nosy Be ou de réaliser directement une opération ayant pour objet ou pour effet de priver M.S.V-Nosy Be de la relation commerciale ou de sa rémunération légitime.',
                'Toute relation commerciale directe résultant d’une mise en relation effectuée par M.S.V-Nosy Be devra être préalablement portée à la connaissance de M.S.V-Nosy Be. Le Client s’engage notamment à ne pas utiliser les coordonnées, informations commerciales ou informations de contact communiquées par M.S.V-Nosy Be dans le but d’éviter son intervention dans une opération commerciale issue de cette mise en relation.',
                'Cette clause s’applique pendant la durée de la relation commerciale et pendant une période raisonnable suivant sa cessation, sous réserve des dispositions impératives applicables.',
            ],
        },
        {
            t: 'Article 23 – Évolution des prix',
            c: [
                'Les prix peuvent évoluer en fonction de facteurs économiques et commerciaux tels que : coût de production ; disponibilité de la vanille ; récolte ; qualité et calibre ; coût du conditionnement ; transport ; assurance ; formalités d’exportation ; réglementation ; taux de change ; évolution générale du marché.',
                'Toute commande déjà confirmée reste soumise au prix expressément accepté par les Parties, sauf accord écrit contraire.',
            ],
        },
        {
            t: 'Article 24 – Gestes commerciaux et fidélisation',
            c: [
                'M.S.V-Nosy Be souhaite privilégier des relations commerciales durables et équilibrées. À ce titre, la Société peut proposer à ses partenaires réguliers des conditions commerciales préférentielles tenant compte notamment :',
                ['du volume annuel ;', 'de la fréquence des commandes ;', 'de la régularité des paiements ;', 'de la durée du partenariat ;', 'des engagements de coopération ;', 'de la prévisibilité des achats ;', 'des engagements annuels ou pluriannuels.'],
                'Ces avantages sont accordés au cas par cas et ne constituent pas un droit automatique. Toute remise ou condition préférentielle doit être expressément acceptée par écrit.',
            ],
        },
        {
            t: 'Article 25 – Résiliation',
            c: [
                'En cas de manquement grave d’une Partie à ses obligations contractuelles, l’autre Partie pourra demander la régularisation du manquement dans un délai raisonnable. À défaut de régularisation, la relation contractuelle pourra être résiliée conformément aux dispositions légales applicables et aux stipulations particulières du contrat concerné.',
                'En cas de fraude, fausse déclaration, défaut de paiement important, utilisation illicite des documents, violation grave des obligations réglementaires ou comportement susceptible de porter gravement atteinte aux intérêts de M.S.V-Nosy Be, cette dernière pourra suspendre immédiatement l’exécution de la commande, sous réserve des droits légalement applicables.',
                'La résiliation ne prive pas les Parties des droits et obligations nés antérieurement à sa date d’effet.',
            ],
        },
        {
            t: 'Article 26 – Droit applicable et règlement des litiges',
            c: [
                'Les présentes Conditions Générales de Vente sont régies par le droit de la République de Madagascar, sous réserve des règles impératives éventuellement applicables au contrat international concerné.',
                'Les Parties s’engagent à rechercher en premier lieu une solution amiable à tout différend relatif à l’interprétation, l’exécution ou la cessation de leur relation commerciale. À défaut d’accord amiable dans un délai raisonnable, le différend pourra être soumis aux juridictions compétentes de Madagascar, sous réserve des règles de compétence internationale impératives éventuellement applicables.',
                'Les dispositions particulières d’un contrat ou d’une convention internationale expressément acceptées par les Parties pourront prévoir un mécanisme différent de règlement des différends.',
            ],
        },
        {
            t: 'Article 27 – Langue',
            c: [
                'Les présentes CGV sont rédigées en français. En cas de traduction en anglais ou dans toute autre langue, la version française fera foi, sauf stipulation écrite contraire expressément acceptée par les Parties.',
            ],
        },
        {
            t: 'Article 28 – Modification des CGV',
            c: [
                'M.S.V-Nosy Be se réserve le droit de modifier ses Conditions Générales de Vente afin de tenir compte des évolutions législatives, réglementaires, commerciales ou opérationnelles.',
                'La version applicable à une commande est celle acceptée au moment de la confirmation de cette commande, sauf disposition légale contraire. Les modifications postérieures ne s’appliquent pas aux commandes déjà confirmées, sauf accord écrit des Parties ou obligation légale contraire.',
            ],
        },
        {
            t: 'Article 29 – Nullité partielle',
            c: [
                'Si une disposition des présentes CGV est déclarée nulle, illégale ou inapplicable, les autres dispositions demeureront pleinement applicables. Les Parties s’efforceront de remplacer la disposition concernée par une disposition juridiquement valable ayant un effet économique aussi proche que possible de l’intention initiale.',
            ],
        },
        {
            t: 'Article 30 – Dispositions finales',
            c: [
                'Les présentes CGV constituent le cadre général de la relation commerciale entre M.S.V-Nosy Be et ses Clients. Les conditions particulières figurant sur un devis, une facture, une confirmation de commande ou un contrat spécifique prévalent sur les présentes CGV lorsqu’elles sont expressément acceptées par les Parties.',
                'En cas de contradiction entre plusieurs documents contractuels, les conditions particulières expressément négociées et acceptées pour l’opération concernée prévaudront sur les présentes CGV. M.S.V-Nosy Be demeure disposée à fournir aux autorités compétentes et aux partenaires commerciaux habilités les documents justificatifs nécessaires à la vérification de ses opérations, dans le respect de la confidentialité et de la réglementation applicable.',
            ],
        },
        {
            t: 'Article 31 – Engagement de M.S.V-Nosy Be',
            c: [
                'M.S.V-Nosy Be s’engage à développer une politique commerciale fondée sur :',
                ['la qualité des produits ;', 'la traçabilité ;', 'la transparence commerciale ;', 'le respect des producteurs et des travailleurs ;', 'le respect des obligations fiscales, sociales et douanières ;', 'la conformité réglementaire ;', 'la responsabilité environnementale et sociale ;', 'la construction de relations commerciales durables.'],
                'M.S.V-Nosy Be souhaite établir avec ses partenaires une relation fondée sur la confiance, la régularité, le respect mutuel et la recherche d’un équilibre économique durable. Le prix commercial est ainsi déterminé en tenant compte de l’ensemble des coûts directs et indirects nécessaires à la production, la préparation, la conservation, la traçabilité, la conformité, la gestion et l’exportation de la vanille.',
            ],
        },
        {
            t: 'Article 32 – Acceptation',
            c: [
                'La passation d’une commande, la signature d’un devis, la confirmation écrite d’une offre ou le paiement de l’acompte vaut acceptation des présentes Conditions Générales de Vente, sauf conditions particulières expressément convenues par écrit.',
                'Le Client reconnaît avoir pris connaissance des présentes CGV et les accepter sans réserve, sous réserve des conditions particulières expressément convenues par écrit entre les Parties.',
            ],
        },
    ],
    signature: [
        'Fait à Nosy-Be, Madagascar, le 14 août 2026',
        'Pour M.S.V – Nosy-Be Madagascar',
        'ABOU MORIDY — Directeur Général, MORIDY SOANJARA VANILLE NOSY-BE',
    ],
    footerNote: 'Document commercial – Conditions Générales de Vente Internationales – Version 2026',
};

export const CGV_EN: CgvContent = {
    title: 'International General Terms and Conditions of Sale',
    subtitle: 'MORIDY SOANJARA VANILLE NOSY-BE (M.S.V – NOSY-BE)',
    intro: [
        'BETWEEN THE UNDERSIGNED',
        'THE SELLER — MORIDY SOANJARA VANILLE NOSY-BE (M.S.V-NOSY-BE), a limited liability company (SARL) incorporated under the laws of Madagascar.',
        [
            'Registered office: Lot No. 109B 0163, Befitina, Hell-Ville, Nosy-Be, Madagascar',
            'Tel. Madagascar: +261 32 98 595 50',
            'Tel. France: +33 6 81 82 64 78',
            'RCS Nosy-Be: 2023 B 00054',
            'STAT No.: 46101 71 2023 0 10373',
            'Represented by its Managing Director, Mr. ABOU MORIDY',
        ],
        'Hereinafter referred to as “M.S.V-Nosy Be,” “the Seller” or “the Company.”',
        'AND — Any individual or legal entity acting as an importer, distributor, wholesaler, professional buyer, reseller or end customer wishing to purchase products marketed by M.S.V-Nosy Be. Hereinafter referred to as “the Customer” or “the Buyer.”',
        'M.S.V-Nosy Be and the Customer are hereinafter collectively referred to as “the Parties.”',
    ],
    articles: [
        {
            t: 'Article 1 – Purpose',
            c: [
                'These International General Terms and Conditions of Sale are intended to define the commercial, financial, logistical and contractual conditions applicable to international sales of products marketed by M.S.V-Nosy Be, including natural Madagascar vanilla – Vanilla planifolia – produced, prepared, packaged and/or marketed by M.S.V-Nosy Be in Nosy-Be, Madagascar.',
                'These General Terms and Conditions of Sale shall apply to any quotation, offer, order, invoice, contract or commercial transaction concluded between M.S.V-Nosy Be and the Customer, unless otherwise agreed in writing and signed by the Parties.',
                'Any order confirmed by the Customer shall constitute full and unconditional acceptance of these General Terms and Conditions of Sale.',
            ],
        },
        {
            t: 'Article 2 – Products',
            c: [
                'M.S.V-Nosy Be markets, in particular, natural Madagascar vanilla in different qualities, lengths, moisture levels, sizes, categories and levels of preparation. The precise characteristics of the product sold shall be those specified in:',
                ['the quotation;', 'the order confirmation;', 'the commercial invoice;', 'the technical specification sheet;', 'or any other commercial document expressly accepted by the Parties.'],
                'Photographs, samples and commercial presentations are provided for information purposes only, unless otherwise expressly agreed in writing.',
                'Due to the natural and agricultural nature of the product, the characteristics of each lot may reasonably vary, particularly as a result of the harvest, origin, crop year, size, length, moisture content, preparation and storage conditions. Unless otherwise expressly agreed in writing, such natural variations shall not, in themselves, constitute non-conformity.',
            ],
        },
        {
            t: 'Article 3 – Identification of the Customer and end customer',
            c: [
                'Any international transaction shall be subject to the complete and verifiable identification of the Customer and, where different, the end customer or final importer. The Customer shall provide, where necessary:',
                ['its legal name;', 'its address;', 'its registration number;', 'its tax identification number or equivalent;', 'its banking details;', 'the identity of its legal representative;', 'the destination country;', 'the identity of the final importer;', 'any information required for customs and regulatory formalities.'],
                'M.S.V-Nosy Be reserves the right to request any document necessary to verify the identity, business activity and compliance status of the Customer. In the event of incomplete, inaccurate or unverifiable information, M.S.V-Nosy Be may suspend or refuse the order.',
            ],
        },
        {
            t: 'Article 4 – Offers, quotations and orders',
            c: [
                'Offers and quotations issued by M.S.V-Nosy Be shall remain valid for the period stated in the relevant commercial document. In the absence of a specific validity period, the quotation shall remain valid for 15 calendar days, subject to product availability and market conditions.',
                'The order shall become binding upon: the Customer’s written acceptance of the quotation; receipt of the required deposit; validation of the commercial and regulatory information necessary for export.',
                'M.S.V-Nosy Be reserves the right to refuse or suspend any order for commercial, regulatory, financial, logistical, compliance or availability reasons.',
            ],
        },
        {
            t: 'Article 5 – Sales price',
            c: [
                'The applicable sales price shall be the price stated in the quotation, commercial offer or order confirmation accepted by the Parties.',
                '2026 Reference Price — Indicative professional reference price: EUR 250 per kg FOB, agreed port of loading in Madagascar, Incoterms® 2020, unless otherwise stated in a commercial offer or agreed in writing.',
                'This price constitutes a commercial reference basis and not a definitive price applicable to all transactions. The price may vary depending in particular on:',
                ['the quality of the vanilla;', 'the size and length of the beans;', 'the quantity ordered;', 'product availability;', 'packaging;', 'the selected Incoterm;', 'logistical and regulatory costs;', 'payment terms;', 'specific Customer requirements;', 'market conditions.'],
                'Any costs not expressly included in the price shall be invoiced separately or shall remain payable by the Party designated under the applicable Incoterm.',
            ],
        },
        {
            t: 'Article 6 – Commercial terms and negotiation',
            c: [
                'The prices, minimum order quantities, payment terms, delivery terms and other applicable commercial conditions shall be those stated in the commercial offer, quotation or contract concluded between M.S.V-Nosy Be and the Buyer.',
                'M.S.V-Nosy Be remains open to commercial discussions with the Buyer and may, on an exceptional basis and following an assessment of each transaction, grant specific pricing or commercial conditions. Such adjustments may take into account, in particular, the quantities ordered, recurring orders, the duration of the commercial relationship, payment terms and deadlines, annual or multi-year commitments, as well as the overall conditions of the transaction.',
                'Any commercial negotiation shall remain optional and shall be at the sole discretion of M.S.V-Nosy Be. No price, discount, benefit or specific commercial condition shall be considered acquired until it has been expressly agreed in writing between the Parties.',
                'Accordingly, the prices and conditions stated in these General Terms and Conditions of Sale constitute a commercial reference basis which may be adapted by mutual agreement according to the characteristics of each transaction. Any specific condition negotiated and accepted in writing between the Parties shall prevail, for the relevant transaction, over the general provisions of these General Terms and Conditions of Sale.',
            ],
        },
        {
            t: 'Article 7 – Payment terms',
            c: [
                'Unless otherwise agreed in writing:',
                ['30% deposit shall be payable upon confirmation of the order;', 'The remaining 70% balance shall become payable after the goods have been shipped by M.S.V-Nosy Be.'],
                'The documents required for customs clearance and/or taking possession of the goods shall remain under the control of M.S.V-Nosy Be until its bank has confirmed the actual and irrevocable receipt of the balance payment. Upon bank confirmation of payment, the relevant documents shall be released and transmitted to the Customer or its freight forwarder/customs agent in order to enable customs clearance of the goods.',
                'The deposit constitutes a firm commitment by the Customer and enables M.S.V-Nosy Be, in particular, to reserve, prepare, package and arrange shipment of the goods. In the event of cancellation by the Customer after confirmation of the order, M.S.V-Nosy Be may retain the deposit and/or amounts corresponding to costs, commitments and expenses actually incurred, subject to any mandatory applicable legal provisions.',
                'No goods shall be released for shipment before receipt and effective validation of payment in accordance with the agreed terms. Bank charges related to international payments shall be borne by the Customer, unless otherwise agreed in writing. Any exceptional payment period granted to the Customer must be expressly provided for in a written agreement accepted by M.S.V-Nosy Be.',
            ],
        },
        {
            t: 'Article 8 – Late or non-payment',
            c: [
                'In the event of late payment or non-payment, M.S.V-Nosy Be may, without prejudice to its other rights:',
                ['suspend performance of the order;', 'suspend ongoing shipments;', 'demand immediate payment of any outstanding amounts;', 'refuse any new order or delivery;', 'cancel the order under the applicable conditions;', 'claim costs, expenses and losses directly resulting from the payment default, within the limits permitted by applicable law.'],
                'Any new payment period granted to the Customer must be subject to a written agreement.',
            ],
        },
        {
            t: 'Article 9 – Incoterms®',
            c: [
                'Unless otherwise stated on the invoice or in the contract, international transactions may be carried out in accordance with the Incoterms® 2020 rules of the International Chamber of Commerce (ICC). The applicable Incoterm shall be expressly stated in the quotation, invoice or commercial contract.',
                'Where FOB is agreed, it shall be understood in accordance with Incoterms® 2020, at the agreed port of loading in Madagascar. The Incoterm shall determine, in particular, the allocation of costs, obligations and risks between the Seller and the Buyer. Transfer of risk shall take place in accordance with the Incoterm expressly agreed between the Parties.',
            ],
        },
        {
            t: 'Article 10 – Export and documentation',
            c: [
                'M.S.V-Nosy Be shall, within the scope of its obligations as Seller and authorized exporter, handle the procedures and documents falling within its responsibility. Depending on the nature of the transaction, the documents may include, in particular:',
                ['commercial invoice;', 'packing list;', 'transport documents;', 'customs documents;', 'certificate of origin, where required;', 'phytosanitary certificate or other required certificate;', 'traceability documentation;', 'any other legally required document.'],
                'Specific documents required by the importing country must be communicated by the Customer sufficiently in advance. M.S.V-Nosy Be shall not be held liable for any inability or delay resulting from an import requirement that was not communicated by the Customer in a timely manner. Additional documents or certifications not included in the initial offer may be subject to additional charges.',
            ],
        },
        {
            t: 'Article 11 – Obligations of the importing Customer',
            c: [
                'The Customer shall be responsible for all obligations applicable to it in the destination country, including:',
                ['import formalities;', 'import licenses and permits;', 'duties and taxes;', 'VAT or equivalent taxes;', 'customs clearance at destination;', 'compliance with local requirements;', 'specific labeling requirements;', 'sanitary or food registration where required;', 'compliance with regulations applicable to the marketing of the product.'],
                'The Customer shall inform M.S.V-Nosy Be, before placing the order, of any specific requirement applicable in its country. The Customer shall remain responsible for the use, resale and marketing of the products after transfer in accordance with the agreed Incoterm.',
            ],
        },
        {
            t: 'Article 12 – Regulatory compliance',
            c: [
                'The Parties undertake to comply with the laws and regulations applicable to their respective obligations. This includes, in particular:',
                ['customs regulations;', 'sanitary and phytosanitary requirements;', 'applicable food regulations;', 'traceability requirements;', 'tax obligations;', 'regulations relating to foreign exchange and international payments;', 'rules relating to fraud, corruption and money laundering prevention;', 'applicable sanctions and trade restrictions.'],
                'Each Party shall be responsible for its own regulatory obligations.',
            ],
        },
        {
            t: 'Article 13 – Repatriation of export proceeds',
            c: [
                'Proceeds arising from exports carried out by M.S.V-Nosy Be shall be subject to the applicable Malagasy rules relating to bank domiciliation, repatriation of foreign currency and, where applicable, surrender or conversion of export proceeds.',
                'M.S.V-Nosy Be undertakes to comply with its applicable obligations in accordance with the Malagasy regulations in force. The Customer undertakes to provide the information and documents required for the banking and regulatory processing of the transaction.',
                'Any delay or difficulty resulting from a banking, regulatory or foreign-exchange obligation applicable to the transaction may result in a postponement of the performance schedule, without M.S.V-Nosy Be being held liable where such difficulty is reasonably beyond its control.',
            ],
        },
        {
            t: 'Article 14 – Quality, inspection and claims',
            c: [
                'M.S.V-Nosy Be undertakes to supply products corresponding to the characteristics agreed in the quotation, technical specification sheet or order confirmation. Due to the natural nature of vanilla, reasonable variations in color, appearance, length, size, texture, aroma or moisture content may occur between lots, within the limits of the agreed specifications.',
                'Where the Customer wishes to conduct an inspection or quality control prior to shipment, such inspection must be requested before the final preparation of the order. Unless otherwise agreed, any inspection costs requested by the Customer shall be borne by the Customer.',
                'The Customer shall inspect the goods immediately upon receipt. Any claim concerning an apparent non-conformity must be notified in writing to M.S.V-Nosy Be within a maximum period of 5 business days following receipt of the goods, unless a different period has been expressly agreed in writing. Any non-apparent non-conformity must be reported to M.S.V-Nosy Be as soon as reasonably possible after its discovery.',
                'Any claim must be supported by sufficient evidence enabling M.S.V-Nosy Be to identify the relevant lot and investigate the claim, including, where necessary:',
                ['lot number or reference;', 'photographs;', 'quantity concerned;', 'precise description of the non-conformity;', 'delivery documents;', 'any available analysis or inspection report.'],
                'The Customer shall retain the affected goods under appropriate conditions and shall allow M.S.V-Nosy Be to carry out the necessary inspections. No destruction, processing or resale of goods subject to a claim shall take place before M.S.V-Nosy Be has had a reasonable opportunity to examine the issue, except where required by law or for sanitary reasons. A claim shall not automatically suspend the Customer’s obligation to pay any undisputed amounts.',
            ],
        },
        {
            t: 'Article 15 – Traceability',
            c: [
                'M.S.V-Nosy Be implements a traceability policy enabling, depending on the products and available documentation, the identification of, in particular:',
                ['product origin;', 'lot;', 'harvest period;', 'preparation operations;', 'storage conditions;', 'packaging;', 'export documentation.'],
                'Traceability information provided to the Customer is intended for the specified commercial and regulatory purposes and may not be reproduced, published or used for other purposes without the prior written consent of M.S.V-Nosy Be, except where required by law.',
            ],
        },
        {
            t: 'Article 16 – Packaging and conditioning',
            c: [
                'Products shall be packaged in accordance with the requirements agreed between the Parties and adapted to the nature of the product and the method of transportation. Any special packaging, labeling or conditioning requested by the Customer must be communicated before confirmation of the order.',
                'Additional costs resulting from specific Customer requirements may be invoiced separately. The Customer shall be responsible for any specific labeling or packaging requirements applicable in the destination country that were not communicated to M.S.V-Nosy Be before confirmation of the order.',
            ],
        },
        {
            t: 'Article 17 – Preparation and shipping times',
            c: [
                'Delivery and preparation times communicated by M.S.V-Nosy Be are indicative unless a specific written commitment has been made. They may be affected, in particular, by:',
                ['administrative formalities;', 'customs controls;', 'phytosanitary inspections;', 'banking procedures;', 'weather conditions;', 'transport availability;', 'governmental decisions or restrictions;', 'force majeure events;', 'constraints related to export operations.'],
                'A delay shall not give rise to any penalty, compensation or automatic cancellation unless expressly provided for in writing in the relevant contract.',
            ],
        },
        {
            t: 'Article 18 – Transfer of title and risk',
            c: [
                'Unless otherwise required by mandatory law, title to the goods shall transfer to the Customer only after full payment of the amount due to M.S.V-Nosy Be. Transfer of risk shall, however, be determined exclusively by the Incoterm agreed between the Parties.',
                'Transfer of risk shall not constitute transfer of title where the purchase price has not been paid in full.',
            ],
        },
        {
            t: 'Article 19 – Force majeure',
            c: [
                'Neither Party shall be held liable for any delay or failure to perform resulting from an event reasonably beyond its control that prevents or delays the performance of its obligations. The following may, in particular, constitute force majeure events, insofar as they meet the applicable legal conditions:',
                ['natural disasters;', 'cyclones;', 'floods;', 'fires;', 'epidemics or pandemics;', 'wars;', 'civil unrest;', 'general strikes;', 'governmental decisions;', 'export or import restrictions;', 'border closures;', 'port or transport blockages;', 'exceptional infrastructure failures;', 'banking or international restrictions;', 'events seriously affecting harvests or supply.'],
                'The affected Party shall inform the other Party as soon as reasonably possible and shall take reasonable measures to limit the consequences of the event.',
            ],
        },
        {
            t: 'Article 20 – Liability',
            c: [
                'M.S.V-Nosy Be undertakes to perform its obligations diligently and in accordance with the accepted contractual documents.',
                'Unless otherwise required by mandatory law, M.S.V-Nosy Be shall not be liable for indirect damages, commercial losses, loss of turnover, loss of customers or loss of profits resulting from an event beyond its control. Any liability of M.S.V-Nosy Be shall be limited to direct and proven damages attributable to a breach by M.S.V-Nosy Be, within the limits permitted by applicable law.',
                'Unless otherwise required by mandatory law, M.S.V-Nosy Be shall not be liable for consequences resulting from improper preservation, improper handling, processing, unsuitable storage or non-compliant use of the product after transfer of risk.',
            ],
        },
        {
            t: 'Article 21 – Confidentiality',
            c: [
                'Commercial, technical, financial, pricing and contractual information, as well as information relating to suppliers, producers, partners or customers communicated in the course of the commercial relationship, shall be treated as confidential.',
                'The Customer undertakes not to disclose such information to third parties without the prior written consent of M.S.V-Nosy Be, except where required by law or necessary for the performance of the commercial transaction. This confidentiality obligation shall remain applicable after termination of the commercial relationship, to the extent permitted by applicable law.',
            ],
        },
        {
            t: 'Article 22 – Non-circumvention and protection of the commercial relationship',
            c: [
                'Where M.S.V-Nosy Be directly or indirectly introduces the Customer to a producer, supplier, partner, carrier, intermediary or other operator within its commercial supply chain, the Customer undertakes not to use such introduction for the purpose of circumventing M.S.V-Nosy Be or carrying out directly any transaction whose purpose or effect would be to deprive M.S.V-Nosy Be of the commercial relationship or its legitimate remuneration.',
                'Any direct commercial relationship resulting from an introduction made by M.S.V-Nosy Be must first be brought to the attention of M.S.V-Nosy Be. The Customer specifically undertakes not to use contact details, commercial information or contact information provided by M.S.V-Nosy Be for the purpose of avoiding its involvement in a commercial transaction resulting from such introduction.',
                'This clause shall apply during the commercial relationship and for a reasonable period following its termination, subject to any mandatory applicable provisions.',
            ],
        },
        {
            t: 'Article 23 – Price changes',
            c: [
                'Prices may change depending on economic and commercial factors such as: production costs; vanilla availability; harvest conditions; quality and size; packaging costs; transportation; insurance; export formalities; regulations; exchange rates; general market developments.',
                'Any order already confirmed shall remain subject to the price expressly accepted by the Parties, unless otherwise agreed in writing.',
            ],
        },
        {
            t: 'Article 24 – Commercial gestures and customer loyalty',
            c: [
                'M.S.V-Nosy Be seeks to promote long-term and balanced commercial relationships. Accordingly, the Company may offer its regular partners preferential commercial conditions taking into account, in particular:',
                ['annual volume;', 'order frequency;', 'payment regularity;', 'duration of the partnership;', 'cooperation commitments;', 'purchase predictability;', 'annual or multi-year commitments.'],
                'Such benefits shall be granted on a case-by-case basis and shall not constitute an automatic entitlement. Any discount or preferential condition must be expressly accepted in writing.',
            ],
        },
        {
            t: 'Article 25 – Termination',
            c: [
                'In the event of a material breach by either Party of its contractual obligations, the other Party may request that the breach be remedied within a reasonable period. If the breach is not remedied, the contractual relationship may be terminated in accordance with applicable legal provisions and the specific terms of the relevant contract.',
                'In the event of fraud, false statements, significant payment default, unlawful use of documents, serious violation of regulatory obligations or conduct likely to seriously harm the interests of M.S.V-Nosy Be, the latter may immediately suspend performance of the order, subject to legally applicable rights.',
                'Termination shall not affect the rights and obligations accrued by the Parties prior to its effective date.',
            ],
        },
        {
            t: 'Article 26 – Governing law and dispute resolution',
            c: [
                'These General Terms and Conditions of Sale shall be governed by the laws of the Republic of Madagascar, subject to any mandatory rules that may apply to the relevant international contract.',
                'The Parties undertake to first seek an amicable solution to any dispute relating to the interpretation, performance or termination of their commercial relationship. Failing an amicable settlement within a reasonable period, the dispute may be submitted to the competent courts of Madagascar, subject to any mandatory international jurisdiction rules that may apply.',
                'Specific provisions of a contract or an international agreement expressly accepted by the Parties may provide for a different dispute resolution mechanism.',
            ],
        },
        {
            t: 'Article 27 – Language',
            c: [
                'These General Terms and Conditions of Sale are drafted in French. In the event of a translation into English or any other language, the French version shall prevail, unless otherwise expressly agreed in writing by the Parties.',
            ],
        },
        {
            t: 'Article 28 – Amendments to the General Terms and Conditions of Sale',
            c: [
                'M.S.V-Nosy Be reserves the right to amend its General Terms and Conditions of Sale in order to take into account legislative, regulatory, commercial or operational developments.',
                'The version applicable to an order shall be the version accepted at the time the order is confirmed, unless otherwise required by law. Subsequent amendments shall not apply to orders already confirmed, unless agreed in writing by the Parties or required by law.',
            ],
        },
        {
            t: 'Article 29 – Severability',
            c: [
                'If any provision of these General Terms and Conditions of Sale is declared null, unlawful or unenforceable, the remaining provisions shall remain fully applicable. The Parties shall endeavor to replace the affected provision with a legally valid provision having an economic effect as close as possible to the original intention.',
            ],
        },
        {
            t: 'Article 30 – Final provisions',
            c: [
                'These General Terms and Conditions of Sale constitute the general framework governing the commercial relationship between M.S.V-Nosy Be and its Customers. Specific conditions appearing in a quotation, invoice, order confirmation or specific contract shall prevail over these General Terms and Conditions of Sale where they have been expressly accepted by the Parties.',
                'In the event of any contradiction between several contractual documents, the specific conditions expressly negotiated and accepted for the relevant transaction shall prevail over these General Terms and Conditions of Sale. M.S.V-Nosy Be remains willing to provide competent authorities and authorized commercial partners with the supporting documents necessary to verify its transactions, subject to confidentiality and applicable regulations.',
            ],
        },
        {
            t: 'Article 31 – M.S.V-Nosy Be’s commitment',
            c: [
                'M.S.V-Nosy Be undertakes to develop a commercial policy based on:',
                ['product quality;', 'traceability;', 'commercial transparency;', 'respect for producers and workers;', 'compliance with tax, social and customs obligations;', 'regulatory compliance;', 'environmental and social responsibility;', 'the development of sustainable commercial relationships.'],
                'M.S.V-Nosy Be seeks to establish with its partners a relationship based on trust, consistency, mutual respect and the pursuit of sustainable economic balance. The commercial price is therefore determined taking into account all direct and indirect costs necessary for the production, preparation, preservation, traceability, compliance, management and export of vanilla.',
            ],
        },
        {
            t: 'Article 32 – Acceptance',
            c: [
                'Placing an order, signing a quotation, providing written confirmation of an offer or paying the deposit shall constitute acceptance of these General Terms and Conditions of Sale, except for any specific terms expressly agreed in writing.',
                'The Customer acknowledges having read these General Terms and Conditions of Sale and accepts them without reservation, subject to any specific terms expressly agreed in writing between the Parties.',
            ],
        },
    ],
    signature: [
        'Executed in Nosy-Be, Madagascar, on August 14, 2026',
        'For M.S.V – Nosy-Be Madagascar',
        'ABOU MORIDY — Managing Director, MORIDY SOANJARA VANILLE NOSY-BE',
    ],
    footerNote: 'Commercial document – International General Terms and Conditions of Sale – 2026 Version',
};
