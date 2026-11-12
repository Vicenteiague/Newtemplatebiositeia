import boutiqueAvatarLogo from '../assets/images/boutique_avatar_logo_1794314337709.jpg';
import productHandbagClassic from '../assets/images/product_handbag_classic_1794314339171.jpg';
import productDenimJacket from '../assets/images/product_denim_jacket_1794314339295.jpg';
import productPapeteSandal from '../assets/images/product_papete_sandal_1794314340709.jpg';
import productChunkySneaker from '../assets/images/product_chunky_sneaker_1794314340095.jpg';
import energyStoreLogo from '../assets/images/energy_store_logo_1794316756322.jpg';
import energySmartphonesPro from '../assets/images/energy_smartphones_pro_1794316755805.jpg';
import energyWirelessEarbuds from '../assets/images/energy_wireless_earbuds_1794316757804.jpg';
import energyMagsafeCases from '../assets/images/energy_magsafe_cases_1794316758693.jpg';
import energyTechRepair from '../assets/images/energy_tech_repair_1794316759661.jpg';

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

export interface SavedStoreEntry {
  id: string;
  label: string;
  domainRef: string;
  config: StoreConfig;
}

export const DUDA_MELLO_CONFIG: StoreConfig = {
  storeName: 'Duda Mello Boutique',
  slogan: 'Moda com estilo para brilhar em qualquer dia.',
  logoUrl: boutiqueAvatarLogo,
  specialties: ['Moda feminina', 'Moda masculina', 'Infantil', 'Calçados'],
  cityState: 'Itatinga/SP',
  marqueePhrase1: 'NOVIDADES TODA SEMANA',
  marqueePhrase2: 'ESQUENTA BLACK',
  whatsappNumber: '5567993174612',
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
  phoneDisplay: '+55 (67) 99317-4612',
  phoneTel: '+5567993174612',
  paymentMethods: ['Pix', 'Crédito', 'Débito', 'Dinheiro'],
  maxInstallments: 10,
  openingHours: 'Seg a sáb: 8h às 18h · Dom: fechado',
  agencyCreditName: 'BiositesAi',
  agencyCreditUrl: 'https://wa.me/5567993174612',
  categories: [
    {
      id: 'todos',
      name: 'Tudo',
      img: boutiqueAvatarLogo,
    },
    {
      id: 'bolsas',
      name: 'Bolsas',
      img: productHandbagClassic,
    },
    {
      id: 'feminino',
      name: 'Moda feminina',
      img: productDenimJacket,
    },
    {
      id: 'calcados',
      name: 'Calçados',
      img: productPapeteSandal,
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
      img: productHandbagClassic,
      featured: true,
    },
    {
      id: 2,
      name: 'Jaqueta Jeans Cropped Bege',
      desc: 'Curtinha, botões dourados, combina com tudo.',
      price: null,
      installments: 10,
      category: 'feminino',
      img: productDenimJacket,
      featured: true,
    },
    {
      id: 3,
      name: 'Sandália Papete Ramarim',
      desc: 'Solado confortável, dourada ou off-white.',
      price: 89.9,
      installments: 10,
      category: 'calcados',
      img: productPapeteSandal,
      featured: true,
    },
    {
      id: 4,
      name: 'Tênis Chunky SNK',
      desc: 'Plataforma confortável, várias cores.',
      price: 299.9,
      installments: 10,
      category: 'calcados',
      img: productChunkySneaker,
      featured: true,
    },
    {
      id: 5,
      name: 'Bolsa Tiracolo Matelassê Caramelo',
      desc: 'Acabamento premium com alça transversal regulável e fecho metálico.',
      price: 189.9,
      installments: 10,
      category: 'bolsas',
      img: productHandbagClassic,
    },
    {
      id: 6,
      name: 'Conjunto Alfaiataria Linho Off-White',
      desc: 'Corte impecável, tecido leve e caimento elegante para todas as ocasiões.',
      price: 249.9,
      installments: 10,
      category: 'feminino',
      img: productDenimJacket,
    },
  ],
};

