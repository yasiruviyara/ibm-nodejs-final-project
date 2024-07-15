const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Session middleware setup for '/customer' routes
app.use("/customer", session({
  secret: "fingerprint_customer", // Session secret, change as needed
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for '/customer/auth/*' routes using JWT
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check for authorization header with JWT token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Verify JWT token
  if (token == null) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next(); // Pass control to the next middleware/route handler
  });
});

// Mounting customer and general routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
