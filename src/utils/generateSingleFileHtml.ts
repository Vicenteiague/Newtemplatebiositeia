import { StoreConfig } from '../data/defaultStoreConfig';

export function generateSingleFileHtml(
  config: StoreConfig,
  defaultTheme: 'dark' | 'light' = 'dark'
): string {
  const cleanWa = config.whatsappNumber.replace(/\D/g, '');
  const wifiQrData =
    config.wifiEncryption === 'nopass' || !config.wifiPassword
      ? `WIFI:T:nopass;S:${encodeURIComponent(config.wifiSsid)};;`
      : `WIFI:T:WPA;S:${encodeURIComponent(config.wifiSsid)};P:${encodeURIComponent(config.wifiPassword)};;`;

  const wifiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${wifiQrData}`;

  const specialtiesHtml = config.specialties
    .map((spec, idx) =>
      idx === config.specialties.length - 1
        ? `<span>${spec}</span>`
        : `<span>${spec}</span><span aria-hidden="true">•</span>`
    )
    .join('\n        ');

  const paymentHtml = config.paymentMethods
    .map((method, idx) =>
      idx === config.paymentMethods.length - 1
        ? `<span>${method}</span>`
        : `<span>${method}</span><span aria-hidden="true">•</span>`
    )
    .join('');

  const serviceTagsHtml = config.serviceTags
    .map((tag, idx) =>
      idx === config.serviceTags.length - 1
        ? `<span>${tag}</span>`
        : `<span>${tag}</span><span aria-hidden="true">·</span>`
    )
    .join(' ');

  const faqsHtml = config.faqs
    .map(
      (faq) => `        <details class="group bg-stone-100 dark:bg-neutral-800/70 border border-stone-200 dark:border-neutral-700/60 rounded-xl p-3.5 transition">
          <summary class="flex items-center justify-between font-semibold text-neutral-900 dark:text-white cursor-pointer list-none">
            <span>${faq.question}</span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-open:rotate-180 transition-transform"></i>
          </summary>
          <p class="text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">${faq.answer}</p>
        </details>`
    )
    .join('\n');

  const toAbsUrl = (u: string) => {
    if (!u) return u;
    if (typeof window !== 'undefined' && u.startsWith('/')) {
      return `${window.location.origin}${u}`;
    }
    return u;
  };

  const resolvedLogoUrl = toAbsUrl(config.logoUrl);
  const categoriesJson = JSON.stringify(
    config.categories.map((c) => ({ ...c, img: toAbsUrl(c.img) })),
    null,
    8
  );
  const productsJson = JSON.stringify(
    config.products.map((p) => ({ ...p, img: toAbsUrl(p.img) })),
    null,
    8
  );

  return `<!DOCTYPE html>
<html lang="pt-BR" class="${defaultTheme === 'dark' ? 'dark ' : ''}scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.storeName} — BioSite & Catálogo</title>
  <meta name="description" content="${config.slogan}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class'
    };
  </script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      width: max-content;
      animation: marquee 18s linear infinite;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-stone-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen pb-28 selection:bg-amber-500 selection:text-black transition-colors duration-200">

  <!-- 1. CONTAINER MOBILE-FIRST -->
  <main class="max-w-md mx-auto bg-white dark:bg-neutral-900/60 min-h-screen border-x border-stone-200 dark:border-neutral-800/80 shadow-2xl overflow-hidden transition-colors duration-200">

    <!-- BARRA SUPERIOR: MODO DIA / NOITE -->
    <div class="flex items-center justify-between px-5 pt-4 pb-2 border-b border-stone-200/70 dark:border-neutral-800/60 bg-stone-50/70 dark:bg-neutral-900/40">
      <div class="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400"></i>
        <span id="store-city">${config.cityState}</span>
      </div>
      <button id="theme-toggle-btn" type="button" onclick="toggleTheme()" aria-label="Alternar modo Dia ou Noite"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-200/80 dark:bg-neutral-800 hover:bg-stone-300/70 dark:hover:bg-neutral-700 border border-stone-300/80 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition cursor-pointer">
        <span id="theme-icon-sun" class="hidden dark:inline-flex items-center gap-1.5">
          <i data-lucide="sun" class="w-3.5 h-3.5 text-amber-400"></i>
          <span>Modo Dia</span>
        </span>
        <span id="theme-icon-moon" class="inline-flex dark:hidden items-center gap-1.5">
          <i data-lucide="moon" class="w-3.5 h-3.5 text-amber-700"></i>
          <span>Modo Noite</span>
        </span>
      </button>
    </div>

    <!-- 2. HEADER DO PERFIL -->
    <header class="relative pt-8 pb-6 px-6 text-center bg-gradient-to-b from-amber-500/15 via-stone-50/40 dark:via-neutral-900/40 to-transparent">
      <div class="relative w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/20">
        <img id="store-logo" src="${resolvedLogoUrl}" alt="Logo ${config.storeName}" referrerpolicy="no-referrer" class="w-full h-full object-cover rounded-full border-2 border-white dark:border-neutral-950" />
      </div>
      <h1 id="store-name" class="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">${config.storeName}</h1>
      <p id="store-slogan" class="text-sm text-neutral-600 dark:text-neutral-300 mt-1">${config.slogan}</p>

      <!-- Especialidades separadas por pontos -->
      <div id="store-specialties" class="flex flex-wrap items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-300/90 mt-3 font-medium">
        ${specialtiesHtml}
      </div>
    </header>

    <!-- 3. FAIXA MARQUEE (TICKER) -->
    <div class="bg-amber-400 text-neutral-950 py-2 overflow-hidden border-y border-amber-300 font-bold text-xs tracking-wider uppercase">
      <div class="animate-marquee flex items-center gap-4">
        <span>${config.marqueePhrase1}</span><span>★</span>
        <span>${config.marqueePhrase2}</span><span>★</span>
        <span>${config.marqueePhrase1}</span><span>★</span>
        <span>${config.marqueePhrase2}</span><span>★</span>
        <span>${config.marqueePhrase1}</span><span>★</span>
        <span>${config.marqueePhrase2}</span><span>★</span>
      </div>
    </div>

    <!-- 4. BLOCO DE LINKS PRINCIPAIS -->
    <section class="p-5 space-y-3" aria-label="Links principais">
      <!-- Card 1 (Destaque Principal): WhatsApp -->
      <a id="link-whatsapp-hero" href="https://wa.me/${cleanWa}?text=${encodeURIComponent(config.whatsappHeroText)}" target="_blank" rel="noopener"
         class="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/50 hover:scale-[1.01] transition">
        <div class="flex items-center gap-3.5">
          <div class="p-2.5 bg-white/15 rounded-xl">
            <i data-lucide="message-circle" class="w-6 h-6"></i>
          </div>
          <div>
            <span class="inline-block text-[10px] font-bold uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full mb-1">Atendimento rápido</span>
            <b class="block text-base leading-tight">Chamar no WhatsApp</b>
            <small class="text-emerald-100 text-xs">${config.whatsappSubtitle}</small>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 opacity-80"></i>
      </a>

      <!-- Card 2: Âncora para #catalogo -->
      <a href="#catalogo" class="flex items-center justify-between p-4 rounded-2xl bg-stone-100 dark:bg-neutral-800/80 hover:bg-stone-200/70 dark:hover:bg-neutral-800 border border-stone-200 dark:border-neutral-700/70 transition">
        <div class="flex items-center gap-3.5">
          <div class="p-2.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          </div>
          <div>
            <b class="block text-sm text-neutral-900 dark:text-white">Ver catálogo</b>
            <small class="text-neutral-600 dark:text-neutral-400 text-xs">${config.catalogSubtitle}</small>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 dark:text-neutral-500"></i>
      </a>

      <!-- Card 3: Link para o Instagram -->
      <a id="link-instagram" href="${config.instagramUrl}" target="_blank" rel="noopener"
         class="flex items-center justify-between p-4 rounded-2xl bg-stone-100 dark:bg-neutral-800/80 hover:bg-stone-200/70 dark:hover:bg-neutral-800 border border-stone-200 dark:border-neutral-700/70 transition">
        <div class="flex items-center gap-3.5">
          <div class="p-2.5 bg-pink-500/15 text-pink-600 dark:text-pink-400 rounded-xl">
            <i data-lucide="instagram" class="w-5 h-5"></i>
          </div>
          <div>
            <b class="block text-sm text-neutral-900 dark:text-white">Siga no Instagram</b>
            <small id="instagram-handle" class="text-neutral-600 dark:text-neutral-400 text-xs">${config.instagramHandle}</small>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 dark:text-neutral-500"></i>
      </a>

      <!-- Card 4 (<details>): Wi-Fi grátis com QR Code automático -->
      <details class="group rounded-2xl bg-stone-100 dark:bg-neutral-800/80 border border-stone-200 dark:border-neutral-700/70 overflow-hidden">
        <summary class="flex items-center justify-between p-4 cursor-pointer list-none">
          <div class="flex items-center gap-3.5">
            <div class="p-2.5 bg-sky-500/15 text-sky-600 dark:text-sky-400 rounded-xl">
              <i data-lucide="wifi" class="w-5 h-5"></i>
            </div>
            <div>
              <b class="block text-sm text-neutral-900 dark:text-white">Wi-Fi grátis</b>
              <small class="text-neutral-600 dark:text-neutral-400 text-xs">Rede: ${config.wifiSsid}</small>
            </div>
          </div>
          <i data-lucide="chevron-down" class="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-open:rotate-180 transition-transform"></i>
        </summary>
        <div class="px-4 pb-4 pt-2 border-t border-stone-200 dark:border-neutral-700/50 text-center space-y-3 bg-stone-50 dark:bg-neutral-900/50">
          <img src="${wifiQrUrl}" alt="QR Code Wi-Fi" class="w-32 h-32 mx-auto rounded-xl p-2 bg-white border border-stone-200 dark:border-transparent" />
          <p class="text-xs text-neutral-600 dark:text-neutral-300">Aponte a <b>câmera</b> de outro celular para o QR Code: ele conecta sozinho.</p>
          <div class="grid grid-cols-2 gap-2 text-left bg-white dark:bg-neutral-800 border border-stone-200 dark:border-transparent p-3 rounded-xl text-xs">
            <div><span class="text-neutral-500 dark:text-neutral-400 block">Rede</span><b class="text-neutral-900 dark:text-white">${config.wifiSsid}</b></div>
            <div><span class="text-neutral-500 dark:text-neutral-400 block">Senha</span><b class="text-emerald-600 dark:text-emerald-400">${config.wifiPassword ? config.wifiPassword : 'Aberta, sem senha'}</b></div>
          </div>
        </div>
      </details>
    </section>

    <!-- 5. CARROSSEL DE CATEGORIAS -->
    <section class="py-4 px-5">
      <h2 class="text-lg font-bold text-neutral-900 dark:text-white">Categorias</h2>
      <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-3">Deslize e conheça tudo o que tem na loja.</p>
      <div id="categories-carousel" class="flex gap-3 overflow-x-auto no-scrollbar pb-2"></div>
    </section>

    <!-- 6. CATÁLOGO INTERATIVO (#catalogo) -->
    <section id="catalogo" class="py-4 px-5 space-y-4">
      <div>
        <h2 class="text-lg font-bold text-neutral-900 dark:text-white">Destaques da loja</h2>
        <p class="text-xs text-neutral-600 dark:text-neutral-400">Escolha os produtos, toque em <b>Adicionar</b> e envie o pedido pelo WhatsApp.</p>
      </div>

      <!-- Barra de Chips de Filtro por Categoria -->
      <div id="category-chips" class="flex gap-2 overflow-x-auto no-scrollbar pb-1"></div>

      <!-- Ordenação e Contador de Produtos -->
      <div class="flex items-center justify-between gap-2">
        <span id="product-count" class="text-xs text-neutral-600 dark:text-neutral-400 tabular-nums">Exibindo produtos</span>
        <select id="sort-select" aria-label="Ordenar produtos" class="bg-stone-100 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 text-xs rounded-xl px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400">
          <option value="rel">Relevância</option>
          <option value="menor">Menor preço</option>
          <option value="maior">Maior preço</option>
        </select>
      </div>

      <!-- Grid de 2 Colunas com Cards de Produto -->
      <div id="products-grid" class="grid grid-cols-2 gap-3"></div>
    </section>

    <!-- 7. CARD DE OFERTA RELÂMPAGO -->
    <section class="mx-5 my-6 p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-50/60 dark:via-neutral-900 to-stone-100 dark:to-neutral-900 border border-amber-500/40 space-y-4">
      <div class="flex items-center justify-between">
        <span class="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-black rounded-full">${config.offerBadge}</span>
        <span class="text-xs text-amber-800 dark:text-amber-300 font-medium">${config.offerStockLabel}</span>
      </div>
      <div>
        <h2 class="text-xl font-extrabold text-neutral-900 dark:text-white">${config.offerTitle}</h2>
        <p class="text-xs text-neutral-700 dark:text-neutral-300">${config.offerDescription} — <b class="text-amber-700 dark:text-amber-400">${config.offerPriceHighlight}</b></p>
      </div>
      <!-- Cronômetro Regressivo Funcional -->
      <div class="grid grid-cols-4 gap-2 text-center tabular-nums">
        <div class="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2"><b id="t-days" class="text-lg text-neutral-900 dark:text-white block">02</b><small class="text-[10px] text-neutral-500 dark:text-neutral-400">dias</small></div>
        <div class="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2"><b id="t-hours" class="text-lg text-neutral-900 dark:text-white block">14</b><small class="text-[10px] text-neutral-500 dark:text-neutral-400">horas</small></div>
        <div class="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2"><b id="t-mins" class="text-lg text-neutral-900 dark:text-white block">35</b><small class="text-[10px] text-neutral-500 dark:text-neutral-400">min</small></div>
        <div class="bg-white/90 dark:bg-neutral-950/80 border border-stone-200 dark:border-neutral-800 rounded-xl p-2"><b id="t-secs" class="text-lg text-amber-600 dark:text-amber-400 block">40</b><small class="text-[10px] text-neutral-500 dark:text-neutral-400">seg</small></div>
      </div>
      <a href="https://wa.me/${cleanWa}?text=${encodeURIComponent(config.offerWhatsappText)}" target="_blank" rel="noopener"
         class="block w-full text-center py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition">
        Garantir minha oferta
      </a>
    </section>

    <!-- 8. CARD DE AVALIAÇÃO NO GOOGLE -->
    <section class="mx-5 my-6 p-5 rounded-2xl bg-stone-100 dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700/70 text-center space-y-2">
      <div class="text-amber-500 dark:text-amber-400 tracking-widest text-lg" aria-label="5 estrelas">★★★★★</div>
      <h3 class="font-bold text-neutral-900 dark:text-white text-sm">Gostou do atendimento?</h3>
      <p class="text-xs text-neutral-600 dark:text-neutral-400"><b class="text-neutral-900 dark:text-white">${config.googleRating}</b> no Google · Sua avaliação ajuda outras pessoas a nos encontrar.</p>
      <a href="${config.googleReviewUrl}" target="_blank" rel="noopener"
         class="inline-block mt-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 text-xs font-semibold text-white transition">
        Avaliar no Google
      </a>
    </section>

    <!-- 9. SEÇÃO SOBRE + FAQ -->
    <section class="px-5 py-4 space-y-4">
      <h2 class="text-lg font-bold text-neutral-900 dark:text-white">Sobre a Loja</h2>
      <p class="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">${config.aboutText}</p>

      <!-- Tags de Produtos/Serviços -->
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-amber-700 dark:text-amber-300/90 pt-1">
        ${serviceTagsHtml}
      </div>

      <h3 class="text-sm font-bold text-neutral-900 dark:text-white pt-2">Perguntas frequentes</h3>
      <div class="space-y-2 text-xs">
${faqsHtml}
      </div>
    </section>

    <!-- 10. ONDE ESTAMOS + PAGAMENTOS -->
    <section class="px-5 py-4 space-y-4">
      <div class="p-4 rounded-2xl bg-stone-100 dark:bg-neutral-800/70 border border-stone-200 dark:border-neutral-700/60 space-y-3">
        <h2 class="text-sm font-bold text-neutral-900 dark:text-white">Onde estamos</h2>
        <p class="text-xs text-neutral-600 dark:text-neutral-300">${config.address}</p>
        <div class="grid grid-cols-2 gap-2">
          <a href="${config.mapsUrl}" target="_blank" rel="noopener" class="py-2.5 text-center rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition">Como chegar</a>
          <a href="tel:${config.phoneTel}" class="py-2.5 text-center rounded-xl bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 text-white font-semibold text-xs transition">Ligar</a>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-stone-100 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 text-center space-y-1">
        <div class="flex flex-wrap justify-center gap-3 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
          ${paymentHtml}
        </div>
        <p class="text-xs text-amber-700 dark:text-amber-400">Parcelamos em até <b>${config.maxInstallments}x</b> no cartão</p>
      </div>
    </section>

    <!-- 11. RODAPÉ -->
    <footer class="px-5 py-8 text-center text-xs text-neutral-500 border-t border-stone-200 dark:border-neutral-800/80 space-y-1.5">
      <b class="text-neutral-800 dark:text-neutral-300 block">${config.storeName}</b>
      <p>${config.address}</p>
      <p>Tel: ${config.phoneDisplay} · ${config.openingHours}</p>
      <p class="pt-2 text-[11px] text-neutral-500">Desenvolvido por <a href="${config.agencyCreditUrl}" class="text-neutral-700 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 underline">${config.agencyCreditName}</a></p>
    </footer>
  </main>

  <!-- BARRA FLUTUANTE DO CARRINHO WHATSAPP -->
  <div id="cart-bar" class="fixed bottom-4 inset-x-4 max-w-md mx-auto bg-emerald-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between hidden z-50 border border-emerald-400/30">
    <div>
      <b id="cart-count" class="text-sm block">0 itens selecionados</b>
      <small id="cart-subtotal" class="text-emerald-100 text-xs">Pronto para enviar o pedido</small>
    </div>
    <button id="send-whatsapp-btn" type="button" class="px-4 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-50 transition">
      Enviar no WhatsApp
    </button>
  </div>

  <!-- SCRIPT DE DADOS, TEMA DIA/NOITE E INTERATIVIDADE COMPLETO -->
  <script>
    const STORE_CONFIG = {
      storeName: ${JSON.stringify(config.storeName)},
      whatsappNumber: ${JSON.stringify(cleanWa)},
      maxInstallments: ${config.maxInstallments},
      categories: ${categoriesJson},
      products: ${productsJson}
    };

    let activeCategory = "todos";
    let cart = [];

    // Alternância Modo Dia / Noite com persistência
    function toggleTheme() {
      const root = document.documentElement;
      const isDark = root.classList.toggle("dark");
      try {
        localStorage.setItem("biosite_theme", isDark ? "dark" : "light");
      } catch (e) {}
    }

    (function initTheme() {
      try {
        const saved = localStorage.getItem("biosite_theme");
        if (saved === "light") {
          document.documentElement.classList.remove("dark");
        } else if (saved === "dark") {
          document.documentElement.classList.add("dark");
        }
      } catch (e) {}
    })();

    function renderCategories() {
      const carousel = document.getElementById("categories-carousel");
      carousel.innerHTML = STORE_CONFIG.categories.map(cat => \`
        <button type="button" onclick="setCategory('\${cat.id}')" class="flex-shrink-0 w-28 rounded-2xl overflow-hidden border \${activeCategory === cat.id ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-stone-200 dark:border-neutral-800'} bg-stone-100 dark:bg-neutral-800/60 text-left transition">
          <img src="\${cat.img}" alt="\${cat.name}" referrerpolicy="no-referrer" class="w-full h-20 object-cover" />
          <div class="p-2 text-xs font-semibold text-neutral-900 dark:text-white truncate">\${cat.name}</div>
        </button>
      \`).join("");

      const chips = document.getElementById("category-chips");
      chips.innerHTML = STORE_CONFIG.categories.map(cat => \`
        <button type="button" onclick="setCategory('\${cat.id}')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition \${activeCategory === cat.id ? 'bg-amber-400 text-neutral-950' : 'bg-stone-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-stone-300 dark:hover:bg-neutral-700'}">
          \${cat.name}
        </button>
      \`).join("");
    }

    function setCategory(id) {
      activeCategory = id;
      renderCategories();
      renderProducts();
    }

    function renderProducts() {
      const sort = document.getElementById("sort-select").value;
      let list = STORE_CONFIG.products.filter(p => activeCategory === "todos" || p.category === activeCategory);

      if (sort === "menor") {
        list.sort((a, b) => (a.price !== null ? a.price : 999999) - (b.price !== null ? b.price : 999999));
      } else if (sort === "maior") {
        list.sort((a, b) => (b.price !== null ? b.price : 0) - (a.price !== null ? a.price : 0));
      }

      document.getElementById("product-count").textContent = \`Exibindo \${list.length} \${list.length === 1 ? 'produto' : 'produtos'}\`;

      const grid = document.getElementById("products-grid");
      grid.innerHTML = list.map(p => {
        const inCart = cart.includes(p.id);
        const inst = p.installments || STORE_CONFIG.maxInstallments || 10;
        const priceHtml = p.price !== null
          ? \`<div class="text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">R$ \${p.price.toFixed(2).replace('.', ',')}</div>
             <small class="text-[10px] text-neutral-500 dark:text-neutral-400 block tabular-nums">ou \${inst}x de R$ \${(p.price / inst).toFixed(2).replace('.', ',')}</small>\`
          : \`<div class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Preço a combinar</div>
             <small class="text-[10px] text-neutral-500 block">Consulte opções no WhatsApp</small>\`;

        return \`
          <article class="rounded-2xl bg-stone-100/90 dark:bg-neutral-800/70 border border-stone-200 dark:border-neutral-700/60 overflow-hidden flex flex-col justify-between">
            <div>
              <img src="\${p.img}" alt="\${p.name}" referrerpolicy="no-referrer" class="w-full h-36 object-cover bg-stone-200 dark:bg-neutral-900" />
              <div class="p-3 space-y-1">
                <b class="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">\${p.name}</b>
                <small class="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 block">\${p.desc}</small>
                <div class="pt-1">\${priceHtml}</div>
              </div>
            </div>
            <div class="p-3 pt-0">
              <button type="button" onclick="toggleCart(\${p.id})" class="w-full py-2.5 rounded-xl text-xs font-bold transition \${inCart ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-neutral-950 hover:bg-amber-300'}">
                \${inCart ? '✓ Adicionado' : '+ Adicionar'}
              </button>
            </div>
          </article>
        \`;
      }).join("");
    }

    function toggleCart(productId) {
      if (cart.includes(productId)) {
        cart = cart.filter(id => id !== productId);
      } else {
        cart.push(productId);
      }
      renderProducts();
      updateCartBar();
    }

    function updateCartBar() {
      const bar = document.getElementById("cart-bar");
      const countEl = document.getElementById("cart-count");
      const subEl = document.getElementById("cart-subtotal");

      if (cart.length === 0) {
        bar.classList.add("hidden");
      } else {
        bar.classList.remove("hidden");
        countEl.textContent = \`\${cart.length} \${cart.length === 1 ? 'item selecionado' : 'itens selecionados'}\`;
        const selectedItems = STORE_CONFIG.products.filter(p => cart.includes(p.id));
        const total = selectedItems.reduce((acc, item) => acc + (item.price || 0), 0);
        subEl.textContent = total > 0
          ? \`Subtotal estimado: R$ \${total.toFixed(2).replace('.', ',')}\`
          : "Pronto para enviar o pedido";
      }
    }

    document.getElementById("send-whatsapp-btn").addEventListener("click", () => {
      const selectedItems = STORE_CONFIG.products.filter(p => cart.includes(p.id));
      if (selectedItems.length === 0) return;

      const lines = selectedItems.map(p =>
        \`• \${p.name} (\${p.price !== null ? 'R$ ' + p.price.toFixed(2).replace('.', ',') : 'Preço a combinar'})\`
      );
      const message = \`Olá, \${STORE_CONFIG.storeName}! Gostaria de fazer um pedido com os seguintes itens do catálogo:\\n\\n\${lines.join("\\n")}\\n\\nPodem confirmar a disponibilidade?\`;
      const url = \`https://wa.me/\${STORE_CONFIG.whatsappNumber}?text=\${encodeURIComponent(message)}\`;
      window.open(url, "_blank", "noopener,noreferrer");
    });

    document.getElementById("sort-select").addEventListener("change", renderProducts);

    function startCountdown() {
      let remainingSeconds = (2 * 86400) + (14 * 3600) + (35 * 60) + 40;
      const daysEl = document.getElementById("t-days");
      const hoursEl = document.getElementById("t-hours");
      const minsEl = document.getElementById("t-mins");
      const secsEl = document.getElementById("t-secs");

      function tick() {
        if (remainingSeconds <= 0) remainingSeconds = 86400;
        const d = Math.floor(remainingSeconds / 86400);
        const h = Math.floor((remainingSeconds % 86400) / 3600);
        const m = Math.floor((remainingSeconds % 3600) / 60);
        const s = remainingSeconds % 60;

        daysEl.textContent = String(d).padStart(2, "0");
        hoursEl.textContent = String(h).padStart(2, "0");
        minsEl.textContent = String(m).padStart(2, "0");
        secsEl.textContent = String(s).padStart(2, "0");
        remainingSeconds--;
      }

      tick();
      setInterval(tick, 1000);
    }

    renderCategories();
    renderProducts();
    startCountdown();
    lucide.createIcons();
  </script>
</body>
</html>`;
}
