//Book Constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//UI Constructor
class UI {
  //add book to the list
  addBookToList(book) {
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
  }
  //show alert
  showAlert(message, className) {
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
  }
  //delete book from list
  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
  //clear fields on the list
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

//Local Storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") == null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books")); //makes it a js object
    }
    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();

      //add book to the ui
      ui.addBookToList(book);
    });
  }
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    //loop through the books
    books.forEach(function (book, index) {
      if (book.isbn == isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//DOM load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//Event listener to add book @ the submit button
document.getElementById("book-form").addEventListener("submit", function (e) {
  //Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  //create an instance of book from the book constructor in the beginning
  const book = new Book(title, author, isbn);

  //create an instance of the ui class
  const ui = new UI();

  //ensure all parts of the form is filled
  if (title === "" || author === "" || isbn === "") {
    //error alert
    ui.showAlert("Fill in all fields", "error");
  } else {
    //add book to list
    ui.addBookToList(book);

    //Add book to local storage
    Store.addBook(book);

    //show success
    ui.showAlert("Book added", "success");

    //clear fields
    ui.clearFields();
  }
  e.preventDefault();
});

//event listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  //create new UI instance
  const ui = new UI();

  //call delete book from the ui
  ui.deleteBook(e.target);

  //remove the element (on the table, in this case the td tag before the td tag with the delete link(a) tag from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //shows message
  ui.showAlert("removed", "success");

  e.preventDefault();
});
