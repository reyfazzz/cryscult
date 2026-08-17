/* ==================================================================
   CRYSCULT — страница оформления заказа (checkout.html)

   Как это работает:
   1. Со страницы товара сюда приходят в URL: ?product=...&price=...
      &sku=...&img=...&size=... — checkout.html их читает и показывает
      в сводке заказа слева (ничего вводить руками не нужно).
   2. Покупатель заполняет контактные данные (шаг "форма").
   3. При отправке данные уходят в Google Forms (та же техника, что
      и в форме заявки на комьюнити — см. js/community-form.js),
      и страница переключается на шаг "оплата" с реквизитами карты.

   ✅ Форма и её поля УЖЕ ПОДКЛЮЧЕНЫ (Google Forms "Заказы").
   Ответы смотри там же, где и заявки в комьюнити — вкладка
   "Responses" → значок таблицы (открывает Google Sheet).

   ✅ ПАМЯТЬ О ЗАКАЗЕ: после успешной отправки заказ сохраняется в
   localStorage браузера (см. js/script.js, window.CryscultOrders).
   Если покупатель вернётся на checkout.html с теми же товаром+
   размером в URL — страница не покажет пустую форму заново, а сразу
   откроет шаг оплаты с уже сгенерированным кодом заказа, плюс
   покажет уведомление "ты уже оформлял(а) этот заказ". Это работает
   только в конкретном браузере на конкретном устройстве — не путать
   с настоящим аккаунтом/входом.

   ✅ РЕКВИЗИТЫ ОПЛАТЫ (PAYMENT_INFO ниже) уже вписаны настоящие.
   Если карта поменяется — обнови значения там же.
   ================================================================== */

// ID формы "Заказы" в Google Forms — уже подключена
const ORDERS_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdce-k_IuDiNHCcRYD__YFWMUifbWbBpGC-B4ACHHpJKkLt0Q/formResponse';

// Реальные entry.ID полей формы "Заказы" (Google Forms)
const ORDER_FIELD_ENTRY_IDS = {
  product: 'entry.1758746049',  // Товар
  size: 'entry.166112633',      // Размер
  qty: 'entry.188118787',       // Количество
  total: 'entry.1008121027',    // Сумма
  orderCode: 'entry.1088090154',// Код заказа
  name: 'entry.233675258',      // Имя
  contact: 'entry.820075199',   // Telegram или телефон
  metro: 'entry.962735906',     // Станция метро
  comment: 'entry.926488959',   // Комментарий
};

