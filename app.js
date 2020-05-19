class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static DOMSelectors() {
    return {
      list: document.querySelector('#book-list'),
      container: document.querySelector('.container'),
      form: document.querySelector('#book-form'),
      title: document.querySelector('#title'),
      author: document.querySelector('#author'),
      isbn: document.querySelector('#isbn')
    }
  }

  static displayBooks() {
    const books = Storage.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    // const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    const DOM = UI.DOMSelectors();

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    DOM.list.appendChild(row);
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, classname) {
    const div = document.createElement('div');
    div.className = `alert alert-${classname}`;
    div.textContent = message;

    const DOM = UI.DOMSelectors();

    DOM.container.insertBefore(div, DOM.form);
    // remove alert message in 4 seconds
    setTimeout(() => div.remove(), 4000);
  }

  static clearFields() {
    const DOM = UI.DOMSelectors();
    const { title, author, isbn } = DOM;

    title.value = '';
    author.value = '';
    isbn.value = '';
  }
}
// store books in local storage
class Storage {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Storage.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Storage.getBooks();
    const filterBooks = books.filter(book => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(filterBooks));
  }
}

const DOM = UI.DOMSelectors();
// load books from local storage
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// submit form listener
DOM.form.addEventListener('submit', e => {
  e.preventDefault();

  const title = DOM.title.value,
        author = DOM.author.value,
        isbn = DOM.isbn.value;
  // validate fields
  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill all fields correctly!', 'danger');
  } else {
    // create new instance of Book
    const book = new Book(title, author, isbn);
    // add book to the list
    UI.addBookToList(book);
    // add book to storage
    Storage.addBook(book);
    // success alert
    UI.showAlert('Book added correctly!', 'success');
    // clear input fields
    UI.clearFields();
  }
});

// delete book listener
DOM.list.addEventListener('click', e => {
  // remove book from UI
  UI.deleteBook(e.target);
  // remove book from local storage
  Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert('Book removed!', 'success');
});