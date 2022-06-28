//Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}
//UI Constructor
function UI() {}

//Add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById("book-list");
  //create tr element
  const row = document.createElement("tr");
  // insert cols
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href = "#" class = "delete">X</a></td>
  `;
  list.appendChild(row);
};

//show alert
UI.prototype.showAlert = function (message, className) {
  //create div
  const div = document.createElement("div"); //this has class of .alert & .${className}
  //Add classes
  div.className = `alert ${className}`;
  //Add Text
  div.appendChild(document.createTextNode(message));
  //get parent
  const container = document.querySelector(".container");
  //get form
  const form = document.querySelector("#book-form");
  //place div (with alert) before form
  container.insertBefore(div, form);

  //timeout after 4 secs
  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
};

//Delete book
UI.prototype.deleteBook = function (target) {
  if (target.className === "delete") {
    target.parentElement.parentElement.remove();
  }
};

//clear fields
UI.prototype.clearFields = function () {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
};

//Store constructor(to store to local storage)
function Store() {}

Store.getBooks = function () {
  let books;
  if (localStorage.getItem("books") == null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books")); //makes it a js object
  }
  return books;
};

Store.displayBooks = function () {
  const books = Store.getBooks();

  books.forEach(function (book) {
    const ui = new UI();

    //add book to the ui
    ui.addBookToList(book);
  });
};

Store.addBook = function (book) {
  const books = Store.getBooks();

  books.push(book);

  localStorage.setItem("books", JSON.stringify(books));
};

Store.removeBook = function (isbn) {
  const books = Store.getBooks();

  //loop through the books
  books.forEach(function (book, index) {
    if (book.isbn == isbn) {
      books.splice(index, 1);
    }
  });

  localStorage.setItem("books", JSON.stringify(books));
};

//DOM Load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//Event listener for add book
document.getElementById("book-form").addEventListener("submit", function (e) {
  //Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  //create an instance of book from the book constructor in the beginning
  const book = new Book(title, author, isbn);

  //create an instance of the ui
  const ui = new UI();

  //validate the input fi
  if (title === "" || author === "" || isbn === "") {
    //error alert
    ui.showAlert("Fill in all fields", "error");
  } else {
    //add book to list
    ui.addBookToList(book);

    //add book to local storage
    Store.addBook(book);

    //show success
    ui.showAlert("Book added", "success");

    //clear fields
    ui.clearFields();
  }
  e.preventDefault();
});

//event listener for delete(from ui and local storage)
document.getElementById("book-list").addEventListener("click", function (e) {
  //create new UI instance
  const ui = new UI();

  //call delete book
  ui.deleteBook(e.target);

  //remove from local storage by calling remove book on
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //shows message
  ui.showAlert("removed", "success");

  //add to local storage
  Store.addBook(book);

  e.preventDefault();
});

document.getElementById("title").addEventListener("blur", validateTitle);
document.getElementById("author").addEventListener("blur", validateAuthor);
document.getElementById("isbn").addEventListener("blur", validateIsbn);

function validateTitle() {
  const title = document.getElementById("title");
  const re = /^[a-zA-Z](2,10)$/;

  if (!re.test(title.value)) {
    title.classList.add("is-invalid");
  } else {
    title.classList.remove("is-invalid");
  }
}
function validateAuthor() {
  const author = document.getElementById("author");
  const re = /^([a-zA-Z](2,10)){2}$/;

  if (!re.test(author.value)) {
    author.classList.add("is-invalid");
  } else {
    author.classList.remove("is-invalid");
  }
}
function validateIsbn() {
  const isbn = document.getElementById("isbn");
  const re = /^[0-9]{6}$/;

  if (!re.test(isbn.value)) {
    isbn.classList.add("is-invalid");
  } else {
    isbn.classList.remove("is-invalid");
  }
}
