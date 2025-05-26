// Load environment variables
require('dotenv').config();

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');

const db = require('./config/mongoose-connection');
const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const indexRouter = require('./routes/index');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug: check if the session secret is loaded
if (!process.env.EXPRESS_SESSION_SECRET) {
    console.error("ERROR: EXPRESS_SESSION_SECRET is not defined in .env");
    process.exit(1);
}

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');




// Routers
app.use('/', indexRouter);
app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// Server start
const PORT = 5157;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
