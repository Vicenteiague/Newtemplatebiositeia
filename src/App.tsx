/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  MessageCircle,
  ShoppingBag,
  Instagram,
  Wifi,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Download,
  Code2,
  SlidersHorizontal,
  Plus,
  Trash2,
  RotateCcw,
  Phone,
  Navigation,
  Star,
  ExternalLink,
  X,
  Sun,
  Moon,
  Store,
  Eye,
  Share2,
} from 'lucide-react';
import {
  INITIAL_STORES,
  SavedStoreEntry,
  StoreConfig,
  ProductItem,
} from './data/defaultStoreConfig';
import { generateSingleFileHtml } from './utils/generateSingleFileHtml';

function detectInitialRoute(): {
  storeId: string;
  customerViewOnly: boolean;
} {
  if (typeof window === 'undefined') {
    return { storeId: 'energy-stor3', customerViewOnly: false };
  }
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const queryStore = params.get('loja')?.toLowerCase();
  const queryMode = params.get('modo')?.toLowerCase();

  if (path === 'duda-mello' || path === 'dudamelloboutique') {
    return { storeId: 'duda-mello', customerViewOnly: queryMode !== 'studio' };
  }
  if (path === 'energy-stor3' || path === 'energystor3') {
    return {
      storeId: 'energy-stor3',
      customerViewOnly: queryMode !== 'studio',
    };
  }
  if (queryStore === 'duda-mello' || queryStore === 'energy-stor3') {
    return {
      storeId: queryStore,
      customerViewOnly: queryMode === 'vitrine' || queryMode === 'cliente',
    };
  }
  return {
    storeId: 'energy-stor3',
    customerViewOnly: queryMode === 'vitrine' || queryMode === 'cliente',
  };
}

