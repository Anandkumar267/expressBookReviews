const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=  req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message:"Unable to register user."});
  }
  if(isValid(username)){
    return res.status(404).json({
      message: "User already exists"
    });
  }
  users.push({username:username,password:password});
    return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let filteredBooks = [];

  for (let key in books) {

    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }

  }

  return res.json(filteredBooks);
});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  for(let k in book){
    if(books[k]['author'] === req.params.author){
      res.send(JSON.stringify(books[k],  null, 4));
    }
  }
  return res.status(404).json({message:"Book not found"});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let filtered_books = [];
  for (let key in books){
    if(books[key]['title'] === req.params.title){
      filtered_books.push(books[key]);

    }
  }
  return res.json(filtered_books);
  return res.status(404).json({message:"Book not found"});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.json(books[isbn].reviews);
  }
  return res.status(404).json({message:"Book not found"});
});

module.exports.general = public_users;
