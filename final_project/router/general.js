const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/");
    const books = response.data;
    res.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

public_users.get("/isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;

  try {
    const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
    const book = response.data;

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(
      `http://localhost:3000/author?author=${author}`
    );
    const booksByAuthor = response.data;

    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found for the author" });
    }
  } catch (error) {
    console.error("Error fetching books by author:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const booksWithTitle = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (booksWithTitle.length > 0) {
      res.json(booksWithTitle);
    } else {
      res.status(404).json({ message: "No books found with the title" });
    }
  } catch (error) {
    console.error("Error fetching books by title:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    if (book.reviews && Object.keys(book.reviews).length > 0) {
      res.json({ reviews: book.reviews });
    } else {
      res.json({ message: "No reviews found for this book" });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
