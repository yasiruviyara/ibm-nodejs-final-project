const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    try {
        // Simulate fetching books from a database or external API
        // In this case, we're using the booksData object directly
        let allBooks = Object.values(books); // Convert books object to array of values
        res.status(200).json(allBooks);
      } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
        const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    
        // Check if the book exists in your books data
        if (!books[isbn]) {
          return res.status(404).json({ message: "Book not found" });
        }
    
        // If found, return the book details
        res.status(200).json(books[isbn]);
      } catch (error) {
        console.error("Error retrieving book details by ISBN:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try {
        const author = req.params.author; // Retrieve author from request parameters
    
        // Filter books based on author
        let booksByAuthor = Object.values(books).filter(book => book.author === author);
    
        // Check if books by author were found
        if (booksByAuthor.length === 0) {
          return res.status(404).json({ message: "Books by author not found" });
        }
    
        // If found, return the books
        res.status(200).json(booksByAuthor);
      } catch (error) {
        console.error("Error retrieving books by author:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try {
    const title = req.params.title; // Retrieve title from request parameters

    // Filter books based on title
    let booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

    // Check if books by title were found
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "Books with title not found" });
    }

    // If found, return the books
    res.status(200).json(booksByTitle);
  } catch (error) {
    console.error("Error retrieving books by title:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters

    // Check if the book exists in your books data
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Retrieve the reviews for the book
    const bookReviews = books[isbn].reviews;

    // Return the reviews as JSON response
    res.status(200).json(bookReviews);
  } catch (error) {
    console.error("Error retrieving book reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.general = public_users;
