const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if username is not empty and does not contain spaces
    return username && !/\s/.test(username);
}
const authenticatedUser = (username, password) => {
    // Find the user by username
    const user = users.find(user => user.username === username);
    // Check if user exists and password matches
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    // Check if user is authenticated
    if (authenticatedUser(username, password)) {
        // Generate JWT token
        const token = jwt.sign({ username }, 'secret');
        return res.status(200).json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.session.username; // Extract username from session

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: 'Review is required' });
    }

    // Find the book by ISBN
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the user has already reviewed the book
    if (book.reviews && book.reviews[username]) {
        // Modify existing review
        book.reviews[username].comment = review;
    } else {
        // Add new review
        if (!book.reviews) {
            book.reviews = {};
        }
        book.reviews[username] = { user: username, comment: review };
    }

    // Return success message
    return res.status(200).json({ message: 'Review added/modified successfully' });
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.user; // Extract username from authenticated user

    // Find the book by ISBN
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the user has a review for the book
    if (book.reviews && book.reviews[username]) {
        // Delete the user's review
        delete book.reviews[username];
        return res.status(200).json({ message: 'Review deleted successfully' });
    } else {
        return res.status(404).json({ message: 'Review not found' });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
