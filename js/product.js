/* ==================================================================
   CRYSCULT — скрипты СТРАНИЦЫ ТОВАРА
   Три независимых блока: галерея фото, выбор размера, модалка
   size chart. Подключается вместе с js/script.js (там форма
   подписки, она общая для всех страниц).
   ================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. ГАЛЕРЕЯ: переключение главного фото ----------
     Два независимых набора кнопок управляют одним и тем же —
     миниатюры слева (.product-gallery__thumbs) и цифры под фото
     (.product-gallery__pager). Оба используют data-target/data-id,
     поэтому переключаются одной функцией. */
  const galleryTriggers = document.querySelectorAll(
    '.product-gallery__thumbs button, .product-gallery__pager button'
  );
  const mainImages = document.querySelectorAll('.product-gallery__main img');

  function setActiveImage(targetId) {
    galleryTriggers.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-target') === targetId);
    });
    mainImages.forEach(function (img) {
      img.classList.toggle('is-active', img.dataset.id === targetId);
    });
  }

  galleryTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      setActiveImage(trigger.getAttribute('data-target'));
    });
  });

  /* ---------- 2. ВЫБОР РАЗМЕРА ---------- */
  const sizeButtons = document.querySelectorAll('.size-grid button:not(:disabled)');

  sizeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sizeButtons.forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
    });
  });

  /* ---------- 3. SIZE CHART — модалка ---------- */
  const sizeChartDialog = document.getElementById('sizeChartModal');
  const openTriggers = document.querySelectorAll('[data-open-size-chart]');
  const closeTriggers = document.querySelectorAll('[data-close-size-chart]');

  openTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (sizeChartDialog) sizeChartDialog.showModal();
    });
  });
  closeTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (sizeChartDialog) sizeChartDialog.close();
    });
  });

  /* ---------- 4. ADD TO CART / PREORDER ----------
     Ссылка кнопки уже содержит товар/цену/SKU/фото в URL (см. href
     в product.html) — тут мы только добавляем к ней выбранный размер
     и переходим на checkout.html, где покупатель вводит свои данные. */
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function (event) {
      // товар ещё не открыт к преордеру (см. product-white-script.html) —
      // кнопка помечена aria-disabled="true", клик ничего не делает
      if (addToCartBtn.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      const selectedSize = document.querySelector('.size-grid button.is-selected');
      if (!selectedSize) {
        alert('Выбери размер перед тем, как оформить преордер.');
        return;
      }

      const url = new URL(addToCartBtn.href, window.location.href);
      url.searchParams.set('size', selectedSize.textContent.trim());
      window.location.href = url.toString();
    });
  }

});
