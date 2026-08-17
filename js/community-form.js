/* ==================================================================
   CRYSCULT — форма заявки в Closed Community
   Отправляет данные напрямую в Google Forms в обход самой страницы
   Google — пользователь весь путь остаётся на нашем сайте, а ответы
   всё равно падают в Google Таблицу, привязанную к форме.

   ✅ УЖЕ НАСТРОЕНО И ПОДКЛЮЧЕНО к форме "Crys Cult" (closed community).
   Ответы смотри в Google Forms → вкладка "Responses" → значок таблицы
   (там же можно открыть Google Sheet со всеми заявками).

   Ниже — инструкция на случай, если когда-нибудь пересоздашь форму
   и нужно будет подключить заново:

   1. Создай форму в Google Forms с полями:
      Telegram-юзернейм / Имя / Instagram-юзернейм /
      Уже покупали? (Да/Нет) / Почему хочешь в комьюнити

   2. Открой форму для заполнения (не режим редактирования) —
      это страница вида:
      https://docs.google.com/forms/d/e/XXXXXXXXXXXXXXXXXXXXX/viewform

   3. Скопируй ID из этой ссылки (часть между /d/e/ и /viewform) —
      это и есть GOOGLE_FORM_ACTION_URL ниже, просто вставь его
      вместо XXXXXXXXXXXXXXXXXXXXX.

   4. Чтобы узнать entry.ID каждого поля — в Google Forms есть кнопка
      "⋮" → "Get pre-filled link". Заполни черновик узнаваемым текстом
      в каждом поле (например "AAA_TELEGRAM"), нажми "Get link" —
      в получившейся длинной ссылке будут видны все entry.ID вместе
      со значениями, которые ты вписала. Пришли эту ссылку Claude —
      он сам найдёт нужные ID и впишет их сюда.
   ================================================================== */

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScJH3buddPSmATZa6yT296IMkL8pCdDcloBK98indgNtp9ZDQ/formResponse';

// Реальные entry.ID полей формы "Crys Cult" (Google Forms)
const FIELD_ENTRY_IDS = {
  telegram: 'entry.292310882',    // Telegram-юзернейм
  name: 'entry.1689549294',       // Имя
  instagram: 'entry.1446990495',  // Instagram-юзернейм
  purchased: 'entry.1099328680',  // Уже покупали? (значение "Да" / "Нет")
  reason: 'entry.1396001359',     // Почему хочешь в комьюнити
};

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Пилюли "Да / Нет" ---------- */
  const radioLabels = document.querySelectorAll('.radio-group label');
  radioLabels.forEach(function (label) {
    label.addEventListener('click', function () {
      const groupName = label.querySelector('input').name;
      document
        .querySelectorAll('.radio-group input[name="' + groupName + '"]')
        .forEach(function (input) {
          input.closest('label').classList.remove('is-selected');
        });
      label.classList.add('is-selected');
    });
  });

  /* ---------- Отправка формы ---------- */
  const form = document.getElementById('applyForm');
  if (!form) return;

  const statusBox = document.getElementById('applyFormStatus');
  const submitBtn = form.querySelector('.apply-form__submit');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // простая проверка обязательных полей
    const telegram = form.telegram.value.trim();
    const name = form.name.value.trim();
    const purchased = form.querySelector('input[name="purchased"]:checked');

    if (!telegram || !name || !purchased) {
      showStatus('Заполни имя, Telegram-юзернейм и отметь, покупал(а) ли ты у нас раньше.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append(FIELD_ENTRY_IDS.telegram, telegram);
    formData.append(FIELD_ENTRY_IDS.name, name);
    formData.append(FIELD_ENTRY_IDS.instagram, form.instagram.value.trim());
    formData.append(FIELD_ENTRY_IDS.purchased, purchased.value);
    formData.append(FIELD_ENTRY_IDS.reason, form.reason.value.trim());

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    // mode:'no-cors' — Google Forms не отдаёт нам доступ к ответу,
    // но сама отправка при этом проходит и запись появляется в
    // таблице. Поэтому просто считаем успехом сам факт отправки
    // запроса без сетевой ошибки (fetch не бросил исключение).
    fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    })
      .then(function () {
        showStatus('Заявка отправлена! Если подходишь — напишем тебе в Telegram в течение нескольких дней.', 'success');
        form.reset();
        radioLabels.forEach(function (l) { l.classList.remove('is-selected'); });
        submitBtn.textContent = 'Отправить заявку';
        submitBtn.disabled = false;
      })
      .catch(function () {
        showStatus('Не получилось отправить — проверь интернет-соединение и попробуй ещё раз.', 'error');
        submitBtn.textContent = 'Отправить заявку';
        submitBtn.disabled = false;
      });
  });

  function showStatus(text, kind) {
    statusBox.textContent = text;
    statusBox.className = 'form-status is-visible is-' + kind;
  }

});
