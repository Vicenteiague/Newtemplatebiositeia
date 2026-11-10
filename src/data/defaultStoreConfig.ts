export interface CategoryItem {
  id: string;
  name: string;
  img: string;
}

export interface ProductItem {
  id: number;
  name: string;
  desc: string;
  price: number | null;
  installments: number;
  category: string;
  img: string;
  featured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StoreConfig {
  storeName: string;
  slogan: string;
  logoUrl: string;
  specialties: string[];
  cityState: string;
  marqueePhrase1: string;
  marqueePhrase2: string;
  whatsappNumber: string;
  whatsappHeroText: string;
  whatsappSubtitle: string;
  catalogSubtitle: string;
  instagramHandle: string;
  instagramUrl: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: 'nopass' | 'WPA';
  offerBadge: string;
  offerStockLabel: string;
  offerTitle: string;
  offerDescription: string;
  offerPriceHighlight: string;
  offerWhatsappText: string;
  offerDurationHours: number;
  googleRating: string;
  googleReviewUrl: string;
  aboutText: string;
  serviceTags: string[];
  faqs: FaqItem[];
  address: string;
  mapsUrl: string;
  phoneDisplay: string;
  phoneTel: string;
  paymentMethods: string[];
  maxInstallments: number;
  openingHours: string;
  agencyCreditName: string;
  agencyCreditUrl: string;
  categories: CategoryItem[];
  products: ProductItem[];
}

export const DUDA_MELLO_CONFIG: StoreConfig = {
  storeName: 'Duda Mello Boutique',
  slogan: 'Moda com estilo para brilhar em qualquer dia.',
  logoUrl: '/src/assets/images/boutique_avatar_logo_1794314337709.jpg',
  specialties: ['Moda feminina', 'Moda masculina', 'Infantil', 'Calçados'],
  cityState: 'Itatinga/SP',
  marqueePhrase1: 'NOVIDADES TODA SEMANA',
  marqueePhrase2: 'ESQUENTA BLACK',
  whatsappNumber: '5514997983701',
  whatsappHeroText: 'Olá! Quero ver as peças da loja.',
  whatsappSubtitle: 'Tire dúvidas e peça sua peça',
  catalogSubtitle: 'Bolsas, roupas, calçados e perfumes',
  instagramHandle: '@Dudamelloboutique',
  instagramUrl: 'https://instagram.com/Dudamelloboutique',
  wifiSsid: 'Duda Mello Boutique',
  wifiPassword: '',
  wifiEncryption: 'nopass',
  offerBadge: 'Oferta',
  offerStockLabel: 'Estoque limitado',
  offerTitle: 'Esquenta Black',
  offerDescription: 'Calçados infantil 50% OFF',
  offerPriceHighlight: 'R$ 84,95',
  offerWhatsappText: 'Quero garantir a oferta do Esquenta Black!',
  offerDurationHours: 62,
  googleRating: '4,5',
  googleReviewUrl: 'https://g.page/r/CZ-rdazTBFg9EBM/review',
  aboutText:
    'A Duda Mello Boutique é a loja de moda de Itatinga para vestir a família toda. Temos moda feminina, masculina e infantil, looks tal pai, tal filho, bolsas Veryrio, calçados Ramarim e perfumes importados.',
  serviceTags: [
    'Moda Feminina',
    'Moda Masculina',
    'Moda Infantil',
    'Bolsas Veryrio',
    'Calçados Ramarim',
    'Perfumes Importados',
    'Looks Tal Pai Tal Filho',
  ],
  faqs: [
    {
      question: 'Posso reservar uma peça pelo WhatsApp?',
      answer:
        'Pode! Adicione os produtos na sacola aqui do site e envie no WhatsApp que conferimos o tamanho e separamos para você.',
    },
    {
      question: 'Quais são as formas de pagamento?',
      answer:
        'Aceitamos Pix, Dinheiro, Cartão de Débito e parcelamos em até 10x no Cartão de Crédito.',
    },
    {
      question: 'Vocês fazem entregas ou enviam para outras cidades?',
      answer:
        'Sim! Entregamos em Itatinga com agilidade e combinamos o envio para toda a região direto pelo nosso atendimento no WhatsApp.',
    },
    {
      question: 'Como funcionam as trocas de tamanho ou modelo?',
      answer:
        'Realizamos trocas em até 7 dias corridos com a etiqueta fixada na peça. Basta apresentar na loja ou falar com nossa equipe no WhatsApp.',
    },
  ],
  address: 'R. Padre Chirinéa, 548 - Loja 1 - Centro, Itatinga/SP',
  mapsUrl: 'https://maps.google.com/?cid=4420288341442145183',
  phoneDisplay: '(14) 99798-3701',
  phoneTel: '+5514997983701',
  paymentMethods: ['Pix', 'Crédito', 'Débito', 'Dinheiro'],
  maxInstallments: 10,
  openingHours: 'Seg a sáb: 8h às 18h · Dom: fechado',
  agencyCreditName: 'Nour BioSite Studio',
  agencyCreditUrl: '#codigo-html',
  categories: [
    {
      id: 'todos',
      name: 'Tudo',
      img: '/src/assets/images/boutique_avatar_logo_1794314337709.jpg',
    },
    {
      id: 'bolsas',
      name: 'Bolsas',
      img: '/src/assets/images/product_handbag_classic_1794314339171.jpg',
    },
    {
      id: 'feminino',
      name: 'Moda feminina',
      img: '/src/assets/images/product_denim_jacket_1794314339295.jpg',
    },
    {
      id: 'calcados',
      name: 'Calçados',
      img: '/src/assets/images/product_papete_sandal_1794314340709.jpg',
    },
  ],
  products: [
    {
      id: 1,
      name: 'Bolsa Veryrio Classic Preta',
      desc: 'Bolsa de mão estruturada, alça dupla e detalhes dourados.',
      price: null,
      installments: 10,
      category: 'bolsas',
      img: '/src/assets/images/product_handbag_classic_1794314339171.jpg',
      featured: true,
    },
    {
      id: 2,
      name: 'Jaqueta Jeans Cropped Bege',
      desc: 'Curtinha, botões dourados, combina com tudo.',
      price: null,
      installments: 10,
      category: 'feminino',
      img: '/src/assets/images/product_denim_jacket_1794314339295.jpg',
      featured: true,
    },
    {
      id: 3,
      name: 'Sandália Papete Ramarim',
      desc: 'Solado confortável, dourada ou off-white.',
      price: 89.9,
      installments: 10,
      category: 'calcados',
      img: '/src/assets/images/product_papete_sandal_1794314340709.jpg',
      featured: true,
    },
    {
      id: 4,
      name: 'Tênis Chunky SNK',
      desc: 'Plataforma confortável, várias cores.',
      price: 299.9,
      installments: 10,
      category: 'calcados',
      img: '/src/assets/images/product_chunky_sneaker_1794314340095.jpg',
      featured: true,
    },
    {
      id: 5,
      name: 'Bolsa Tiracolo Matelassê Caramelo',
      desc: 'Acabamento premium com alça transversal regulável e fecho metálico.',
      price: 189.9,
      installments: 10,
      category: 'bolsas',
      img: '/src/assets/images/product_handbag_classic_1794314339171.jpg',
    },
    {
      id: 6,
      name: 'Conjunto Alfaiataria Linho Off-White',
      desc: 'Corte impecável, tecido leve e caimento elegante para todas as ocasiões.',
      price: 249.9,
      installments: 10,
      category: 'feminino',
      img: '/src/assets/images/product_denim_jacket_1794314339295.jpg',
    },
  ],
};
