// Declaring Variables
const closeFormBtn = document.querySelector('.form__close');
const overlay = document.querySelector('.overlay');
const addButton = document.querySelector('.add');
const form = document.querySelector('.form');
const main = document.querySelector('.main');
const formHeading = document.querySelector('.form__button');
const formButton = document.querySelector('.form__button');
const popWindow = document.querySelector('.pop');
const cancelBtn = document.querySelector('.pop__button--cancel');
const deleteBtn = document.querySelector('.pop__button--delete');

// Initilization Variables
const monthArr = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const emoji = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '🥲',
  '🥹',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😛',
  '😝',
  '😜',
  '🤪',
];

const notesData = JSON.parse(localStorage.getItem('notes') || '[]');

let targetEditNote;

//------------------------- Functions ------------------------------------

// Create a new Date depending when addDate function is called
const addDate = function () {
  const date = new Date();
  const month = monthArr[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

// Create a random emoji
const addEmoji = function () {
  return emoji[Math.trunc(Math.random() * 27)];
};

// Init the input value
const inputValue = function (titelInput = '', descriptionInput = '') {
  form.querySelector('.form__input--description').value = descriptionInput;
  form.querySelector('.form__input--title').value = titelInput;
};

// Close and open form function
const toggleForm = function (formIsVisible) {
  if (formIsVisible) {
    form.classList.add('active-form');
    overlay.classList.add('active-overlay');
  } else {
    form.classList.remove('active-form');
    overlay.classList.remove('active-overlay');
    form
      .querySelector('.form__input-box--description')
      .classList.remove('active-description-error');
  }
};

// Close and open pop window function
const togglePopWindow = function (popIsVisible) {
  if (popIsVisible) {
    overlay.classList.add('active-overlay');
    popWindow.classList.add('active-pop');
  } else {
    overlay.classList.remove('active-overlay');
    popWindow.classList.remove('active-pop');
  }
};

//-------------------------
// Render Note Markup to the screen
const renderMarkup = function () {
  document.querySelectorAll('.card__note').forEach(note => note.remove());

  let markup = '';

  notesData.forEach((content, i) => {
    const id = i === 0 ? document.querySelectorAll('.card__note').length : i;
    markup += `
    
    <div class="card card__note note" data=${id}>
    <div class="note__content">
            ${content.title && `<h2>${content.title} ${content.emoji}</h2>`}${
      content.description && `<p>${content.description}</p>`
    }
    </div>
    <div class="note__info">
      <div class="note__info-date">${content.date}</div>
      <div class="note__info-setting setting">
        <span class="setting__icon">
          <i class="fa-solid fa-ellipsis"></i>
        </span>
        <div class="setting__options">
          <div class="setting__options-option setting__options-option--edit" onclick="editNote(${id})">
            <span><i class="fa-regular fa-pen-to-square"></i></span>
            <span>Edit</span>
          </div>
  
          <div class="setting__options-option setting__options-option--delete"  onclick="deleteNote(${id})">
            <span><i class="fa-regular fa-trash-can"></i></span>
            <span>Delete</span>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
  });

  addButton.insertAdjacentHTML('afterend', markup);
};

// Store notes data in local storage
const updateLocalStorage = function () {
  localStorage.setItem('notes', JSON.stringify(notesData));
};

renderMarkup();

//-------------------------
const deleteNote = function (id) {
  targetEditNote = id;
  togglePopWindow(true);
};

const editNote = function (id) {
  targetEditNote = id;

  const fetchData = notesData[id];

  formHeading.textContent = 'Update a Note';
  formButton.textContent = 'Update Note';

  inputValue(fetchData.title, fetchData.description);
  toggleForm(true);
};

//----------------------------------------------------------
// Add Handler Events
addButton.addEventListener('click', () => {
  inputValue();
  toggleForm(true);
});

closeFormBtn.addEventListener('click', toggleForm.bind(this, false));

overlay.addEventListener('click', () => {
  toggleForm(false);
  togglePopWindow(false);
});

cancelBtn.addEventListener('click', togglePopWindow.bind(this, false));

deleteBtn.addEventListener('click', () => {
  notesData.splice(targetEditNote, 1);
  updateLocalStorage();
  renderMarkup();
  togglePopWindow(false);
  targetEditNote = undefined;
});

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    toggleForm(false);
    togglePopWindow(false);
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const dataArr = [...new FormData(form)];
  const data = Object.fromEntries(dataArr);

  const getIndex =
    !targetEditNote && targetEditNote !== 0 ? notesData.length : targetEditNote;

  const addNewData = {
    title: data.title,
    description: data.description,
    date: addDate(),
    emoji:
      !targetEditNote && targetEditNote !== 0
        ? addEmoji()
        : notesData[targetEditNote].emoji,
  };

  targetEditNote = undefined;

  if (data.description.trim() !== '') {
    notesData[getIndex] = addNewData;
    updateLocalStorage();
    renderMarkup();
    toggleForm(false);
    inputValue();
    formHeading.textContent = 'Add a new Note';
    formButton.textContent = 'Add note';
  } else {
    form
      .querySelector('.form__input-box--description')
      .classList.add('active-description-error');
  }
});

main.addEventListener('click', function (e) {
  const targetBtn = e.target.closest('.note__info-setting');

  if (!targetBtn) return;

  const targetAddNote = targetBtn.closest('.card__note');

  targetAddNote.classList.add('active-setting');

  document.addEventListener('click', function (e) {
    if (
      e.target.tagName !== 'I' ||
      e.target.closest('.card__note') !== targetAddNote
    )
      targetAddNote.classList.remove('active-setting');
  });
});
