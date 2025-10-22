let products = [];
async function loadProducts() {
  try {
    const res = await fetch('./data/products.json');
    const data = await res.json();
    products = data;
    initSearch();
    router();
  } catch (err) {
    console.error('error can not call json', err);
  }
}
// Khởi tạo tìm kiếm sau khi products load xong
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");

  // Khi gõ input
  searchInput.addEventListener("input", function() {
      const query = this.value.toLowerCase();
      if (!query) {
          searchSuggestions.innerHTML = "";
          return;
      }

      const matchedProducts = products.filter(p =>
          p.name.toLowerCase().includes(query)
      ).slice(0, 5);

      searchSuggestions.innerHTML = matchedProducts.map(p => `
          <div data-id="${p.id}">${p.name}</div>
      `).join('');

      searchSuggestions.querySelectorAll("div").forEach(item => {
          item.addEventListener("click", () => {
              navigate(`#product/${item.dataset.id}`);
              searchSuggestions.innerHTML = "";
              searchInput.value = item.textContent;
          });
      });
  });

  // Nhấn Enter
  searchInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
          const query = this.value.toLowerCase();
          const matchedProducts = products.filter(p =>
              p.name.toLowerCase().includes(query)
          );
          if (matchedProducts.length > 0) {
              navigate(`#product/${matchedProducts[0].id}`);
              searchSuggestions.innerHTML = "";
          }
      }
  });
  // Click ngoài dropdown → ẩn
  document.addEventListener("click", function(e) {
      if (!searchSuggestions.contains(e.target) && e.target !== searchInput) {
          searchSuggestions.innerHTML = "";
      }
  });
}
// ----- Render home-----
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  // get home content not value
  let homeContent = document.getElementById('home-content');
  if (!homeContent) {
    homeContent = document.createElement('div');
    homeContent.id = 'home-content';
    app.appendChild(homeContent);
  }
  // add slideshow
  homeContent.innerHTML = `
    <div class="slideshow">
      <div class="slide active">
        <img src="./img/img_logo_backgruond/background_top1 (1).jpg" alt="background_top1">
      </div>
      <div class="slide">
        <img src="./img/img_logo_backgruond/background_top1 (1).webp" alt="background_top1">
      </div>
      <div class="slide">
        <video src="./img/img_logo_backgruond/backgruond_video.mp4" muted playsinline></video>
      </div>
    </div>
  `;
  // Slideshow JS
  const slides = homeContent.querySelectorAll(".slide");
  let slideIndex = 0;
  function showSlide(index) {
    if (!slides.length) return; // check if slides exist
    slides.forEach((s) => {
      s.classList.remove("active");
      const v = s.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
    const current = slides[index];
    current.classList.add("active");
    const video = current.querySelector("video");
    if (video) {
      video.play();
      video.onended = nextSlide;
    } else {
      setTimeout(nextSlide, 5000);
    }
  }
function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

showSlide(slideIndex);
  // ----- Render sản phẩm-----
  const categories = [...new Set(products.map(p => p.category))]; // không filter
  categories.forEach(cat => {
    const catDivId = `home-${cat}`;
    homeContent.insertAdjacentHTML('beforeend', `
      <h2 class="app-color">${cat}</h2>
      <div class="product-list" id="${catDivId}"></div>
    `);
    renderProductsToHome(cat, catDivId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// -----render products to home 10 product -----
function renderProductsToHome(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = products
    .filter(p => p.category === category)
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

  container.innerHTML = list.map(p => {
    // Nếu là sản phẩm bình thường
    if(p.price){
      return `
        <div class="product-card" onclick="showDetail(${p.id})">
          <img src="${p.img}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.price.toLocaleString()} 円</p>
        </div>
      `;
    }
    // Nếu là tin tức (không có price)
    else {
      return `
        <div class="product-card" onclick="navigate('#news/${p.id}')">
          <img src="${p.img}" alt="${p.name}">
          <h3>${p.name}</h3>
        </div>
      `;
    }
  }).join('');
}
// ----- Render products list -----
function renderProducts() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
    if (cat === '情報') return;

    const catDivId = `products-${cat}`;
    app.insertAdjacentHTML('beforeend', `
      <h2 class="app-color">${cat}</h2>
      <div id="${catDivId}" class="product-list"></div>
    `);

    const container = document.getElementById(catDivId);
    const list = products
      .filter(p => p.category === cat)
      .sort((a,b) => b.id - a.id);

    container.innerHTML = list.map(p => `
      <div class="product-card" onclick="showDetail(${p.id})">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.price.toLocaleString()} 円</p>
      </div>
    `).join('');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ----- show detail product -----
function showDetail(id) {
  const app = document.getElementById('app');
  const p = products.find(x => x.id == id);
  if (!p) {
    app.innerHTML = '<h1>商品が見つかりません</h1>';
    return;
  }
  app.innerHTML = `
  <div class="product-detail">
    <img class="product-img" src="${p.img}" alt="${p.name}">
    <div class="product-info">
      <h2>${p.name}</h2>
      <p class="price"> <span>値段：</span>${p.price} 円</p>
      <p class="model"> <span>モデル :</span> ${p.model} </p>
      <p class="color"> <span>色 :</span> ${p.color}  </p>
      <p class="size"> <span>サイズ :</span> ${p.size}  </p>
      <p class="weight"> <span>重量 :</span> ${p.weight}  </p>
      <p class="material"> <span>材質 :</span> ${p.material}  </p>
      <p class="brand"> <span>ブランド :</span> ${p.brand}  </p>
      <div class="button-group">
       <button class="buy-btn" onclick="alert('カートに追加!')"> 🛒 カートに追加 </button>
       <button class="buy-btn" onclick="window.open('${p.link}', '_blank')"> 購入ページへ </button>
      </div>
      <p class="desc"><span>説明 :</span> ${p.desc}  </p>
      <p class="usage"><span>使用法 :</span> ${p.usage}  </p>
      <button class="back-btn" onclick="renderHome()"> ← 戻る </button>
    </div>
  </div>
`;
window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----- other pages -----
function renderReturns() {
  document.getElementById('app').innerHTML = `
     <div class="returns-policy">
      <h1>返品・交換ポリシー</h1>

      <p>
        NamvuFishingでは、お客様に安心してご購入いただけるよう、以下の条件で返品・交換を承っております。
      </p>

      <h2>🎣 1. 返品・交換の対象</h2>
      <ul>
        <li>商品到着後 <strong>7日以内</strong> にご連絡いただいた場合。</li>
        <li>未使用・未開封の商品に限ります。</li>
        <li>商品の破損や不良、発送ミスによる場合は、送料は当店負担です。</li>
        <li>お客様のご都合による返品・交換の場合、送料はお客様負担となります。</li>
      </ul>

      <h2>📦 2. 返品・交換の手順</h2>
      <ol>
        <li>メールまたはお問い合わせフォームにてご連絡ください。</li>
        <li>担当者より返品方法をご案内いたします。</li>
        <li>返品確認後、交換または返金を行います。</li>
      </ol>

      <h2>❗ 3. 返品・交換をお受けできない場合</h2>
      <ul>
        <li>商品到着後8日以上経過したもの。</li>
        <li>使用済み、またはお客様により破損した商品。</li>
        <li>セール品や特別割引品。</li>
      </ul>

      <h2>📞 4. お問い合わせ</h2>
      <p>
        返品・交換に関するご質問は、以下までご連絡ください。<br>
        メール: support@namvufishing.jp<br>
        電話: 0120-123-456（平日 9:00〜18:00）
      </p>

      <button class="back-btn" onclick="renderHome()">← ホームに戻る</button>
    </div>
  `;
}

function renderNews() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const newsItems = products.filter(p => p.category === '情報');

  app.insertAdjacentHTML('beforeend', `
    <section class="news-section">
      <h1>🎣 ニュース・釣りの豆知識</h1>
      <div class="news-grid">
        ${newsItems.map(n => `
          <div class="news-card" onclick="navigate('#news/${n.id}')">
            <img src="${n.img}" alt="${n.name}">
            <h3>${n.name}</h3>
            <p>${n.desc}</p>
          </div>
        `).join('')}
      </div>
      <button class="back-btn" onclick="renderHome()">← ホームに戻る</button>
    </section>
  `);
}
function renderNewsDetail(id) {
  const app = document.getElementById('app');
  const n = products.find(p => p.id === id && p.category === '情報');
  if(!n){
    app.innerHTML = '<h1>記事が見つかりません</h1>';
    return;
  }

  app.innerHTML = `
    <section class="news-detail">
      <div class="news-img-container"><img src="${n.img}" alt="${n.name}" class="news-img"></div>
      <div class="news-content">
        <h1>${n.name}</h1>
        <p class="short-desc">${n.desc}</p>
        <p class="full-desc">${n.desc2 ? n.desc2 : ''}</p>
        ${n.usage ? `<p class="usage"><strong>使用法:</strong> ${n.usage}</p>` : ''}
        <div class="button-group">
          <button class="back-btn" onclick="renderNews()">← ニュース一覧に戻る</button>
          <button class="back-btn" onclick="renderHome()">← ホームに戻る</button>
        </div>
      </div>
    </section>
  `;
}

function renderContact() {
  document.getElementById('app').innerHTML = `
   <section class="contact-section">
      <h1>📍 お問い合わせ</h1>

      <!-- Phần thông tin shop -->
      <div class="contact-details-top">
        <h2>NamvuFishing ショップ情報</h2>
        <ul>
          <li><strong>🏠 住所:</strong> 東京都千代田区1-2-3 Fishing通り</li>
          <li><strong>📞 電話番号:</strong> 090-1234-5678</li>
          <li><strong>💬 LINE:</strong> @namvufishing</li>
          <li><strong>📧 メール:</strong> contact@namvufishing.jp</li>
          <li><strong>📘 Facebook:</strong> <a href="https://facebook.com/namvufishing" target="_blank">facebook.com/namvufishing</a></li>
        </ul>
      </div>

      <div class="contact-body">
        <div class="contact-map">
          <iframe
            src="https://www.google.com/maps?q=tokyo+station&output=embed"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div class="contact-form">
          <h2>💡 お問い合わせフォーム</h2>
          <p>ご質問やご相談がありましたら、お気軽にご連絡ください。</p>
          <form>
            <input type="text" placeholder="お名前 " required>
            <input type="email" placeholder="メールアドレス" required>
            <textarea placeholder="メッセージ" required></textarea>
            <button class="btn-send" type="submit">送信</button>
          </form>
        </div>
      </div>

      <button class="back-btn" onclick="renderHome()">← ホームに戻る</button>
    </section>
  `;
}

// ----- Router -----
function router() {
  const hash = location.hash || '#home';

  if (hash === '#home') renderHome();
  else if (hash === '#products') renderProducts();
  else if (hash.startsWith('#product/')) {
    const id = hash.split('/')[1];
    showDetail(id);
  }
  else if (hash === '#news') renderNews();
  else if (hash.startsWith('#news/')) {
    const id = Number(hash.split('/')[1]);
    renderNewsDetail(id);
  }
  else if (hash === '#contact') renderContact();
  else if (hash === '#returns') renderReturns();
  else document.getElementById('app').innerHTML = '<h1>404 - ページが見つかりません</h1>';
}
// ----- Navigate helper -----
function navigate(hash) { location.hash = hash; }
// ----- Start -----
window.addEventListener('DOMContentLoaded', loadProducts);
window.addEventListener('hashchange', router);