// Реквизиты для оплаты — покажутся покупателю на шаге "оплата"
const PAYMENT_INFO = {
  cardNumber: '5522 0993 8077 4646',
  cardHolder: 'Sultanov Pasha',
  bankName: 'ABB Bank',
  telegramContact: '@cryscult',        // куда присылать скриншот оплаты
};

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Читаем параметры товара из URL ---------- */
  const params = new URLSearchParams(window.location.search);
  const product = params.get('product') || 'Товар';
  const price = parseFloat(params.get('price')) || 0;
  const sku = params.get('sku') || '';
  const img = params.get('img') || '';
  const size = params.get('size') || '—';

  document.getElementById('summaryImg').src = img;
  document.getElementById('summaryImg').alt = product;
  document.getElementById('summaryName').textContent = product;
  document.getElementById('summarySize').textContent = 'Размер ' + size + (sku ? ' · SKU ' + sku : '');
  document.getElementById('summaryPrice').textContent = price + ' AZN';

  /* ---------- 2. Степпер количества ---------- */
  let qty = 1;
  const qtyValueEl = document.getElementById('qtyValue');
  const totalValueEl = document.getElementById('summaryTotal');

  function renderQty() {
    qtyValueEl.textContent = qty;
    totalValueEl.textContent = (price * qty).toFixed(0) + ' AZN';
  }
  renderQty();

  document.getElementById('qtyMinus').addEventListener('click', function () {
    if (qty > 1) { qty -= 1; renderQty(); }
  });
  document.getElementById('qtyPlus').addEventListener('click', function () {
    if (qty < 5) { qty += 1; renderQty(); } // больше 5 за раз — предполагаем, что это опт, пусть пишут в Telegram напрямую
  });

  /* ---------- 3. Генерируем короткий код заказа ----------
     Нужен, чтобы покупатель указал его при отправке скриншота оплаты
     в Telegram — так проще сверить оплату с конкретной строкой
     в таблице заказов. */
  let orderCode = 'CC-' + Date.now().toString(36).toUpperCase();

  /* ---------- 4. Переключение шагов форма → оплата ---------- */
  const formStep = document.getElementById('stepForm');
  const paymentStep = document.getElementById('stepPayment');
  const form = document.getElementById('checkoutForm');
  const statusBox = document.getElementById('checkoutFormStatus');
  const submitBtn = form.querySelector('.checkout-form__submit');
  const alreadyOrderedNotice = document.getElementById('alreadyOrderedNotice');
  const placeNewOrderBtn = document.getElementById('placeNewOrderBtn');

  // показывает шаг "оплата", заполняя его данными конкретного заказа
  function showPaymentStep(code, totalAmount) {
    document.getElementById('paymentCardNumber').textContent = PAYMENT_INFO.cardNumber;
    document.getElementById('paymentCardHolder').textContent = PAYMENT_INFO.cardHolder;
    document.getElementById('paymentBankName').textContent = PAYMENT_INFO.bankName;
    document.getElementById('paymentTelegramContact').textContent = PAYMENT_INFO.telegramContact;
    document.getElementById('paymentAmount').textContent = totalAmount + ' AZN';
    document.getElementById('paymentOrderCode').textContent = code;

    formStep.classList.remove('is-active');
    paymentStep.classList.add('is-active');
  }

  /* ---------- 5. Память о заказе (localStorage) ----------
     Если этот же товар+размер уже заказывали в этом браузере раньше —
     не показываем пустую форму заново, сразу открываем оплату. */
  const existingOrder = window.CryscultOrders.findForProduct(product, size);

  if (existingOrder) {
    orderCode = existingOrder.orderCode; // переиспользуем тот же код, не генерируем новый

    const dateLabel = new Date(existingOrder.dateISO).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long',
    });
    document.getElementById('alreadyOrderedDate').textContent = 'от ' + dateLabel;
    alreadyOrderedNotice.hidden = false;

    showPaymentStep(existingOrder.orderCode, existingOrder.total);
  }

  // кнопка "оформить ещё один" в уведомлении — просто показывает пустую
  // форму заново (старый заказ никуда не пропадает из localStorage)
  placeNewOrderBtn.addEventListener('click', function () {
    alreadyOrderedNotice.hidden = true;
    paymentStep.classList.remove('is-active');
    formStep.classList.add('is-active');
    orderCode = 'CC-' + Date.now().toString(36).toUpperCase(); // новый код для нового заказа
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const metro = form.metro.value.trim();

    if (!name || !contact || !metro) {
      showStatus('Заполни имя, контакт и удобную станцию метро.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append(ORDER_FIELD_ENTRY_IDS.product, product);
    formData.append(ORDER_FIELD_ENTRY_IDS.size, size);
    formData.append(ORDER_FIELD_ENTRY_IDS.qty, String(qty));
    formData.append(ORDER_FIELD_ENTRY_IDS.total, (price * qty).toFixed(0));
    formData.append(ORDER_FIELD_ENTRY_IDS.orderCode, orderCode);
    formData.append(ORDER_FIELD_ENTRY_IDS.name, name);
    formData.append(ORDER_FIELD_ENTRY_IDS.contact, contact);
    formData.append(ORDER_FIELD_ENTRY_IDS.metro, metro);
    formData.append(ORDER_FIELD_ENTRY_IDS.comment, form.comment.value.trim());

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    fetch(ORDERS_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    })
      .then(function () {
        // сохраняем заказ в localStorage — чтобы при возврате на эту
        // страницу для того же товара+размера сайт "помнил" про него
        window.CryscultOrders.save({
          orderCode: orderCode,
          product: product,
          size: size,
          sku: sku,
          qty: qty,
          total: (price * qty).toFixed(0),
          name: name,
          contact: contact,
          metro: metro,
          dateISO: new Date().toISOString(),
        });
        window.CryscultOrders.updateCartBadge();

        showPaymentStep(orderCode, (price * qty).toFixed(0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(function () {
        showStatus('Не получилось отправить — проверь интернет-соединение и попробуй ещё раз.', 'error');
        submitBtn.textContent = 'Оформить преордер';
        submitBtn.disabled = false;
      });
  });

  function showStatus(text, kind) {
    statusBox.textContent = text;
    statusBox.className = 'form-status is-visible is-' + kind;
  }

});
