const productGrid = document.querySelector("#product-grid");
const socialContainer = document.querySelector("#social-links");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

products.forEach((product) => {
  const card = document.createElement("article");
  card.className = "product-card";

  const visual = product.image
    ? `<img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">`
    : `<div class="product-image">Thêm ảnh sản phẩm<br>trong content.js</div>`;

  card.innerHTML = `
    ${visual}
    <div class="product-card-body">
      <h3>${product.name}</h3>
      <div class="product-meta">${product.description}</div>
      <div class="product-bottom">
        <span class="product-price">${product.price}</span>
        <a class="product-link" href="${product.link}">Xem mẫu</a>
      </div>
    </div>
  `;
  productGrid.appendChild(card);
});

socialLinks.forEach((item) => {
  const link = document.createElement("a");
  link.className = "social-link";
  link.href = item.url;
  link.textContent = item.name;
  if (item.url !== "#") {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  socialContainer.appendChild(link);
});

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

document.querySelector("#year").textContent = new Date().getFullYear();
