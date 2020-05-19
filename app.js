class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    const books = Storage.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
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

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    container.insertBefore(div, form);
    // remove alert message in 4 seconds
    setTimeout(() => div.remove(), 4000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
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

// load books from local storage
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// submit form listener
document.querySelector('#book-form').addEventListener('submit', e => {
  e.preventDefault();

  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;
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
document.querySelector('#book-list').addEventListener('click', e => {
  // remove book from UI
  UI.deleteBook(e.target);
  // remove book from local storage
  Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert('Book removed!', 'success');
});