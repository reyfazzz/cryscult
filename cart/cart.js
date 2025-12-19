
class Cart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('crys-cart')) || [];
    this.init();
  }
  
  init() {
    this.renderCart();
    this.updateCartCount();
    this.setupEventListeners();
  }
  
  renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-price');
    
    if (this.cart.length === 0) {
      emptyCartMessage.style.display = 'block';
      cartItemsContainer.innerHTML = '';
      cartItemsContainer.appendChild(emptyCartMessage);
      subtotalElement.textContent = '$0.00';
      totalElement.textContent = '$0.00';
      return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    let cartHTML = '';
    let subtotal = 0;
    
    this.cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      cartHTML += `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Size: ${item.size}</p>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-selector">
              <button class="quantity-btn minus">-</button>
              <input type="number" class="quantity-input" value="${item.quantity}" min="1">
              <button class="quantity-btn plus">+</button>
            </div>
            <button class="remove-item">Remove</button>
          </div>
        </div>
      `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;
  }
  
  updateCartCount() {
    const cartCount = document.querySelectorAll('.cart-count');
    const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.forEach(count => {
      count.textContent = totalItems;
    });
  }
  
  setupEventListeners() {
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemElement = e.target.closest('.cart-item');
        const id = itemElement.dataset.id;
        const size = itemElement.dataset.size;
        const input = itemElement.querySelector('.quantity-input');
        let quantity = parseInt(input.value);
        
        if (e.target.classList.contains('plus')) {
          quantity += 1;
        } else if (e.target.classList.contains('minus') && quantity > 1) {
          quantity -= 1;
        }
        
        input.value = quantity;
        this.updateCartItem(id, size, quantity);
      });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const itemElement = e.target.closest('.cart-item');
        const id = itemElement.dataset.id;
        const size = itemElement.dataset.size;
        let quantity = parseInt(e.target.value);
        
        if (isNaN(quantity)) quantity = 1;
        if (quantity < 1) quantity = 1;
        
        e.target.value = quantity;
        this.updateCartItem(id, size, quantity);
      });
    });
  
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemElement = e.target.closest('.cart-item');
        const id = itemElement.dataset.id;
        const size = itemElement.dataset.size;
        this.removeFromCart(id, size);
      });
    });
    
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          alert('Your cart is empty!');
          return;
        }
        alert('Checkout functionality will be implemented later!');
      });
    }
  }
  
  updateCartItem(id, size, quantity) {
    const itemIndex = this.cart.findIndex(item => item.id === id && item.size === size);
    
    if (itemIndex !== -1) {
      this.cart[itemIndex].quantity = quantity;
      this.saveCart();
      this.renderCart();
      this.updateCartCount();
    }
  }
  
  removeFromCart(id, size) {
    this.cart = this.cart.filter(item => !(item.id === id && item.size === size));
    this.saveCart();
    this.renderCart();
    this.updateCartCount();
  }
  
  saveCart() {
    localStorage.setItem('crys-cart', JSON.stringify(this.cart));
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new Cart();
  
 
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
});