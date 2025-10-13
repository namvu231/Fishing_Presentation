
let products = [];

// ----- Load  JSON -----
async function loadProducts() {
  try {
    const res = await fetch('./data/products.json');
    const data = await res.json();
    products = data; 
    router();
  } catch (err) {
    console.error('Lỗi load JSON:', err);
  }
}

// ----- Render trang chủ -----
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Tạo home content nếu chưa có
  let homeContent = document.getElementById('home-content');
  if (!homeContent) {
    homeContent = document.createElement('div');
    homeContent.id = 'home-content';
    app.appendChild(homeContent);
  }

  // Thêm slideshow
  homeContent.innerHTML = `
    <div class="slideshow">
      <div class="slide active">
        <img src="./img/img_logo_backgruond/background_top1 (1).jpg" alt="Ảnh 1">
      </div>
      <div class="slide">
        <img src="./img/img_logo_backgruond/background_top1 (1).webp" alt="Ảnh 2">
      </div>
      <div class="slide">
        <video src="./img/img_logo_backgruond/backgruond_video.mp4" muted playsinline></video>
      </div>
    </div>
  `;

  // Slideshow JS
  let slideIndex = 0;
  const slides = homeContent.querySelectorAll(".slide");

  function showSlide(index) {
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

  // Render sản phẩm theo category (chỉ 1 lần, không lặp thừa)
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const catDivId = `home-${cat}`;
    homeContent.insertAdjacentHTML('beforeend', `
      <h2 class="app-color">${cat}</h2>
      <div class="product-list" id="${catDivId}"></div>
    `);
    renderProductsToHome(cat, catDivId);
  });
}

// ----- Render 10 sản phẩm mới nhất cho home -----
function renderProductsToHome(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = products
    .filter(p => p.category === category)
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);
  container.innerHTML = list.map(p => `
    <div class="product-card" onclick="showDetail(${p.id})">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()} đ</p>
    </div>
  `).join('');
}

// ----- Render trang danh sách sản phẩm -----
function renderProducts() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
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
        <p>${p.price.toLocaleString()} đ</p>
      </div>
    `).join('');
  });
}

// ----- Hiển thị chi tiết sản phẩm -----
function showDetail(id) {
  const app = document.getElementById('app');
  const p = products.find(x => x.id == id);
  if (!p) {
    app.innerHTML = '<h1>Không tìm thấy sản phẩm</h1>';
    return;
  }
  app.innerHTML = `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p>${p.desc}</p>
      <p>${p.price.toLocaleString()} đ</p>
    </div>
    <button onclick="renderHome()">← Quay lại</button>
  `;
}

// ----- Trang khác -----
function renderReturns() {
  document.getElementById('app').innerHTML = `
    <h1>Đổi trả</h1>
    <p>Thông tin về chính sách đổi trả hàng.</p>
  `;
}

function renderNews() {
  document.getElementById('app').innerHTML = `
    <h1>Tin tức</h1>
    <p>Thông tin và kinh nghiệm câu cá mới nhất.</p>
  `;
}

function renderContact() {
  document.getElementById('app').innerHTML = `
    <h1>Liên hệ</h1>
    <form>
      <input type="text" placeholder="Tên"><br>
      <input type="email" placeholder="Email"><br>
      <textarea placeholder="Nội dung"></textarea><br>
      <button type="submit">Gửi</button>
    </form>
  `;
}

// ----- Router -----
function router() {
  const hash = location.hash || '#home';
  if (hash === '#home') renderHome();
  else if (hash === '#products') renderProducts();
  else if (hash.startsWith('#product/')) {
    const id = hash.split('/')[1];
    showDetail(id); // dùng showDetail thay renderProductDetail
  }
  else if (hash === '#news') renderNews();
  else if (hash === '#returns') renderReturns();
  else if (hash === '#contact') renderContact();
  else document.getElementById('app').innerHTML = '<h1>404 - Không tìm thấy trang</h1>';
}

// ----- Navigate helper -----
function navigate(hash) { location.hash = hash; }

// ----- Slideshow -----
let slideIndex = 0;
let slides = [];
document.addEventListener("DOMContentLoaded", () => {
  slides = document.querySelectorAll(".slide");
  showSlide(slideIndex);
});

function showSlide(index) {
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
    setTimeout(nextSlide, 3000);
  }
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

// ----- Start -----
window.addEventListener('DOMContentLoaded', loadProducts);
window.addEventListener('hashchange', router);
