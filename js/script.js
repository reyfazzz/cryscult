/* ==================================================================
   CRYSCULT — скрипты сайта
   1. Форма подписки на email (заглушка)
   2. Хранилище оформленных заказов в браузере (localStorage) — общее
      для всех страниц, чтобы счётчик "Cart" в шапке и checkout.html
      "помнили" про уже оформленные заказы, даже после перезагрузки
      страницы или возврата на сайт в другой раз. Это НЕ вход в
      аккаунт — данные лежат только в этом браузере на этом устройстве,
      если открыть сайт с телефона — заказы там будут не видны.
   ================================================================== */

// Ключ, под которым в localStorage хранится список заказов
const ORDERS_STORAGE_KEY = 'cryscultOrders';

// Достать все сохранённые заказы (пустой массив, если ничего нет
// или localStorage недоступен — например, режим инкогнито)
function getStoredOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// Добавить заказ в список и сохранить
function saveStoredOrder(order) {
  try {
    const orders = getStoredOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    // localStorage недоступен (приватный режим и т.п.) — просто не сохраняем,
    // сайт продолжает работать, но без "памяти" между визитами
  }
}

// Найти последний сохранённый заказ на конкретный товар+размер
// (используется в checkout.html, чтобы не показывать пустую форму
// заново для того же товара)
function findStoredOrder(product, size) {
  const orders = getStoredOrders();
  for (let i = orders.length - 1; i >= 0; i--) {
    if (orders[i].product === product && orders[i].size === size) {
      return orders[i];
    }
  }
  return null;
}

// Обновить число в шапке ("Cart (N)") — вызывается на каждой странице
// при загрузке и сразу после оформления нового заказа
function updateCartBadge() {
  const cartLink = document.querySelector('.cart');
  if (!cartLink) return;
  const count = getStoredOrders().length;
  cartLink.textContent = 'Cart (' + count + ')';
}

// Доступно из других файлов (js/checkout.js) через window.CryscultOrders
window.CryscultOrders = {
  getAll: getStoredOrders,
  save: saveStoredOrder,
  findForProduct: findStoredOrder,
  updateCartBadge: updateCartBadge,
};

document.addEventListener('DOMContentLoaded', function () {
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // ЗАГЛУШКА: сейчас форма просто показывает alert.
      // Чтобы подключить реальную отправку — замени этот блок на fetch()
      // к своему сервису рассылки (Mailchimp, SendPulse и т.д.) или на
      // отправку на свой backend.
      alert('Форма-заглушка — подключи реальную отправку письма или сервис рассылки.');
    });
  }

  updateCartBadge();
});
