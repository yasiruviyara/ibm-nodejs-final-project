const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Import body-parser for parsing request bodies
const books = require("./booksdb.js"); // Import your books database or module

const regd_users = express.Router();
const app = express();

app.use(bodyParser.json()); // Parse application/json requests

let users = [
    {
        username: "yasiruviyara",
        password: "yasi2003",
    }
];

// Function to check if username is valid
const isValid = (username) => {
    return username && username.trim().length > 0;
};

// Function to authenticate user based on username and password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Register a new user
regd_users.post("/register", (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username or password is missing
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if username already exists
        if (users.some(user => user.username === username)) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Add new user to the users array
        users.push({ username, password });

        return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login endpoint - Generate JWT upon successful authentication
regd_users.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username or password is missing
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if user credentials are valid
        const validUser = authenticatedUser(username, password);
        if (!validUser) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ username }, 'your_jwt_secret'); // Replace 'your_jwt_secret' with a more secure secret

        // Return the token in the response
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add or modify a book review (authentication required)
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    try {
        const { isbn } = req.params; // Extract ISBN from request parameters
        const { review } = req.query; // Extract review from query parameters
        const username = req.user.username; // Extract username from authenticated user in req.user

        // Placeholder logic for adding/modifying book review
        // Here you would implement your actual logic to store or update the review in your database
        // For demonstration purposes, we'll just log the review and username
        console.log(`User '${username}' added/modified review '${review}' for ISBN '${isbn}'`);

        return res.status(200).json({ message: "Review added or modified successfully" });
    } catch (error) {
        console.error("Error adding/modifying review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete a book review (authentication required)
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    try {
        const { isbn } = req.params; // Extract ISBN from request parameters
        const username = req.user.username; // Extract username from authenticated user in req.user

        // Find the index of the review to delete based on ISBN and username
        const index = books.findIndex(book => book.isbn === isbn && book.username === username);

        if (index === -1) {
            return res.status(404).json({ message: "Review not found or you are not authorized to delete this review" });
        }

        // Remove the review from the books array
        books.splice(index, 1);

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        req.user = user; // Set the user object in the request
        next();
    });
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;