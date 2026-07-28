(() => {
  const PRODUCTS = window.TOMYBIKE_PRODUCTS || [];
  const CART_KEY = "tomybike-cart-v2";
  const LANG_KEY = "tomybike-language";

  const t = {
    en: {
      available:"AVAILABLE", reserved:"RESERVED", sold:"SOLD", unavailable:"UNAVAILABLE",
      view:"VIEW DETAILS", add:"ADD TO BASKET", remove:"Remove", basket:"Basket", total:"Total",
      empty:"Your basket is empty.", whatsapp:"Continue on WhatsApp", home:"Home", bikes:"Bikes",
      ebikes:"E-Bikes", about:"About", contact:"Contact", addDone:"Added to basket",
      mechanical:"MECHANICAL", cosmetic:"COSMETIC", condition:"CONDITION",
      specification:"SPECIFICATION", collection:"COLLECTION", delivery:"DELIVERY", payment:"PAYMENT",
      noProduct:"Product not found", back:"Back to bikes", menu:"Menu"
    },
    pl: {
      available:"DOSTĘPNY", reserved:"ZAREZERWOWANY", sold:"SPRZEDANY", unavailable:"NIEDOSTĘPNY",
      view:"ZOBACZ SZCZEGÓŁY", add:"DODAJ DO KOSZYKA", remove:"Usuń", basket:"Koszyk", total:"Razem",
      empty:"Twój koszyk jest pusty.", whatsapp:"Kontynuuj na WhatsApp", home:"Strona główna", bikes:"Rowery",
      ebikes:"Rowery elektryczne", about:"O nas", contact:"Kontakt", addDone:"Dodano do koszyka",
      mechanical:"MECHANICZNY", cosmetic:"WIZUALNY", condition:"STAN",
      specification:"SPECYFIKACJA", collection:"ODBIÓR", delivery:"DOSTAWA", payment:"PŁATNOŚĆ",
      noProduct:"Nie znaleziono produktu", back:"Wróć do rowerów", menu:"Menu"
    }
  };

  function lang() { return localStorage.getItem(LANG_KEY) || "en"; }
  function setLang(value) {
    localStorage.setItem(LANG_KEY, value);
    document.documentElement.lang = value;
    document.querySelectorAll("[data-lang-select]").forEach(el => el.value = value);
    renderAll();
  }

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }
  function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product || product.status !== "available") return;
    const cart = getCart();
    if (!cart.includes(id)) cart.push(id);
    saveCart(cart);
    renderCart();
    openPanel("cartPanel");
  }
  function removeFromCart(id) {
    saveCart(getCart().filter(x => x !== id));
    renderCart();
  }
  function updateCartCount() {
    const count = getCart().length;
    document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
  }

  function openPanel(id) {
    document.getElementById(id)?.classList.add("open");
    document.getElementById("siteOverlay")?.classList.add("open");
  }
  function closePanels() {
    document.querySelectorAll(".site-panel").forEach(el => el.classList.remove("open"));
    document.getElementById("siteOverlay")?.classList.remove("open");
  }

  function statusLabel(status) { return t[lang()][status] || status; }
  function money(value) { return `£${value}`; }

  function renderCart() {
    const list = document.getElementById("cartItems");
    const total = document.getElementById("cartTotal");
    const wa = document.getElementById("cartWhatsApp");
    if (!list || !total || !wa) return;
    const ids = getCart();
    const items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    if (!items.length) {
      list.innerHTML = `<p class="cart-empty">${t[lang()].empty}</p>`;
      total.textContent = "£0";
      wa.href = "#";
      return;
    }
    list.innerHTML = items.map(p => `
      <div class="cart-row">
        <img src="${p.images[0]}" alt="">
        <div><a href="product.html?id=${p.id}"><strong>${p.name}</strong></a><div>${money(p.price)}</div></div>
        <button type="button" data-remove-cart="${p.id}">${t[lang()].remove}</button>
      </div>`).join("");
    total.textContent = money(items.reduce((s,p)=>s+p.price,0));
    const msg = items.map(p => `${p.name} - ${money(p.price)}`).join("%0A");
    wa.href = "https://wa.me/447459620789?text=Hello%2C%20I%20am%20interested%20in%3A%0A" + msg;
  }

  function cardHTML(p) {
    const disabled = p.status !== "available";
    return `
      <article class="card" data-name="${p.name.toLowerCase()}" data-price="${p.price}" data-size="${p.size}" data-status="${p.status}" data-type="${p.category}">
        <div class="photo"><img alt="${p.name}" src="${p.images[0]}"><span class="status status-${p.status}">${statusLabel(p.status)}</span></div>
        <div class="info">
          <div class="title-row"><div><b>${p.name}</b><br><small>${lang()==="pl"?p.typePl:p.typeEn}</small></div><span class="price">${money(p.price)}</span></div>
          <div class="specs">
            <span>${lang()==="pl"?"Rama":"Frame"}: ${p.sizeLabel}</span>
            <span>${lang()==="pl"?"Wzrost":"Height"}: ${lang()==="pl"?p.heightPl:p.heightEn}</span>
            <span>${lang()==="pl"?"Koła":"Wheels"}: ${p.wheel}</span>
          </div>
          <div class="card-actions">
            <a class="btn" href="product.html?id=${p.id}">${t[lang()].view}</a>
            <button class="btn outline" data-add-cart="${p.id}" ${disabled?"disabled":""}>${t[lang()].add}</button>
          </div>
        </div>
      </article>`;
  }

  function renderHomeProducts() {
    const grid = document.getElementById("bikeGrid");
    if (!grid) return;
    grid.innerHTML = PRODUCTS.filter(p => p.status !== "hidden").map(cardHTML).join("");
  }

  function renderProduct() {
    const host = document.getElementById("dynamicProduct");
    if (!host) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) {
      host.innerHTML = `<div class="wrap"><h1>${t[lang()].noProduct}</h1><a class="btn" href="index.html#bikes">${t[lang()].back}</a></div>`;
      return;
    }
    document.title = `${p.name} | My Bike`;
    host.innerHTML = `
      <main class="wrap">
        <div class="breadcrumbs"><a href="index.html">${t[lang()].home}</a> › <a href="index.html#bikes">${t[lang()].bikes}</a> › ${p.name}</div>
        <section class="product-top">
          <div class="gallery-card">
            <div class="main-stage">
              <img id="mainImage" src="${p.images[0]}" alt="${p.name}">
              <div class="counter" id="counter">1 / ${p.images.length}</div>
              <button class="arrow prev" id="prevBtn">‹</button><button class="arrow next" id="nextBtn">›</button>
            </div>
            <div class="thumbs" id="thumbs">${p.images.map((src,i)=>`<button class="thumb ${i===0?"active":""}" data-index="${i}"><img src="${src}" alt=""></button>`).join("")}</div>
          </div>
          <div class="product-info">
            <div class="eyebrow">${lang()==="pl"?p.typePl.toUpperCase():p.typeEn.toUpperCase()}</div>
            <h1>${p.name}</h1>
            <div class="meta">${lang()==="pl"?p.metaPl:p.metaEn}</div>
            <div class="price-card">
              <div class="price-row"><div class="price">${money(p.price)}</div><div class="good-price">${statusLabel(p.status)}</div></div>
              <div class="trust-list"><span>${lang()==="pl"?"Dokładnie sprawdzony przed sprzedażą":"Fully checked before sale"}</span><span>${lang()==="pl"?"Dostawa lokalna do 30 mil":"Local delivery within 30 miles"}</span><span>Swindon / Marlborough</span></div>
            </div>
            <div class="condition-score">
              <div><div class="overall-label">${lang()==="pl"?"STAN OGÓLNY":"OVERALL CONDITION"}</div><div class="overall">${p.overall}/10</div></div>
              <div>
                <div class="score-line"><span>${t[lang()].mechanical}</span><strong>${p.mechanical}/10</strong><div class="bar"><span style="width:${p.mechanical*10}%"></span></div></div>
                <div class="score-line"><span>${t[lang()].cosmetic}</span><strong>${p.cosmetic}/10</strong><div class="bar"><span style="width:${p.cosmetic*10}%"></span></div></div>
              </div>
            </div>
            <div class="actions">
              <button class="btn add-cart-main" data-add-cart="${p.id}" ${p.status!=="available"?"disabled":""}>🛒 ${t[lang()].add}</button>
              <a class="btn whatsapp" href="https://wa.me/447459620789?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.name)}">WhatsApp</a>
              <a class="btn call" href="tel:+447459620789">${lang()==="pl"?"Zadzwoń":"Call"}</a>
              <a class="btn view" href="mailto:tomcioszczesniakpriv@gmail.com?subject=${encodeURIComponent(p.name)}">${lang()==="pl"?"Umów oględziny":"Book a Viewing"}</a>
            </div>
          </div>
        </section>

        <section class="content-grid">
          <article class="panel"><h2>${t[lang()].condition}</h2><p>${lang()==="pl"?p.conditionPl:p.conditionEn}</p></article>
          <article class="panel"><h2>${t[lang()].specification}</h2><table class="spec">${p.specs.map(row=>`<tr><td>${lang()==="pl"?row[1]:row[0]}</td><td>${row[2]}</td></tr>`).join("")}</table></article>
          <article class="panel"><h2>${lang()==="pl"?"DLACZEGO WARTO KUPIĆ W TOMYBIKE?":"WHY BUY FROM TOMYBIKE?"}</h2><ul class="check-list"><li>${lang()==="pl"?"Rowery sprawdzone przed sprzedażą":"Bikes checked before sale"}</li><li>${lang()==="pl"?"Uczciwe opisy i prawdziwe zdjęcia":"Honest descriptions and real photos"}</li><li>${lang()==="pl"?"Lokalny odbiór lub dostawa":"Local collection or delivery"}</li></ul></article>
        </section>

        <section class="delivery-grid">
          <div class="delivery-box"><h3>${t[lang()].collection}</h3><p>Swindon</p><p>Marlborough</p></div>
          <div class="delivery-box"><h3>${t[lang()].delivery}</h3><p>${lang()==="pl"?"Dostawa lokalna do 30 mil.":"Local delivery within 30 miles."}</p></div>
          <div class="delivery-box"><h3>${t[lang()].payment}</h3><p>${lang()==="pl"?"Gotówka przy odbiorze lub przelew bankowy.":"Cash on collection or bank transfer."}</p></div>
        </section>
      </main>`;

    let current = 0;
    const main = document.getElementById("mainImage");
    const thumbs = [...document.querySelectorAll(".thumb")];
    const counter = document.getElementById("counter");
    function show(i){
      current=(i+p.images.length)%p.images.length;
      main.src=p.images[current];
      counter.textContent=`${current+1} / ${p.images.length}`;
      thumbs.forEach((x,n)=>x.classList.toggle("active",n===current));
    }
    thumbs.forEach((x,i)=>x.addEventListener("click",()=>show(i)));
    document.getElementById("prevBtn")?.addEventListener("click",()=>show(current-1));
    document.getElementById("nextBtn")?.addEventListener("click",()=>show(current+1));
  }

  function renderChrome() {
    document.querySelectorAll("[data-menu-label]").forEach(el => el.textContent = t[lang()].menu);
    const labels = {
      home:t[lang()].home,bikes:t[lang()].bikes,ebikes:t[lang()].ebikes,about:t[lang()].about,contact:t[lang()].contact,
      basket:t[lang()].basket,total:t[lang()].total,whatsapp:t[lang()].whatsapp
    };
    Object.entries(labels).forEach(([key,value]) => document.querySelectorAll(`[data-i18n-simple="${key}"]`).forEach(el=>el.textContent=value));
  }

  function renderAll() {
    renderChrome();
    renderHomeProducts();
    renderProduct();
    renderCart();
    updateCartCount();
  }

  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add-cart]");
    if (add) addToCart(add.dataset.addCart);
    const remove = e.target.closest("[data-remove-cart]");
    if (remove) removeFromCart(remove.dataset.removeCart);
    if (e.target.closest("[data-open-menu]")) openPanel("menuPanel");
    if (e.target.closest("[data-open-cart]")) { renderCart(); openPanel("cartPanel"); }
    if (e.target.closest("[data-close-panels]")) closePanels();
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-lang-select]").forEach(el => {
      el.value = lang();
      el.addEventListener("change", () => setLang(el.value));
    });
    renderAll();
  });
})();
