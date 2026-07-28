
(() => {
const PRODUCTS = window.TOMYBIKE_PRODUCTS || [];
const CART_KEY = 'tomybike-cart-v3';
const LANG_KEY = 'tomybike-language';

const getLang=()=>localStorage.getItem(LANG_KEY)||'en';
const getCart=()=>{try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch{return[]}};
const saveCart=c=>{localStorage.setItem(CART_KEY,JSON.stringify(c));updateCount();};
const updateCount=()=>document.querySelectorAll('[data-cart-count]').forEach(x=>x.textContent=getCart().length);

function addCart(id){
  const c=getCart(); if(!c.includes(id)) c.push(id); saveCart(c); renderCart(); openCart();
}
function removeCart(id){saveCart(getCart().filter(x=>x!==id));renderCart();}
function openCart(){document.getElementById('globalCart')?.classList.add('open');document.getElementById('globalCartOverlay')?.classList.add('open');}
function closeCart(){document.getElementById('globalCart')?.classList.remove('open');document.getElementById('globalCartOverlay')?.classList.remove('open');}
function renderCart(){
 const lang=getLang(), ids=getCart(), items=ids.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
 const host=document.getElementById('globalCartItems'), total=document.getElementById('globalCartTotal'), wa=document.getElementById('globalCartWa');
 if(!host)return;
 if(!items.length){host.innerHTML=`<p>${lang==='pl'?'Twój koszyk jest pusty.':'Your basket is empty.'}</p>`;total.textContent='£0';wa.href='#';return;}
 host.innerHTML=items.map(p=>`<div class="cart-line"><img src="${p.images[0]}" alt=""><div><b>${p.name}</b><br>£${p.price}</div><button data-remove-cart="${p.id}">${lang==='pl'?'Usuń':'Remove'}</button></div>`).join('');
 total.textContent='£'+items.reduce((s,p)=>s+p.price,0);
 wa.href='https://wa.me/447459620789?text=Hello%2C%20I%20am%20interested%20in%3A%0A'+items.map(p=>`${p.name} - £${p.price}`).join('%0A');
}

function card(p){
 const pl=getLang()==='pl';
 return `<article class="card" data-name="${p.name.toLowerCase()}" data-price="${p.price}" data-size="${p.size}" data-status="${p.status}" data-type="${p.category}">
 <div class="photo"><img alt="${p.name}" src="${p.images[0]}"><span class="status">${pl?'DOSTĘPNY':'AVAILABLE'}</span></div>
 <div class="info"><div class="title-row"><div><b>${p.name}</b><br><small>${pl?p.categoryPl:p.category}</small></div><span class="price">£${p.price}</span></div>
 <div class="specs"><span>${pl?'Typ':'Type'}: ${pl?p.categoryPl:p.category}</span><span>${pl?'Rama':'Frame'}: ${p.frame}</span><span>${pl?'Wzrost':'Height'}: ${p.height}</span><span>${pl?'Koła':'Wheels'}: ${p.wheels}</span><span>${p.feature}</span></div>
 <div class="card-actions"><a class="btn" href="product.html?id=${p.id}">${pl?'ZOBACZ SZCZEGÓŁY':'VIEW DETAILS'}</a><button class="btn outline" data-add-cart="${p.id}">${pl?'DODAJ DO KOSZYKA':'ADD TO BASKET'}</button></div></div></article>`;
}
function renderCards(){
 const grid=document.getElementById('bikeGrid'); if(grid) grid.innerHTML=PRODUCTS.map(card).join('');
}

function renderProduct(){
 const host=document.getElementById('dynamicProduct'); if(!host)return;
 const p=PRODUCTS.find(x=>x.id===new URLSearchParams(location.search).get('id'))||PRODUCTS[0];
 const pl=getLang()==='pl';
 document.title=`${p.name} | TomyBike`;
 host.innerHTML=`
 <main class="wrap">
 <div class="breadcrumbs"><a href="index.html">${pl?'Strona główna':'Home'}</a> &nbsp;›&nbsp; <a href="index.html#bikes">${pl?'Rowery':'Bikes'}</a> &nbsp;›&nbsp; ${p.name}</div>
 <section class="product-top">
 <div class="gallery-card"><div class="main-stage"><img id="mainImage" src="${p.images[0]}" alt="${p.name}"><div class="counter" id="counter">1 / ${p.images.length}</div><div class="zoom-hint">⌕</div><button class="arrow prev" id="prevBtn">‹</button><button class="arrow next" id="nextBtn">›</button></div>
 <div class="thumbs" id="thumbs">${p.images.map((src,i)=>`<button class="thumb ${i===0?'active':''}" data-index="${i}"><img src="${src}" alt=""></button>`).join('')}</div>
 <div class="swipe-note">${pl?'Przesuń miniatury lub kliknij główne zdjęcie, aby je powiększyć':'Swipe thumbnails or click the main image to enlarge'}</div></div>
 <div class="product-info"><div class="eyebrow">${pl?p.eyebrowPl:p.eyebrow}</div><h1>${p.nameUpper}</h1><div class="meta">${pl?p.metaPl:p.meta}</div><div class="stars">★★★★★ &nbsp; <span style="color:#313831;font-weight:600">${pl?'Gotowy do jazdy':'Ready to Ride'}</span></div>
 <div class="price-card"><div class="price-row"><div class="price">£${p.price}</div><div class="good-price">◇ ${pl?'Dobra cena':'Good Price'}</div></div><div class="trust-list"><span>${pl?'Dokładnie sprawdzony przed sprzedażą':'Fully checked before sale'}</span><span>${pl?'Dostawa lokalna do 30 mil':'Local delivery within 30 miles'}</span><span>Swindon / Marlborough</span></div></div>
 <div class="condition-score"><div><div class="overall-label">${pl?'STAN OGÓLNY':'OVERALL CONDITION'}</div><div class="overall">${p.overall}/10</div></div><div><div class="score-line"><span>${pl?'MECHANICZNY':'MECHANICAL'}</span><strong>${p.mechanical}/10</strong><div class="bar"><span style="width:${p.mechanical*10}%"></span></div></div><div class="score-line"><span>${pl?'WIZUALNY':'COSMETIC'}</span><strong>${p.cosmetic}/10</strong><div class="bar"><span style="width:${p.cosmetic*10}%"></span></div></div></div></div>
 <div class="actions"><button class="btn" data-add-cart="${p.id}">🛒 ${pl?'Dodaj do koszyka':'Add to Basket'}</button><a class="btn whatsapp" href="https://wa.me/447459620789?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.name)}">WhatsApp</a><a class="btn call" href="tel:+447459620789">${pl?'Zadzwoń':'Call'}</a><a class="btn view" href="mailto:tomcioszczesniakpriv@gmail.com?subject=${encodeURIComponent(p.name)}">${pl?'Umów oględziny':'Book a Viewing'}</a></div></div></section>
 <section class="content-grid"><article class="panel"><h2>${pl?'STAN':'CONDITION'}</h2><p>${pl?p.conditionPl:p.condition}</p></article><article class="panel"><h2>${pl?'SPECYFIKACJA':'SPECIFICATION'}</h2><table class="spec">${p.specs.map(r=>`<tr><td>${pl?r[1]:r[0]}</td><td>${r[2]}</td></tr>`).join('')}</table></article><article class="panel"><h2>${pl?'DLACZEGO WARTO KUPIĆ W TOMYBIKE?':'WHY BUY FROM TOMYBIKE?'}</h2><ul class="check-list"><li>${pl?'Rowery sprawdzone przed sprzedażą':'Bikes checked before sale'}</li><li>${pl?'Uczciwe opisy i prawdziwe zdjęcia':'Honest descriptions and real photos'}</li><li>${pl?'Odbiór lokalny lub dostawa':'Local collection or delivery'}</li></ul></article></section>
 <section class="delivery-grid"><div class="delivery-box"><h3>${pl?'ODBIÓR':'COLLECTION'}</h3><p>Swindon</p><p>Marlborough</p></div><div class="delivery-box"><h3>${pl?'DOSTAWA':'DELIVERY'}</h3><p>${pl?'Dostawa lokalna do 30 mil.':'Local delivery within 30 miles.'}</p></div><div class="delivery-box"><h3>${pl?'PŁATNOŚĆ':'PAYMENT'}</h3><p>${pl?'Gotówka przy odbiorze lub przelew bankowy.':'Cash on collection or bank transfer.'}</p></div></section></main>`;
 let i=0, main=document.getElementById('mainImage'), thumbs=[...document.querySelectorAll('.thumb')], counter=document.getElementById('counter');
 const show=n=>{i=(n+p.images.length)%p.images.length;main.src=p.images[i];counter.textContent=`${i+1} / ${p.images.length}`;thumbs.forEach((x,k)=>x.classList.toggle('active',k===i));};
 thumbs.forEach((x,k)=>x.onclick=()=>show(k));document.getElementById('prevBtn').onclick=()=>show(i-1);document.getElementById('nextBtn').onclick=()=>show(i+1);
}

document.addEventListener('click',e=>{
 const add=e.target.closest('[data-add-cart]'); if(add)addCart(add.dataset.addCart);
 const rem=e.target.closest('[data-remove-cart]'); if(rem)removeCart(rem.dataset.removeCart);
 if(e.target.closest('[data-open-cart]'))openCart();
 if(e.target.closest('[data-close-cart]'))closeCart();
});
document.addEventListener('DOMContentLoaded',()=>{
 renderCards();renderProduct();renderCart();updateCount();
 document.querySelectorAll('#languageSelect,#productLanguageSelect').forEach(s=>s.addEventListener('change',()=>{localStorage.setItem(LANG_KEY,s.value);location.reload();}));
});
})();
