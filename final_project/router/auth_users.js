const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const filtered = users.filter((user) => {return user.username === username;} );
  return filtered.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let valid = users.filter((user) => {return user.username === username && user.password === password;});
  return valid.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.passwordl;
  if(!username || !password){
    return res.status(404).json({message:"Error logging in"});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data:password
    }, 'access', {expiresIn:60*60});
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message:"User successfully logged in"});
  }else{
  return res.status(208).json({message: "Invalid Login"});

  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({
      message: "Review not found for this user"
    });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
