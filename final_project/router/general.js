const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 6 — Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// ─── SYNC ROUTES (Tasks 1-5) ────────────────────────────────────────────────

// Task 1 — Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2 — Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 3 — Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Task 4 — Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 5 — Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// ─── ASYNC / AXIOS ROUTES (Tasks 10-13) ─────────────────────────────────────

// Task 10 — Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json({
      source: "async/axios",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11 — Get book by ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return res.status(200).json({
      source: "async/axios",
      data: response.data,
    });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : error.message;
    return res.status(status).json({ message: "Error fetching book by ISBN", error: message });
  }
});

// Task 12 — Get books by author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return res.status(200).json({
      source: "async/axios",
      data: response.data,
    });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : error.message;
    return res.status(status).json({ message: "Error fetching books by author", error: message });
  }
});

// Task 13 — Get books by title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return res.status(200).json({
      source: "async/axios",
      data: response.data,
    });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : error.message;
    return res.status(status).json({ message: "Error fetching books by title", error: message });
  }
});

module.exports.general = public_users;
