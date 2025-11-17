require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const User = require('./models/User');

const app = express();

// Passport config
require('./config/passport')(passport);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.get('/', (req, res) => res.redirect('/login'));
// Register page
app.get('/register', (req, res) => res.render('register'));

// Handle registration
app.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;
  let errors = [];

  if (!username || !password || !password2) errors.push({ msg: 'Please fill all fields' });
  if (password !== password2) errors.push({ msg: 'Passwords do not match' });
  if (errors.length > 0) return res.render('register', { errors, username });

  const userExists = await User.findOne({ username });
  if (userExists) {
    errors.push({ msg: 'Username already exists' });
    return res.render('register', { errors, username });
  }

  const newUser = new User({ username, password });
  await newUser.save();
  req.flash('success_msg', 'You are now registered and can log in');
  res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => res.render('login'));

// Handle login
app.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureFlash: true,
}));
const books = [
  { title: 'Book 1', author: 'Author 1' },
  { title: 'Book 2', author: 'Author 2' },
];

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error_msg', 'Please log in to view this resource');
  res.redirect('/login');
}

app.get('/books', ensureAuthenticated, (req, res) => {
  res.render('books', { user: req.user, books });
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