export default function App() {
  const initialRoute = useMemo(() => detectInitialRoute(), []);
  const [stores, setStores] = useState<SavedStoreEntry[]>(INITIAL_STORES);
  const [activeStoreId, setActiveStoreId] = useState<string>(
    initialRoute.storeId
  );
  const [isCustomerView, setIsCustomerView] = useState<boolean>(
    initialRoute.customerViewOnly
  );

  const activeStoreEntry = useMemo(
    () => stores.find((s) => s.id === activeStoreId) || stores[0],
    [stores, activeStoreId]
  );

  const config = activeStoreEntry.config;

  // Dynamic document title for Vercel routes
  useEffect(() => {
    document.title = `${config.storeName} — ${config.slogan}`;
  }, [config.storeName, config.slogan]);

  const setConfig = (
    updater: StoreConfig | ((prev: StoreConfig) => StoreConfig)
  ) => {
    setStores((prevStores) =>
      prevStores.map((entry) => {
        if (entry.id !== activeStoreEntry.id) return entry;
        const nextConfig =
          typeof updater === 'function' ? updater(entry.config) : updater;
        return {
          ...entry,
          label: nextConfig.storeName,
          config: nextConfig,
        };
      })
    );
  };

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('biosite_studio_theme');
      if (saved === 'light') return false;
      if (saved === 'dark') return true;
    } catch {
      // ignore storage errors
    }
    return true;
  });

  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'rel' | 'menor' | 'maior'>('rel');
  const [cart, setCart] = useState<number[]>([]);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedWhatsappMsg, setCopiedWhatsappMsg] = useState(false);
  const [copiedVercelUrl, setCopiedVercelUrl] = useState(false);
  const [studioTab, setStudioTab] = useState<'editor' | 'code'>('code');
  const [orderPreviewOpen, setOrderPreviewOpen] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // New product form state inside customizer
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');

  // Sync default category in form when switching stores
  useEffect(() => {
    const firstNonAll = config.categories.find((c) => c.id !== 'todos');
    setNewProdCategory(firstNonAll ? firstNonAll.id : 'todos');
  }, [activeStoreId, config.categories]);

  // Sync theme with <html class="dark">
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('biosite_studio_theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  // Countdown timer state (2 days, 14 hours, 35 mins, 40 secs)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    2 * 86400 + 14 * 3600 + 35 * 60 + 40
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 86400 * 2 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    const d = Math.floor(remainingSeconds / 86400);
    const h = Math.floor((remainingSeconds % 86400) / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    return {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      mins: String(m).padStart(2, '0'),
      secs: String(s).padStart(2, '0'),
    };
  }, [remainingSeconds]);

  // Switch active store without losing previous stores
  const handleSelectStore = (storeId: string) => {
    setActiveStoreId(storeId);
    setActiveCategory('todos');
    setCart([]);
    setSortBy('rel');
  };

  // Create a brand new store cloned from the current template
  const handleCreateNewStore = () => {
    const nextNumber = stores.length + 1;
    const newId = `loja-${Date.now()}`;
    const clonedConfig: StoreConfig = JSON.parse(JSON.stringify(config));
    clonedConfig.storeName = `Nova Loja ${nextNumber}`;
    const newEntry: SavedStoreEntry = {
      id: newId,
      label: `Loja ${nextNumber}: Nova Loja`,
      domainRef: `novaloja${nextNumber}.nourbiosite.com.br`,
      config: clonedConfig,
    };
    setStores((prev) => [...prev, newEntry]);
    setActiveStoreId(newId);
    setActiveCategory('todos');
    setCart([]);
    setStudioTab('editor');
  };

  const handleRestoreInitialStores = () => {
    setStores(INITIAL_STORES);
    setActiveCategory('todos');
    setCart([]);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const list = config.products.filter(
      (p) => activeCategory === 'todos' || p.category === activeCategory
    );
    const sorted = [...list];
    if (sortBy === 'menor') {
      sorted.sort(
        (a, b) =>
          (a.price !== null ? a.price : 999999) -
          (b.price !== null ? b.price : 999999)
      );
    } else if (sortBy === 'maior') {
      sorted.sort(
        (a, b) =>
          (b.price !== null ? b.price : 0) - (a.price !== null ? a.price : 0)
      );
    }
    return sorted;
  }, [config.products, activeCategory, sortBy]);

  // Selected cart items & WhatsApp URL
  const selectedCartProducts = useMemo(
    () => config.products.filter((p) => cart.includes(p.id)),
    [config.products, cart]
  );

  const cartSubtotal = useMemo(
    () =>
      selectedCartProducts.reduce((sum, item) => sum + (item.price || 0), 0),
    [selectedCartProducts]
  );

  const whatsappOrderMessage = useMemo(() => {
    if (selectedCartProducts.length === 0) return '';
    const lines = selectedCartProducts.map(
      (p) =>
        `• ${p.name} (${
          p.price !== null
            ? 'R$ ' + p.price.toFixed(2).replace('.', ',')
            : 'Preço a combinar'
        })`
    );
    return `Olá, ${config.storeName}! Gostaria de fazer um pedido com os seguintes itens do catálogo:\n\n${lines.join(
      '\n'
    )}\n\nPodem confirmar a disponibilidade?`;
  }, [selectedCartProducts, config.storeName]);

  const whatsappCartUrl = useMemo(() => {
    const cleanPhone = config.whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      whatsappOrderMessage
    )}`;
  }, [config.whatsappNumber, whatsappOrderMessage]);

  const wifiQrUrl = useMemo(() => {
    const data =
      config.wifiEncryption === 'nopass' || !config.wifiPassword
        ? `WIFI:T:nopass;S:${encodeURIComponent(config.wifiSsid)};;`
        : `WIFI:T:WPA;S:${encodeURIComponent(
            config.wifiSsid
          )};P:${encodeURIComponent(config.wifiPassword)};;`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${data}`;
  }, [config.wifiEncryption, config.wifiPassword, config.wifiSsid]);

  const singleFileHtmlCode = useMemo(
    () => generateSingleFileHtml(config, isDark ? 'dark' : 'light'),
    [config, isDark]
  );

  const storeDirectPath = useMemo(() => {
    if (activeStoreEntry.id === 'energy-stor3') return '/energy-stor3';
    if (activeStoreEntry.id === 'duda-mello') return '/duda-mello';
    return `/?loja=${activeStoreEntry.id}&modo=vitrine`;
  }, [activeStoreEntry.id]);

  const toggleCart = (productId: number) => {
    setCart((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(singleFileHtmlCode);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = singleFileHtmlCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    }
  };

  const handleCopyVercelLink = async () => {
    const fullUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${storeDirectPath}`
        : storeDirectPath;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedVercelUrl(true);
      setTimeout(() => setCopiedVercelUrl(false), 2200);
    } catch {
      setCopiedVercelUrl(true);
      setTimeout(() => setCopiedVercelUrl(false), 2200);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([singleFileHtmlCode], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug =
      config.storeName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'biosite';
    a.download = `${slug}-biosite-catalogo.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyWifi = async () => {
    const textToCopy = config.wifiPassword || config.wifiSsid;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    } catch {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const handleCopyOrderMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappOrderMessage);
      setCopiedWhatsappMsg(true);
      setTimeout(() => setCopiedWhatsappMsg(false), 2000);
    } catch {
      setCopiedWhatsappMsg(true);
      setTimeout(() => setCopiedWhatsappMsg(false), 2000);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const parsedPrice =
      newProdPrice.trim() === ''
        ? null
        : parseFloat(newProdPrice.replace(',', '.'));
    const categoryObj = config.categories.find(
      (c) => c.id === newProdCategory
    );
    const newItem: ProductItem = {
      id: Date.now(),
      name: newProdName.trim(),
      desc:
        newProdDesc.trim() ||
        'Produto disponível com garantia e atendimento rápido pelo WhatsApp.',
      price:
        parsedPrice !== null && !Number.isNaN(parsedPrice) ? parsedPrice : null,
      installments: config.maxInstallments,
      category: newProdCategory,
      img: categoryObj?.img || config.logoUrl,
    };
    setConfig((prev) => ({
      ...prev,
      products: [newItem, ...prev.products],
    }));
    setNewProdName('');
    setNewProdDesc('');
    setNewProdPrice('');
  };

  const handleRemoveProduct = (id: number) => {
    setConfig((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
    setCart((prev) => prev.filter((itemId) => itemId !== id));
  };

  const markImageBroken = (key: string) => {
    setBrokenImages((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-28 transition-colors duration-200">
      {/* TOP BAR CONTRACT: 3 ZONES (Brand | 4 Single-line Nav Links | 1 Primary Action) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-stone-200 dark:border-neutral-800/80 transition-colors duration-200">
        <a
          href="#perfil"
          className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap shrink-0 font-editorial"
        >
          {config.storeName}
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400"
        >
          <a
            href="#catalogo"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </a>
          <a
            href="#oferta"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Oferta Relâmpago
          </a>
          <a
            href="#sobre-faq"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Perguntas
          </a>
          <a
            href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Atendimento
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCustomerView((prev) => !prev)}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 rounded-xl hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isCustomerView ? 'Abrir Painel Studio' : 'Ver como Cliente'}
          </button>
        </div>
      </header>

      {/* WORKSPACE CONTAINER */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 sm:pt-6">
        {/* MULTI-STORE SWITCHER BAR (Only visible in Studio Mode) */}
        {!isCustomerView && (
          <div className="px-4 sm:px-0 py-3 mb-2 sm:mb-5 flex flex-wrap items-center justify-between gap-3 border-b sm:border border-stone-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 sm:rounded-2xl sm:p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <Store className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Escolha a Loja (Pronto para Deploy Vercel):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {stores.map((storeEntry) => {
                const isSelected = storeEntry.id === activeStoreEntry.id;
                return (
                  <button
                    key={storeEntry.id}
                    type="button"
                    onClick={() => handleSelectStore(storeEntry.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 shadow-sm'
                        : 'bg-stone-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-stone-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {storeEntry.config.storeName}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleCreateNewStore}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Loja</span>
              </button>
            </div>
          </div>
        )}

        <div
          className={
            isCustomerView
              ? 'max-w-md mx-auto'
              : 'lg:grid lg:grid-cols-12 lg:gap-10 items-start'
          }
        >
          {/* THE CLONED MOBILE-FIRST BIOSITE & MINI-CATALOG (max-w-md mx-auto) */}
          <div className={isCustomerView ? '' : 'lg:col-span-5 xl:col-span-5'}>
            <main
              id="perfil"
              className="max-w-md mx-auto bg-white dark:bg-neutral-900/60 min-h-screen sm:rounded-3xl border-x sm:border border-stone-200 dark:border-neutral-800/80 shadow-2xl overflow-hidden transition-colors duration-200"
            >
              {/* BARRA SUPERIOR DO BIOSITE: LOCALIZAÇÃO + BOTÃO MODO DIA / NOITE */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2.5 border-b border-stone-200/80 dark:border-neutral-800/70 bg-stone-50/80 dark:bg-neutral-900/50">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span id="store-city">{config.cityState}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  aria-label={isDark ? 'Ativar Modo Dia' : 'Ativar Modo Noite'}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-200/80 dark:bg-neutral-800 hover:bg-stone-300/70 dark:hover:bg-neutral-700 border border-stone-300/80 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[36px]"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Modo Dia</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Modo Noite</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. HEADER DO PERFIL */}
              <div className="relative pt-8 pb-6 px-6 text-center bg-gradient-to-b from-amber-500/15 via-stone-50/40 dark:via-neutral-900/40 to-transparent">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/20">
                  {!brokenImages[`logo-${activeStoreEntry.id}`] ? (
                    <img
                      id="store-logo"
                      src={config.logoUrl}
                      alt={`Logo ${config.storeName}`}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        markImageBroken(`logo-${activeStoreEntry.id}`)
                      }
                      className="w-full h-full object-cover rounded-full border-2 border-white dark:border-neutral-950"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full border-2 border-white dark:border-neutral-950 bg-stone-100 dark:bg-neutral-900 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xl">
                      {config.storeName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <h1
                  id="store-name"
                  className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
                  style={{ textWrap: 'balance' }}
                >
                  {config.storeName}
                </h1>
                <p
                  id="store-slogan"
                  className="text-sm text-neutral-600 dark:text-neutral-300 mt-1"
                >
                  {config.slogan}
                </p>

                {/* Especialidades separadas por pontos */}
                <div
                  id="store-specialties"
                  className="flex flex-wrap items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-300/90 mt-3 font-medium"
                >
                  {config.specialties.map((spec, idx) => (
                    <React.Fragment key={spec}>
                      <span>{spec}</span>
                      {idx < config.specialties.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="text-neutral-400 dark:text-neutral-600"
                        >
                          •
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 2. FAIXA MARQUEE (TICKER) */}
              <div className="bg-amber-400 text-neutral-950 py-2 overflow-hidden border-y border-amber-300 font-bold text-xs tracking-wider uppercase">
                <div className="animate-marquee flex items-center gap-4">
                  <span>{config.marqueePhrase1}</span>
                  <span aria-hidden="true">★</span>
                  <span>{config.marqueePhrase2}</span>
                  <span aria-hidden="true">★</span>
                  <span>{config.marqueePhrase1}</span>
                  <span aria-hidden="true">★</span>
                  <span>{config.marqueePhrase2}</span>
                  <span aria-hidden="true">★</span>
                  <span>{config.marqueePhrase1}</span>
                  <span aria-hidden="true">★</span>
                  <span>{config.marqueePhrase2}</span>
                  <span aria-hidden="true">★</span>
                </div>
              </div>

              {/* 3. BLOCO DE LINKS PRINCIPAIS */}
              <section className="p-5 space-y-3" aria-label="Links principais">
                {/* Card 1 (Destaque Principal): Botão WhatsApp */}
                <a
                  id="link-whatsapp-hero"
                  href={`https://wa.me/${config.whatsappNumber.replace(
                    /\D/g,
                    ''
                  )}?text=${encodeURIComponent(config.whatsappHeroText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/50 hover:scale-[1.01] transition-transform min-h-[48px]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-white/15 rounded-xl shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-emerald-100 mb-0.5">
                        Atendimento rápido
                      </span>
                      <b className="block text-base leading-tight">
                        Chamar no WhatsApp
                      </b>
                      <small className="text-emerald-100 text-xs">
                        {config.whatsappSubtitle}
                      </small>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-80 shrink-0" />
                </a>

                {/* Card 2: Âncora para #catalogo ("Ver catálogo") */}
                <a
                  href="#catalogo"
                  className="flex items-center justify-between p-4 rounded-2xl bg-stone-100 dark:bg-neutral-800/80 hover:bg-stone-200/70 dark:hover:bg-neutral-800 border border-stone-200 dark:border-neutral-700/70 transition-colors min-h-[48px]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <b className="block text-sm text-neutral-900 dark:text-white">
                        Ver catálogo
                      </b>
                      <small className="text-neutral-600 dark:text-neutral-400 text-xs">
                        {config.catalogSubtitle}
                      </small>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                </a>

                {/* Card 3: Link para o Instagram */}
                <a
                  id="link-instagram"
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-stone-100 dark:bg-neutral-800/80 hover:bg-stone-200/70 dark:hover:bg-neutral-800 border border-stone-200 dark:border-neutral-700/70 transition-colors min-h-[48px]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-pink-500/15 text-pink-600 dark:text-pink-400 rounded-xl shrink-0">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <b className="block text-sm text-neutral-900 dark:text-white">
                        Siga no Instagram
                      </b>
                      <small
                        id="instagram-handle"
                        className="text-neutral-600 dark:text-neutral-400 text-xs"
                      >
                        {config.instagramHandle}
                      </small>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                </a>

                {/* Card 4 (<details>): "Wi-Fi grátis" com QR Code gerado automaticamente */}
                <details className="group rounded-2xl bg-stone-100 dark:bg-neutral-800/80 border border-stone-200 dark:border-neutral-700/70 overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none min-h-[48px]">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-sky-500/15 text-sky-600 dark:text-sky-400 rounded-xl shrink-0">
                        <Wifi className="w-5 h-5" />
                      </div>
                      <div>
                        <b className="block text-sm text-neutral-900 dark:text-white">
                          Wi-Fi grátis
                        </b>
                        <small className="text-neutral-600 dark:text-neutral-400 text-xs">
                          Rede: {config.wifiSsid}
                        </small>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <div className="px-4 pb-4 pt-3 border-t border-stone-200 dark:border-neutral-700/50 text-center space-y-3 bg-stone-50 dark:bg-neutral-900/50">
                    <img
                      src={wifiQrUrl}
                      alt={`QR Code Wi-Fi ${config.wifiSsid}`}
                      referrerPolicy="no-referrer"
                      className="w-32 h-32 mx-auto rounded-xl p-2 bg-white border border-stone-200 dark:border-transparent"
                    />
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">
                      Aponte a <b>câmera</b> de outro celular para o QR Code:
                      ele conecta sozinho.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-left bg-white dark:bg-neutral-800 border border-stone-200 dark:border-transparent p-3 rounded-xl text-xs">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block">
                          Rede
                        </span>
                        <b className="text-neutral-900 dark:text-white truncate block">
                          {config.wifiSsid}
                        </b>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block">
                          Senha
                        </span>
                        <b className="text-emerald-600 dark:text-emerald-400 truncate block">
                          {config.wifiPassword
                            ? config.wifiPassword
                            : 'Aberta, sem senha'}
                        </b>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyWifi}
                      className="w-full py-2 px-3 rounded-xl bg-stone-200/80 dark:bg-neutral-800 hover:bg-stone-300/70 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedWifi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Dados da rede copiados!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                          <span>Copiar nome da rede</span>
                        </>
                      )}
                    </button>
                  </div>
                </details>
              </section>

              {/* 4. CARROSSEL DE CATEGORIAS */}
              <section className="py-4 px-5">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Categorias
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                  Deslize e conheça tudo o que tem na loja.
                </p>
                <div
                  id="categories-carousel"
                  className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
                >
                  {config.categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const imgKey = `cat-${activeStoreEntry.id}-${cat.id}`;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 w-28 rounded-2xl overflow-hidden border text-left transition cursor-pointer ${
                          isActive
                            ? 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-400/30 bg-stone-100 dark:bg-neutral-800'
                            : 'border-stone-200 dark:border-neutral-800 bg-stone-100/70 dark:bg-neutral-800/60 hover:border-stone-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        {!brokenImages[imgKey] ? (
                          <img
                            src={cat.img}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            onError={() => markImageBroken(imgKey)}
                            className="w-full h-20 object-cover"
                          />
                        ) : (
                          <div className="w-full h-20 bg-stone-200 dark:bg-neutral-800 flex items-center justify-center text-amber-600/60 dark:text-amber-400/60">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                        <div className="p-2 text-xs font-semibold text-neutral-900 dark:text-white truncate">
                          {cat.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 5. CATÁLOGO INTERATIVO (#catalogo) */}
              <section id="catalogo" className="py-4 px-5 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Destaques da loja
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Escolha os produtos, toque em <b>Adicionar</b> e envie o
                    pedido pelo WhatsApp.
                  </p>
                </div>

                {/* Barra com botões de filtro por categoria */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {config.categories.map((cat) => {
                    const active = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                          active
                            ? 'bg-amber-400 text-neutral-950'
                            : 'bg-stone-200/80 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>

                {/* Barra de Ordenação (<select>) e Contador de produtos exibidos */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    id="product-count"
                    className="text-xs text-neutral-600 dark:text-neutral-400 tabular-nums"
                  >
                    Exibindo {filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                  </span>
                  <select
                    id="sort-select"
                    aria-label="Ordenar produtos"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'rel' | 'menor' | 'maior')
                    }
                    className="bg-stone-100 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 text-xs rounded-xl px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="rel">Relevância</option>
                    <option value="menor">Menor preço</option>
                    <option value="maior">Maior preço</option>
                  </select>
                </div>

                {/* Grid de 2 Colunas com Cards de Produto */}
                <div id="products-grid" className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((p) => {
                    const inCart = cart.includes(p.id);
                    const imgKey = `prod-${activeStoreEntry.id}-${p.id}`;
                    const inst = p.installments || config.maxInstallments || 10;
                    return (
                      <article
                        key={p.id}
                        className="rounded-2xl bg-stone-100/80 dark:bg-neutral-800/70 border border-stone-200 dark:border-neutral-700/60 overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5"
                      >
                        <div>
                          {!brokenImages[imgKey] ? (
                            <img
                              src={p.img}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              onError={() => markImageBroken(imgKey)}
                              className="w-full h-36 object-cover bg-stone-200 dark:bg-neutral-900"
                            />
                          ) : (
                            <div className="w-full h-36 bg-stone-200 dark:bg-neutral-900 flex flex-col items-center justify-center text-neutral-500 p-2 text-center">
                              <ShoppingBag className="w-6 h-6 text-amber-600/60 dark:text-amber-400/60 mb-1" />
                              <span className="text-[10px]">{p.name}</span>
                            </div>
                          )}
                          <div className="p-3 space-y-1">
                            <b className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                              {p.name}
                            </b>
                            <small className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 block leading-snug">
                              {p.desc}
                            </small>
                            <div className="pt-1.5">
                              {p.price !== null ? (
                                <>
                                  <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                                    R$ {p.price.toFixed(2).replace('.', ',')}
                                  </div>
                                  <small className="text-[10px] text-neutral-500 dark:text-neutral-400 block tabular-nums">
                                    ou {inst}x de R${' '}
                                    {(p.price / inst)
                                      .toFixed(2)
                                      .replace('.', ',')}
                                  </small>
                                </>
                              ) : (
                                <>
                                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    Preço a combinar
                                  </div>
                                  <small className="text-[10px] text-neutral-500 block">
                                    Consulte no WhatsApp
                                  </small>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-3 pt-0">
                          <button
                            type="button"
                            onClick={() => toggleCart(p.id)}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer min-h-[40px] ${
                              inCart
                                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                : 'bg-amber-400 text-neutral-950 hover:bg-amber-300'
                            }`}
                          >
                            {inCart ? '✓ Adicionado' : '+ Adicionar'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* 6. CARD DE OFERTA RELÂMPAGO */}
              <section
                id="oferta"
                className="mx-5 my-6 p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-50/70 dark:via-neutral-900 to-stone-100 dark:to-neutral-900 border border-amber-500/40 space-y-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {config.offerBadge}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                    {config.offerStockLabel}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                    {config.offerTitle}
                  </h2>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {config.offerDescription} —{' '}
                    <b className="text-amber-700 dark:text-amber-400 tabular-nums">
                      {config.offerPriceHighlight}
                    </b>
                  </p>
                </div>
                {/* Cronômetro Regressivo Funcional (Dias, Horas, Min, Seg) */}
                <div className="grid grid-cols-4 gap-2 text-center tabular-nums">
                  <div className="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2">
                    <b
                      id="t-days"
                      className="text-lg text-neutral-900 dark:text-white block font-mono"
                    >
                      {countdown.days}
                    </b>
                    <small className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      dias
                    </small>
                  </div>
                  <div className="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2">
                    <b
                      id="t-hours"
                      className="text-lg text-neutral-900 dark:text-white block font-mono"
                    >
                      {countdown.hours}
                    </b>
                    <small className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      horas
                    </small>
                  </div>
                  <div className="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2">
                    <b
                      id="t-mins"
                      className="text-lg text-neutral-900 dark:text-white block font-mono"
                    >
                      {countdown.mins}
                    </b>
                    <small className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      min
                    </small>
                  </div>
                  <div className="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2">
                    <b
                      id="t-secs"
                      className="text-lg text-amber-600 dark:text-amber-400 block font-mono"
                    >
                      {countdown.secs}
                    </b>
                    <small className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      seg
                    </small>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${config.whatsappNumber.replace(
                    /\D/g,
                    ''
                  )}?text=${encodeURIComponent(config.offerWhatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition-colors"
                >
                  Garantir minha oferta
                </a>
              </section>

              {/* 7. CARD DE AVALIAÇÃO NO GOOGLE */}
              <section className="mx-5 my-6 p-5 rounded-2xl bg-stone-100 dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700/70 text-center space-y-2">
                <div
                  className="flex items-center justify-center gap-1 text-amber-500 dark:text-amber-400"
                  aria-label="5 estrelas no Google"
                >
                  <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-sm">
                  Gostou do atendimento?
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  <b className="text-neutral-900 dark:text-white tabular-nums">
                    {config.googleRating}
                  </b>{' '}
                  no Google · Sua avaliação ajuda outras pessoas a nos
                  encontrar.
                </p>
                <a
                  href={config.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 text-xs font-semibold text-white transition-colors"
                >
                  Avaliar no Google
                </a>
              </section>

              {/* 8. SEÇÃO SOBRE + TAGS + 4 FAQs */}
              <section id="sobre-faq" className="px-5 py-4 space-y-4">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Sobre {config.storeName}
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {config.aboutText}
                </p>

                {/* Tags de Produtos/Serviços */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-amber-700 dark:text-amber-300/90 pt-1">
                  {config.serviceTags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span>{tag}</span>
                      {idx < config.serviceTags.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="text-neutral-400 dark:text-neutral-600"
                        >
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">
                  Perguntas frequentes
                </h3>
                <div className="space-y-2 text-xs">
                  {config.faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-stone-100 dark:bg-neutral-800/70 border border-stone-200 dark:border-neutral-700/60 rounded-xl p-3.5"
                    >
                      <summary className="flex items-center justify-between font-semibold text-neutral-900 dark:text-white cursor-pointer list-none gap-2">
                        <span>{faq.question}</span>
                        <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <p className="text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              {/* 9. ONDE ESTAMOS + PAGAMENTOS */}
              <section className="px-5 py-4 space-y-4">
                <div className="p-4 rounded-2xl bg-stone-100 dark:bg-neutral-800/70 border border-stone-200 dark:border-neutral-700/60 space-y-3">
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Onde estamos
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {config.address}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={config.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 text-center rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Como chegar</span>
                    </a>
                    <a
                      href={`tel:${config.phoneTel}`}
                      className="py-2.5 px-3 text-center rounded-xl bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Ligar</span>
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-100 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 text-center space-y-1">
                  <div className="flex flex-wrap justify-center gap-3 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    {config.paymentMethods.map((method, idx) => (
                      <React.Fragment key={method}>
                        <span>{method}</span>
                        {idx < config.paymentMethods.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="text-neutral-400 dark:text-neutral-600"
                          >
                            •
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Parcelamos em até{' '}
                    <b className="tabular-nums">{config.maxInstallments}x</b> no
                    cartão
                  </p>
                </div>
              </section>

              {/* 10. RODAPÉ */}
              <footer className="px-5 py-8 text-center text-xs text-neutral-500 border-t border-stone-200 dark:border-neutral-800/80 space-y-1">
                <b className="text-neutral-800 dark:text-neutral-300 block">
                  {config.storeName}
                </b>
                <p>{config.address}</p>
                <p>
                  Tel: {config.phoneDisplay} · {config.openingHours}
                </p>
                <p className="pt-2 text-[11px] text-neutral-500">
                  Template por{' '}
                  <a
                    href={config.agencyCreditUrl}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 underline"
                  >
                    {config.agencyCreditName}
                  </a>
                </p>
              </footer>
            </main>
          </div>

          {/* RIGHT COLUMN: TEMPLATE STUDIO & COMPLETE HTML5 CODE EXPORT (Hidden in Customer View) */}
          {!isCustomerView && (
            <aside
              id="codigo-html"
              className="lg:col-span-7 xl:col-span-7 mt-8 lg:mt-0 px-4 sm:px-0"
            >
              <div className="bg-white dark:bg-neutral-900/70 border border-stone-200 dark:border-neutral-800 rounded-3xl p-6 space-y-6 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-neutral-800 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Deploy Vercel & Código HTML5 — {config.storeName}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Projeto configurado com <code>vercel.json</code> e rotas
                      diretas por loja (<code>/energy-stor3</code> e{' '}
                      <code>/duda-mello</code>) para enviar aos clientes.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsCustomerView(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-stone-200 dark:bg-neutral-800 hover:bg-stone-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Modo Vitrine</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyHtml}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {copiedHtml ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Código Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar HTML Completo</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadHtml}
                      className="px-3.5 py-2.5 rounded-xl bg-stone-200 dark:bg-neutral-800 hover:bg-stone-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar .html</span>
                    </button>
                  </div>
                </div>

                {/* VERCEL DIRECT ROUTE BOX */}
                <div className="p-4 rounded-2xl bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs space-y-0.5">
                    <b className="text-neutral-900 dark:text-white block">
                      Link Direto da Vitrine na Vercel (Visão Limpa do Cliente):
                    </b>
                    <span className="text-neutral-500 dark:text-neutral-400 font-mono">
                      {storeDirectPath}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVercelLink}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer self-start sm:self-auto"
                  >
                    {copiedVercelUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Link da Vitrine Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copiar Link da Vitrine</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Segmented Control: Ver Código HTML5 vs Personalizar Dados do Cliente */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-neutral-950 rounded-xl border border-stone-200 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setStudioTab('code')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                        studioTab === 'code'
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Code2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Código HTML5 ({config.storeName})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioTab('editor')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                        studioTab === 'editor'
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Editar Dados desta Loja</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDark((prev) => !prev)}
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isDark ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>Testar Modo Dia</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-amber-700" />
                          <span>Testar Modo Noite</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestoreInitialStores}
                      className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Padrão</span>
                    </button>
                  </div>
                </div>

                {studioTab === 'code' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span>
                        Arquivo único de <b>{config.storeName}</b> com Modo
                        Dia/Noite · Tailwind CDN + Lucide Icons + JS Vanilla
                      </span>
                      <span className="font-mono tabular-nums">
                        {singleFileHtmlCode.split('\n').length} linhas
                      </span>
                    </div>
                    <div className="relative rounded-2xl bg-neutral-950 border border-stone-300 dark:border-neutral-800 overflow-hidden">
                      <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto max-h-[680px] leading-relaxed select-all">
                        <code>{singleFileHtmlCode}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Bloco 1: Perfil e Contato */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Nome do Negócio (h1)
                        </label>
                        <input
                          type="text"
                          value={config.storeName}
                          onChange={(e) =>
                            setConfig({ ...config, storeName: e.target.value })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Cidade / UF
                        </label>
                        <input
                          type="text"
                          value={config.cityState}
                          onChange={(e) =>
                            setConfig({ ...config, cityState: e.target.value })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Slogan Curto
                        </label>
                        <input
                          type="text"
                          value={config.slogan}
                          onChange={(e) =>
                            setConfig({ ...config, slogan: e.target.value })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={config.phoneTel}
                          onChange={(e) => {
                            const val = e.target.value;
                            const digits = val.replace(/\D/g, '');
                            setConfig({
                              ...config,
                              whatsappNumber: digits || val,
                              phoneTel: val.startsWith('+')
                                ? val
                                : `+${digits}`,
                              phoneDisplay: val,
                            });
                          }}
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Arroba do Instagram
                        </label>
                        <input
                          type="text"
                          value={config.instagramHandle}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              instagramHandle: e.target.value,
                            })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Bloco 2: Marquee, Wi-Fi e Oferta Relâmpago */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-neutral-800">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Frase Marquee 1
                        </label>
                        <input
                          type="text"
                          value={config.marqueePhrase1}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              marqueePhrase1: e.target.value,
                            })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Frase Marquee 2
                        </label>
                        <input
                          type="text"
                          value={config.marqueePhrase2}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              marqueePhrase2: e.target.value,
                            })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Nome da Rede Wi-Fi (SSID)
                        </label>
                        <input
                          type="text"
                          value={config.wifiSsid}
                          onChange={(e) =>
                            setConfig({ ...config, wifiSsid: e.target.value })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Senha do Wi-Fi (vazio = aberta)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: cliente123 (ou deixe vazio)"
                          value={config.wifiPassword}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              wifiPassword: e.target.value,
                              wifiEncryption: e.target.value ? 'WPA' : 'nopass',
                            })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Título da Oferta Relâmpago
                        </label>
                        <input
                          type="text"
                          value={config.offerTitle}
                          onChange={(e) =>
                            setConfig({ ...config, offerTitle: e.target.value })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Preço / Destaque da Oferta
                        </label>
                        <input
                          type="text"
                          value={config.offerPriceHighlight}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              offerPriceHighlight: e.target.value,
                            })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Endereço Completo
                        </label>
                        <input
                          type="text"
                          value={config.address}
                          onChange={(e) =>
                            setConfig({ ...config, address: e.target.value })
                          }
                          className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Bloco 3: Gerenciar Produtos do Catálogo */}
                    <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 space-y-4">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                        Adicionar Produto ao Catálogo ({config.storeName})
                      </h3>
                      <form
                        onSubmit={handleAddProduct}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-3"
                      >
                        <input
                          type="text"
                          placeholder="Nome do produto"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          className="sm:col-span-2 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Preço (vazio = a combinar)"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          className="bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        >
                          {config.categories
                            .filter((c) => c.id !== 'todos')
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Descrição curta do item"
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          className="sm:col-span-3 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="submit"
                          className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl px-4 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Incluir Item</span>
                        </button>
                      </form>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {config.products.map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800/80 text-xs"
                          >
                            <div className="min-w-0">
                              <b className="text-neutral-900 dark:text-white block truncate">
                                {prod.name}
                              </b>
                              <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">
                                {prod.price !== null
                                  ? `R$ ${prod.price
                                      .toFixed(2)
                                      .replace('.', ',')}`
                                  : 'Preço a combinar'}{' '}
                                · {prod.category}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(prod.id)}
                              aria-label={`Remover ${prod.name}`}
                              className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* 11. BARRA FLUTUANTE DO CARRINHO WHATSAPP (<= 15% Mobile Viewport Height) */}
      {cart.length > 0 && (
        <div
          id="cart-bar"
          className={`fixed bottom-4 inset-x-4 max-w-md mx-auto ${
            isCustomerView ? '' : 'lg:left-8 lg:right-auto lg:w-[416px]'
          } bg-emerald-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 z-40 border border-emerald-400/30`}
        >
          <div className="min-w-0">
            <b id="cart-count" className="text-sm block tabular-nums">
              {cart.length}{' '}
              {cart.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </b>
            <small className="text-emerald-100 text-xs block truncate tabular-nums">
              {cartSubtotal > 0
                ? `Subtotal: R$ ${cartSubtotal.toFixed(2).replace('.', ',')}`
                : 'Pronto para enviar o pedido'}
            </small>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOrderPreviewOpen(true)}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Revisar
            </button>
            <a
              id="send-whatsapp-btn"
              href={whatsappCartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              Enviar no WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* MODAL DE REVISÃO DO PEDIDO WHATSAPP */}
      {orderPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resumo do pedido para WhatsApp"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Seu Pedido no WhatsApp ({config.storeName})
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Mensagem automática pronta para envio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrderPreviewOpen(false)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-2xl p-3.5 text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto">
              {whatsappOrderMessage}
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopyOrderMessage}
                className="py-2.5 px-4 rounded-xl bg-stone-200 dark:bg-neutral-800 hover:bg-stone-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedWhatsappMsg ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Mensagem Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Mensagem</span>
                  </>
                )}
              </button>
              <a
                href={whatsappCartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Abrir WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
