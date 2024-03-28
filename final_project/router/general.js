const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Route for user registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Add the new user to the list of users
    users.push({ username, password });

    // Return success message
    return res.status(200).json({ message: 'User registered successfully' });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Make a GET request to fetch the list of books
        const response = await axios.get('http://localhost:3000/');

        // Extract the books from the response data
        const books = response.data;

        // Send the books as the response
        res.json({ books });
    } catch (error) {
        // Handle errors
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;

    try {
        // Make a GET request to fetch the book details based on ISBN
        const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);

        // Extract the book details from the response data
        const book = response.data;

        // If the book exists, send its details as the response
        if (book) {
            res.json(book);
        } else {
            // If the book does not exist, send a 404 Not Found response
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        // Handle errors
        console.error('Error fetching book details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        // Make a GET request to fetch the books by the specified author
        const response = await axios.get(`http://localhost:3000/author?author=${author}`);

        // Extract the books by the author from the response data
        const booksByAuthor = response.data;

        // If books were found for the author, send their details as the response
        if (booksByAuthor.length > 0) {
            res.json(booksByAuthor);
        } else {
            // If no books were found, send a 404 Not Found response
            res.status(404).json({ message: 'No books found for the author' });
        }
    } catch (error) {
        // Handle errors
        console.error('Error fetching books by author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get book details based on title using async-await with Axios
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        // Make a GET request to fetch the books with the specified title
        const response = await axios.get(`http://tocalhost:3000/title/?title=${title}`);

        // Extract the books with the specified title from the response data
        const booksByTitle = response.data;

        // If books were found with the title, send their details as the response
        if (booksByTitle.length > 0) {
            res.json(booksByTitle);
        } else {
            // If no books were found, send a 404 Not Found response
            res.status(404).json({ message: 'No books found with the title' });
        }
    } catch (error) {
        // Handle errors
        console.error('Error fetching books by title:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Find the book details based on the ISBN
    const book = books[isbn];
    
    // Check if the book exists
    if (book) {
        // Check if the book has reviews
        if (book.reviews && Object.keys(book.reviews).length > 0) {
            // If the book has reviews, send them as the response
            res.json({ reviews: book.reviews });
        } else {
            // If the book does not have any reviews, send a message indicating so
            res.json({ message: 'No reviews found for this book' });
        }
    } else {
        // If the book does not exist, send a 404 Not Found response
        res.status(404).json({ message: 'Book not found' });
    }
});




module.exports.general = public_users;
