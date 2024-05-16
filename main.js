const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete
  };
}

function saveData() {
  if (!localStorage) {
    alert('Browser kamu tidak mendukung local storage');
    return;
  }

  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);

  handleStorageChange();
}

function handleStorageChange() {
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const bookshelfList = isComplete ? document.getElementById('completeBookshelfList') : document.getElementById('incompleteBookshelfList');

  const article = document.createElement('article');
  article.classList.add('book_item');

  const h3 = document.createElement('h3');
  h3.innerText = title;
  article.appendChild(h3);

  const p1 = document.createElement('p');
  p1.innerText = 'Penulis: ' + author;
  article.appendChild(p1);

  const p2 = document.createElement('p');
  p2.innerText = 'Tahun: ' + year;
  article.appendChild(p2);

  const divAction = document.createElement('div');
  divAction.classList.add('action');

  const buttonToggle = document.createElement('button');
  buttonToggle.classList.add(isComplete ? 'green' : 'red');
  buttonToggle.innerText = isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
  buttonToggle.addEventListener('click', function () {
    toggleBookStatus(article, isComplete);
  });
  divAction.appendChild(buttonToggle);

  const buttonDelete = document.createElement('button');
  buttonDelete.classList.add('red');
  buttonDelete.innerText = 'Hapus buku';
  buttonDelete.addEventListener('click', function () {
    deleteBook(article);
  });
  divAction.appendChild(buttonDelete);

  article.appendChild(divAction);

  bookshelfList.appendChild(article);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function toggleBookStatus(article, isComplete) {
  const bookshelfList = isComplete ? document.getElementById('completeBookshelfList') : document.getElementById('incompleteBookshelfList');
  const oppositeBookshelfList = isComplete ? document.getElementById('incompleteBookshelfList') : document.getElementById('completeBookshelfList');

  const button = article.querySelector('button');
  button.classList.remove(isComplete ? 'green' : 'red');
  button.classList.add(isComplete ? 'red' : 'green');
  button.innerText = isComplete ? 'Selesai dibaca' : 'Belum selesai di Baca';

  oppositeBookshelfList.appendChild(article);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(article) {
  article.remove();

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    books.push(...data);
    displayBooks();
  }
}

function displayBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  books.forEach(book => {
    const article = document.createElement('article');
    article.classList.add('book_item');

    const h3 = document.createElement('h3');
    h3.innerText = book.title;
    article.appendChild(h3);

    const p1 = document.createElement('p');
    p1.innerText = 'Penulis: ' + book.author;
    article.appendChild(p1);

    const p2 = document.createElement('p');
    p2.innerText = 'Tahun: ' + book.year;
    article.appendChild(p2);

    const divAction = document.createElement('div');
    divAction.classList.add('action');

    const buttonToggle = document.createElement('button');
    buttonToggle.classList.add(book.isComplete ? 'green' : 'red');
    buttonToggle.innerText = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
    buttonToggle.addEventListener('click', function () {
      toggleBookStatus(article, book.isComplete);
    });
    divAction.appendChild(buttonToggle);

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('red');
    buttonDelete.innerText = 'Hapus buku';
    buttonDelete.addEventListener('click', function () {
      deleteBook(article);
    });
    divAction.appendChild(buttonDelete);

    article.appendChild(divAction);

    if (book.isComplete) {
      completeBookshelfList.appendChild(article);
    } else {
      incompleteBookshelfList.appendChild(article);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
  displayBooks();
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
