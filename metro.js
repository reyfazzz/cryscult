// metro.js — upgraded to match Instagram flow

let selectedStation = null;

// Station selection (your existing code, unchanged)
document.querySelectorAll('.station').forEach(dot => {
  dot.addEventListener('click', function () {
    document.querySelectorAll('.station').forEach(d => d.classList.remove('selected'));
    this.classList.add('selected');
    selectedStation = this.getAttribute('data-station');
    document.querySelector('.submit-order').disabled = false;
  });
});

// Confirm button — now upgraded
document.querySelector('.submit-order').addEventListener('click', async () => {
  if (!selectedStation) return alert('Choose station');

  const params = new URLSearchParams(window.location.search);
  const size = params.get('size') || 'N/A';

  // Product name mapping (keep in sync with options.js)
  const productNames = {
    '1': 'cryscult T-Shirt',
    // Add more when you expand: '2': 'AirFlex Hoodie',
  };
  const productId = params.get('id') || '1';
  const productName = productNames[productId] || 'Product';

  // Structured message (professional, in Azerbaijani)
  const message = `Salam! Sifariş vermək istəyirəm.\nModel: ${productName}\nÖlçü: ${size}\nMetro stansiyası: ${selectedStation}`;

  // Your exact Instagram conversation thread
  const conversationUrl = 'https://www.instagram.com/direct/t/17849360564929725/';

  try {
    // Copy message to clipboard
    await navigator.clipboard.writeText(message);

    // Show confirmation modal
    showInstagramModal();

    // After modal closes, open your chat thread
    setTimeout(() => {
      window.location.href = conversationUrl;
    }, 1800); // Matches modal duration
  } catch (err) {
    alert('Failed to copy message. Please copy manually:\n\n' + message);
    console.error(err);
  }
});

// Modal function (same as in options.js — clean and blocking)
function showInstagramModal() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.backdropFilter = 'blur(5px)';
  overlay.style.cursor = 'wait';

  const modal = document.createElement('div');
  modal.style.background = '#fff';
  modal.style.padding = '30px 40px';
  modal.style.borderRadius = '12px';
  modal.style.textAlign = 'center';
  modal.style.boxShadow = '0 10px 30px rgba(0, #000,0.3)';
  modal.style.maxWidth = '90%';
  modal.style.animation = 'fadeIn 0.3s ease';

  modal.innerHTML = `
    <p style="font-size: 1.2rem; margin: 0; font-weight: 500;">
      Message copied ✓<br>
      <span style="font-size: 1rem; color: #555;">Opening your chat…</span>
    </p>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Auto-close after 1.5 seconds
  setTimeout(() => {
    if (overlay && overlay.parentElement) {
      overlay.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => overlay.remove(), 300);
    }
  }, 1500);
}

// Fade animations (add once)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
  @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9); } }
`;
document.head.appendChild(style);