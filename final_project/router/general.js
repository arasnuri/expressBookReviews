const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // If the username doesn't exist, add the new user
  const newUser = { username, password };
  users.push(newUser);

  // Send a success message
  res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    resolve(books);
  }).then((books) => {
    res.send(JSON.stringify(books, null, 4));
  }, (err) => {
    reject(err);
    res.status(500).json({ message: "Error getting books", error: err });
  });
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    resolve(books[isbn]);
  }).then((books) => {
    res.send(books[isbn]);
  }, (err) => {
    reject(err);
    res.status(500).json({ message: "Error getting books", error: err });
  });
  
 });
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  // Obtain the author from the request parameters
  const author = req.params.author;

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Initialize an array to hold books by the specified author
  let booksByAuthor = [];

  // Iterate through the 'books' object
  for (let i = 0; i < bookKeys.length; i++) {
    // Check if the author of the current book matches the one provided in the request parameters
    if (books[bookKeys[i]].author === author) {
      // If it matches, add the book to the 'booksByAuthor' array
      booksByAuthor.push(books[bookKeys[i]]);
    }
  }
  new Promise((resolve, reject) => { 
    resolve(booksByAuthor);
  }).then((books) => {
    res.send(JSON.stringify(booksByAuthor, null, 4));
  }, (err) => {
    reject(err);
    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here

  // Obtain the title from the request parameters 
  const title = req.params.title;

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Initialize an array to hold books with the specified title
  let booksByTitle = [];

  // Iterate through the 'books' object
  for (let i = 0; i < bookKeys.length; i++) {
    // Check if the title of the current book matches the one provided in the request parameters
    if (books[bookKeys[i]].title === title) {
      // If it matches, add the book to the 'booksByTitle' array
      booksByTitle.push(books[bookKeys[i]]);
    }
  }

 
  // Send the response with the 'booksByTitle' array as the payload 
  res.send(JSON.stringify(booksByTitle, null, 4));
  new Promise((resolve, reject) => {
    resolve(booksByTitle);
  }).then((books) => {
    res.send(JSON.stringify(booksByTitle, null, 4));
  }, (err) => {
    reject(err);
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
