// script.js remains mostly unchanged, but simplified for one product
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.innerHTML = mainNav.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userIcon = document.querySelector('.fa-user');

  if (currentUser) {
    userIcon.classList.add('logged-in');
    userIcon.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.reload();
    });
  } else {
    userIcon.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'auth/login.html';
    });
  }

  // Simplified for one product, no dynamic addition needed
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('crys-cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(count => {
      count.textContent = totalItems;
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
    updateProfileLink();
  });

  function updateProfileLink() {
      const profileLink = document.getElementById('profileLink');
      if (profileLink) {
          const user = JSON.parse(localStorage.getItem('currentUser'));
          if (user) {
              profileLink.href = 'profile.html';
          } else {
              profileLink.href = 'login.html';
          }
      }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
  });

  let cartItems = 0;
  const cartCount = document.querySelector('.cart-count');
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      cartItems++;
      cartCount.textContent = cartItems;
      const cartIcon = document.querySelector('.fa-shopping-bag');
      cartIcon.classList.add('animate');
      setTimeout(() => {
        cartIcon.classList.remove('animate');
      }, 500);
    });
  });
  
  document.querySelector('.shop-collection-btn')?.addEventListener('click', function(e) {
  e.preventDefault();
  const target = document.querySelector('#product-grid-section');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
  });
});