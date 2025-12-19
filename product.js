const products = {
  1: {
    id: 1,
    name: "Cryscult T-Shirt",
    images: ["images/cryscult t-shirtfront.png", "images/crys t-shirt1back.png"], 
    price: 30,
    description: "Classic t-shirt with premium quality print. Made from 100% cotton for maximum comfort."
  }
  
};

function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function displayProductDetails() {
  const productId = getProductIdFromUrl();
  const product = products[productId];
  
  if (!product) {
    window.location.href = 'index.html';
    return;
  }
  
  document.title = `CRYS | ${product.name}`;
  
  const productDetailsContainer = document.querySelector('.product-details');
  
  // Build carousel with both images
  const carouselImages = product.images.map(img => 
    `<img src="${img}" alt="${product.name}">`
  ).join('');

  productDetailsContainer.innerHTML = `
    <div class="product-gallery">
      <div class="carousel" id="productCarousel">
        ${carouselImages}
      </div>
      <button class="carousel-btn prev-btn" id="prevBtn">‹</button>
      <button class="carousel-btn next-btn" id="nextBtn">›</button>
    </div>

    <div class="product-info">
      <h1>${product.name}</h1>
      <span class="product-price">₼${product.price.toFixed(2)}</span>
      <p class="product-description">${product.description}</p>
      
      <div class="size-options">
        <h3>Select Size</h3>
        <div class="size-buttons">
          <button class="size-btn" data-size="S">S</button>
          <button class="size-btn" data-size="M">M</button>
          <button class="size-btn" data-size="L">L</button>
          <button class="size-btn" data-size="XL">XL</button>
        </div>
      </div>
      
      <button class="btn btn-primary proceed-to-options" disabled>Proceed to Options</button>
      <a href="index.html" class="back-to-shop">← Back to Shop</a>
    </div>
  `;

  // === Carousel Logic (Swipe + Arrows + Touch Support) ===
  const carousel = document.getElementById('productCarousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;
  const totalImages = product.images.length;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalImages - 1;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < totalImages - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  carousel.parentElement.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.parentElement.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextBtn.click(); // swipe left → next
    if (touchEndX - touchStartX > 50) prevBtn.click(); // swipe right → prev
  }, { passive: true });

  // === Size Selection ===
  const sizeButtons = document.querySelectorAll('.size-btn');
  let selectedSize = null;

  sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
      sizeButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selectedSize = button.dataset.size;
      document.querySelector('.proceed-to-options').disabled = false;
    });
  });

  // === FIXED: Redirect to options.html with product ID and size ===
  document.querySelector('.proceed-to-options').addEventListener('click', () => {
    if (selectedSize) {
      window.location.href = `options.html?id=${product.id}&size=${selectedSize}`;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayProductDetails();
});