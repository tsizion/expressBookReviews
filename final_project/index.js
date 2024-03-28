const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if the session contains a user object (authenticated user)
  if (req.session && req.session.user) {
    // User is authenticated, proceed to next middleware
    next();
  } else {
    // User is not authenticated, check for access token
    const token = req.headers.authorization;
    if (token) {
      // Verify the access token
      jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
          // Token verification failed, send unauthorized response
          return res.status(401).json({ message: 'Unauthorized' });
        } else {
          // Token verification successful, store user object in session
          req.session.user = decoded.user;
          next();
        }
      });
    } else {
      // Access token not provided, send unauthorized response
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