export const ENERGY_STOR3_CONFIG: StoreConfig = {
  storeName: 'Energy Stor3',
  slogan:
    'Eletrônicos, acessórios e assistência técnica. Quase 10 anos de mercado.',
  logoUrl: energyStoreLogo,
  specialties: ['Celulares', 'Acessórios', 'Assistência técnica', 'Atacado'],
  cityState: 'São Paulo/SP',
  marqueePhrase1: 'CELULARES · ACESSÓRIOS · GAMES',
  marqueePhrase2: 'ASSISTÊNCIA TÉCNICA ESPECIALIZADA',
  whatsappNumber: '5567993174612',
  whatsappHeroText: 'Olá! Vim pelo site da Energy Stor3 e quero atendimento.',
  whatsappSubtitle: 'Atendimento rápido · varejo e atacado',
  catalogSubtitle: 'Celulares, fones, capinhas e assistência técnica',
  instagramHandle: '@energystor3',
  instagramUrl: 'https://instagram.com/energystor3',
  wifiSsid: 'Energy Stor3 Clientes',
  wifiPassword: '',
  wifiEncryption: 'nopass',
  offerBadge: 'Oferta',
  offerStockLabel: 'Desconto especial -15%',
  offerTitle: 'JBL Tune Flex 2 + Película 3D',
  offerDescription: 'Fone Bluetooth até 48h de bateria com condição exclusiva',
  offerPriceHighlight: 'R$ 599,00',
  offerWhatsappText:
    'Olá! Vim pelo site da Energy Stor3 e quero garantir a oferta do JBL Tune Flex 2!',
  offerDurationHours: 48,
  googleRating: '4,8',
  googleReviewUrl: 'https://maps.google.com/?cid=11105222543249429476',
  aboutText:
    'A Energy Stor3 está há quase 10 anos no Bom Retiro, em São Paulo, com celulares, eletrônicos, acessórios e assistência técnica especializada. São 3 lojas: Loja 01 na Rua José Paulino, 30, Loja 02 na Rua da Graça, 275, e Loja 03 na Rua Três Rios, 208. Atendemos varejo, atacado e empresas. Chame no WhatsApp para ver produtos, preços e orçamentos de conserto.',
  serviceTags: [
    'Celulares',
    'Capinhas',
    'Películas',
    'Fones',
    'Smartwatch',
    'Carregadores',
    'PC Gamer',
    'Games',
    'Notebook',
    'MacBook',
    'Assistência técnica',
  ],
  faqs: [
    {
      question: 'Onde ficam as lojas?',
      answer:
        'No Bom Retiro, em São Paulo. Loja 01: Rua José Paulino, 30. Loja 02: Rua da Graça, 275. Loja 03: Rua Três Rios, 208.',
    },
    {
      question: 'Vocês vendem no atacado?',
      answer:
        'Sim. Atendemos varejo, atacado e empresas. Chame no WhatsApp para condições de atacado e corporativo.',
    },
    {
      question: 'Fazem conserto de celular?',
      answer:
        'Sim. Temos assistência técnica especializada em celulares, notebooks e games. Peça seu orçamento pelo WhatsApp.',
    },
    {
      question: 'Como vejo os preços e faço meu pedido?',
      answer:
        'Toque em Adicionar nos produtos desejados e clique em Enviar no WhatsApp. O WhatsApp abre com sua lista pronta e respondemos rápido.',
    },
  ],
  address:
    'Loja 01: Rua José Paulino, 30 · Loja 02: Rua da Graça, 275 · Loja 03: Rua Três Rios, 208 - Bom Retiro · São Paulo/SP',
  mapsUrl: 'https://maps.google.com/?cid=11105222543249429476',
  phoneDisplay: '+55 (67) 99317-4612',
  phoneTel: '+5567993174612',
  paymentMethods: ['Pix', 'Crédito', 'Débito', 'Dinheiro', 'Transf.'],
  maxInstallments: 12,
  openingHours: 'Seg a sáb: 8h às 18h · Bom Retiro, São Paulo/SP',
  agencyCreditName: 'BiositesAi',
  agencyCreditUrl: 'https://wa.me/5567993174612',
  categories: [
    {
      id: 'todos',
      name: 'Tudo',
      img: energyStoreLogo,
    },
    {
      id: 'celulares',
      name: 'Celulares',
      img: energySmartphonesPro,
    },
    {
      id: 'fones',
      name: 'Fones de ouvido',
      img: energyWirelessEarbuds,
    },
    {
      id: 'capinhas',
      name: 'Capinhas',
      img: energyMagsafeCases,
    },
    {
      id: 'assistencia',
      name: 'Assistência técnica',
      img: energyTechRepair,
    },
  ],
  products: [
    {
      id: 101,
      name: 'iPhone 17 Pro Max 256 GB',
      desc: 'Lacrado, 1 ano de garantia Apple · Lançamento.',
      price: 11499.0,
      installments: 12,
      category: 'celulares',
      img: energySmartphonesPro,
      featured: true,
    },
    {
      id: 102,
      name: 'Samsung Galaxy S25 Ultra 256 GB',
      desc: 'Câmera de 200 MP e S Pen integrada · Mais vendido.',
      price: 7999.0,
      installments: 12,
      category: 'celulares',
      img: energySmartphonesPro,
      featured: true,
    },
    {
      id: 103,
      name: 'Xiaomi Redmi Note 14 Pro 256 GB',
      desc: '8 GB de RAM, tela AMOLED 120 Hz.',
      price: 2199.0,
      installments: 12,
      category: 'celulares',
      img: energySmartphonesPro,
    },
    {
      id: 104,
      name: 'AirPods Pro 3',
      desc: 'Cancelamento de ruído ativo · Novo.',
      price: 2499.0,
      installments: 12,
      category: 'fones',
      img: energyWirelessEarbuds,
      featured: true,
    },
    {
      id: 105,
      name: 'Galaxy Buds3 Pro',
      desc: 'Som Hi-Fi e cancelamento de ruído inteligente.',
      price: 1499.0,
      installments: 12,
      category: 'fones',
      img: energyWirelessEarbuds,
    },
    {
      id: 106,
      name: 'JBL Tune Flex 2',
      desc: 'Bluetooth, até 48 h de bateria (-15% OFF).',
      price: 599.0,
      installments: 12,
      category: 'fones',
      img: energyWirelessEarbuds,
    },
    {
      id: 107,
      name: 'Capinha MagSafe transparente',
      desc: 'Para iPhone, proteção premium que não amarela.',
      price: 89.9,
      installments: 12,
      category: 'capinhas',
      img: energyMagsafeCases,
    },
    {
      id: 108,
      name: 'Capinha anti-impacto',
      desc: 'Para Samsung, bordas reforçadas de alta absorção.',
      price: 59.9,
      installments: 12,
      category: 'capinhas',
      img: energyMagsafeCases,
    },
    {
      id: 109,
      name: 'Capinha de silicone aveludada',
      desc: 'Várias cores disponíveis, interior em microfibra e toque macio.',
      price: 49.9,
      installments: 12,
      category: 'capinhas',
      img: energyMagsafeCases,
    },
    {
      id: 110,
      name: 'Troca de tela (iPhone e Samsung)',
      desc: 'Peça com garantia e instalação técnica especializada.',
      price: 349.0,
      installments: 12,
      category: 'assistencia',
      img: energyTechRepair,
    },
    {
      id: 111,
      name: 'Troca de bateria expressa',
      desc: 'Feita na hora em laboratório próprio, com garantia.',
      price: 199.0,
      installments: 12,
      category: 'assistencia',
      img: energyTechRepair,
    },
    {
      id: 112,
      name: 'Película 3D + instalação',
      desc: 'Aplicada na loja por especialista, alinhamento perfeito sem bolhas.',
      price: 39.9,
      installments: 12,
      category: 'assistencia',
      img: energyTechRepair,
    },
  ],
};

export const INITIAL_STORES: SavedStoreEntry[] = [
  {
    id: 'duda-mello',
    label: 'Loja 1: Duda Mello Boutique',
    domainRef: 'dudamelloboutique.nourbiosite.com.br',
    config: DUDA_MELLO_CONFIG,
  },
  {
    id: 'energy-stor3',
    label: 'Loja 2: Energy Stor3',
    domainRef: 'energystor3.nourbiosite.com.br',
    config: ENERGY_STOR3_CONFIG,
  },
];
