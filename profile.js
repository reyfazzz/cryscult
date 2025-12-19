
document.addEventListener('DOMContentLoaded', function() {

  checkLoginStatus();
  
  
  loadUserData();
  

  updateCartCount();
  
  
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('changePhotoBtn').addEventListener('click', triggerFileUpload);
  document.getElementById('profileUpload').addEventListener('change', handleProfileImageUpload);
  document.getElementById('userInfoForm').addEventListener('submit', saveUserInfo);
  document.getElementById('addCardBtn').addEventListener('click', addPaymentMethod);
  

  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      this.closest('.wishlist-item, .payment-card').remove();
    });
  });
});


function checkLoginStatus() {
  const user = localStorage.getItem('currentUser');
  if (!user) {
    window.location.href = 'login.html';
  }
}


function loadUserData() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    if (user.profileImage) {
      document.getElementById('profileImg').src = user.profileImage;
    }
  }
}


function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.cart-count').textContent = totalItems;
}


function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function triggerFileUpload() {
  document.getElementById('profileUpload').click();
}

function handleProfileImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('profileImg').src = event.target.result;
  
      const user = JSON.parse(localStorage.getItem('currentUser'));
      user.profileImage = event.target.result;
      localStorage.setItem('currentUser', JSON.stringify(user));
    };
    reader.readAsDataURL(file);
  }
}


function saveUserInfo(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  

  const user = JSON.parse(localStorage.getItem('currentUser'));
  

  user.username = username;
  user.email = email;
  if (password) {
    user.password = password; 
  }
  
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  
  alert('Profile updated successfully!');
}


function addPaymentMethod() {
  const paymentCards = document.querySelector('.payment-cards');
  const newCard = document.createElement('div');
  newCard.className = 'payment-card';
  newCard.innerHTML = `
    <i class="fab fa-cc-amex"></i>
    <span>•••• •••• •••• 1234</span>
    <span>Expires 12/26</span>
    <button class="btn-remove"><i class="fas fa-times"></i></button>
  `;
  paymentCards.appendChild(newCard);
  
  
  newCard.querySelector('.btn-remove').addEventListener('click', function(e) {
    e.preventDefault();
    this.closest('.payment-card').remove();
  });
}