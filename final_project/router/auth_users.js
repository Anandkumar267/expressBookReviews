const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Task 6 helper: check if username already exists
const isValid = (username) => {
  const filtered = users.filter((user) => user.username === username);
  return filtered.length > 0;
};

// Task 7 helper: check username + password match
const authenticatedUser = (username, password) => {
  let valid = users.filter(
    (user) => user.username === username && user.password === password
  );
  return valid.length > 0;
};

// Task 7 — Login as a registered user
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Sign a JWT and save it in the session
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Customer successfully logged in", accessToken });
});

// Task 8 — Add or modify a book review (requires auth via session)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // set by auth middleware in index.js

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // If same user reviews same ISBN again, it overwrites; otherwise adds a new entry
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} added/updated successfully`,
    reviews: books[isbn].reviews,
  });
});

// Task 9 — Delete a book review (only the logged-in user's own review)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user on this book" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review by ${username} for ISBN ${isbn} deleted successfully`,
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
