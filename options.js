// options.js
function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    id: urlParams.get('id'),
    size: urlParams.get('size')
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const params = getParams();
  if (!params.id || !params.size) {
    window.location.href = 'index.html';
    return;
  }

  
  const productNames = {
    '1': 'CRYS CULT T-SHIRT',
    
  };

  const productName = productNames[params.id] || 'Product';

  // Pre-written message (short, professional, in Azerbaijani)
  const message = `Salam! Sifariş vermək istəyirəm.\nModel: ${productName}\nÖlçü: ${params.size}`;

  // Your exact conversation thread URL — this opens the specific chat
  const conversationUrl = 'https://www.instagram.com/direct/t/17849360564929725/';

  const instagramButton = document.querySelector('.instagram-dm');

  instagramButton.addEventListener('click', async () => {
    try {
      // Copy the order message to clipboard
      await navigator.clipboard.writeText(message);

      // Show confirmation modal
      showInstagramModal();

      // After modal closes, open your specific chat thread
      setTimeout(() => {
        window.location.href = conversationUrl;
      }, 1800); // Matches modal duration + fade
    } catch (err) {
      alert('Failed to copy message. Please copy manually:\n\n' + message);
      console.error(err);
    }
  });

  // Metro delivery (unchanged)
  document.querySelector('.metro-delivery').addEventListener('click', () => {
    window.location.href = `metro.html?id=${params.id}&size=${params.size}`;
  });
});

// Modal (same clean, blocking style as before)
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
  modal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
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

  // Auto-close modal after 1.5 seconds
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