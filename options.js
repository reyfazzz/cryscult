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

  // Pre-written message
  const message = `Salam! Sifariş vermək istəyirəm.\nModel: ${productName}\nÖlçü: ${params.size}`;

  // Your exact Instagram conversation thread URL
  const conversationUrl = 'https://www.instagram.com/direct/t/17849360564929725/';

const instagramButton = document.querySelector('.instagram-dm');

instagramButton.addEventListener('click', () => {
  // сообщение (можешь оставить своё)
  const message = `Salam! Sifariş vermək istəyirəm.\nModel: ${productName}\nÖlçü: ${params.size}`;

  // попытка скопировать (не критично, если не сработает)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  // МГНОВЕННЫЙ переход (важно для мобильных)
  window.location.href = 'https://www.instagram.com/cryscult/';
});

  // Metro delivery button (unchanged)
  document.querySelector('.metro-delivery').addEventListener('click', () => {
    window.location.href = `metro.html?id=${params.id}&size=${params.size}`;
  });
});

// New mobile-friendly success modal
function showCopySuccessModal() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999; backdrop-filter: blur(6px);
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white; padding: 32px 24px; border-radius: 16px;
    max-width: 90%; text-align: center; box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  `;

  modal.innerHTML = `
    <h2 style="margin: 0 0 16px; font-size: 1.4rem;">✓ Message Copied!</h2>
    <p style="margin: 0 0 24px; color: #444; line-height: 1.5;">
      Sifariş mesajınız clipboard-a kopyalandı.<br>
      <strong>Növbəti addımlar:</strong><br>
      1. Aşağıdakı düyməyə basın<br>
      2. Instagram-da söhbət açılacaq → uzun basıb → Paste → Göndər
    </p>
    <button id="open-ig" style="
      background: #E1306C; color: white; border: none;
      padding: 16px 32px; border-radius: 12px; font-size: 1.1rem;
      font-weight: 600; cursor: pointer; width: 100%; max-width: 240px;
    ">Instagram Chat-i Aç</button>
    <br><br>
    <button id="close-modal" style="
      background: transparent; border: none; color: #666;
      font-size: 1rem; cursor: pointer;
    ">Bağla</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('open-ig').onclick = () => {
    window.location.href = 'https://www.instagram.com/direct/t/17849360564929725/';
  };

  document.getElementById('close-modal').onclick = () => {
    overlay.remove();
  };
}

// Fallback modal if copy fails
function showFallbackModal(fullMessage) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999; backdrop-filter: blur(6px);
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white; padding: 32px 24px; border-radius: 16px;
    max-width: 90%; text-align: center; box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  `;

  modal.innerHTML = `
    <h2 style="margin: 0 0 16px; font-size: 1.4rem;">Avtomatik kopyalanmadı</h2>
    <p style="margin: 0 0 20px; color: #444;">
      Zəhmət olmasa bu mesajı əl ilə kopyalayın:
    </p>
    <textarea readonly style="
      width: 100%; min-height: 120px; padding: 12px;
      border: 1px solid #ccc; border-radius: 8px;
      font-family: monospace; resize: none; font-size: 1rem;
    ">${fullMessage}</textarea>
    <br><br>
    <button id="open-ig" style="
      background: #E1306C; color: white; border: none;
      padding: 16px 32px; border-radius: 12px; font-size: 1.1rem;
      font-weight: 600; cursor: pointer; width: 100%; max-width: 240px;
    ">Instagram Chat-i Aç</button>
    <br><br>
    <button id="close-modal" style="
      background: transparent; border: none; color: #666;
      font-size: 1rem; cursor: pointer;
    ">Bağla</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('open-ig').onclick = () => {
    window.location.href = 'https://www.instagram.com/direct/t/17849360564929725/';
  };

  document.getElementById('close-modal').onclick = () => {
    overlay.remove();
  };
}



