const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/profile', isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.user._id })
      .populate({
        path: 'posts',
        options: { sort: { date: -1 } } // Newest first
      });
    
    // Add the logged-in user's ID to the view data
    res.render('profile', { 
      user: user,
      currentUserId: req.user._id.toString() // Add this line
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/createpost', isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let { content } = req.body;
    
    let post = await postModel.create({
      user: user._id,
      content: content,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findOne({ _id: req.params.id });
    if (!post) return res.status(404).send('Post not found');

    const userId = req.user._id.toString(); // Convert to string

    // Initialize likes array if needed
    if (!post.likes) post.likes = [];

    // Check if user already liked the post
    const userLikedIndex = post.likes.indexOf(userId);

    if (userLikedIndex === -1) {
      // Add like
      post.likes.push(userId);
    } else {
      // Remove like
      post.likes.splice(userLikedIndex, 1);
    }

    await post.save();
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    const post = await postModel.findOne({ _id: req.params.id }).populate('user');
   res.render('edit' , { post });
});

app.post('/update/:id', isLoggedIn, async (req, res) => {
    const post = await postModel.findOneAndUpdate({ _id: req.params.id } , {content: req.body.content}).populate('user');
   res.redirect('/profile');
});

app.post('/register', async (req, res) => {
  try {
    const { username, name, age, email, password } = req.body;
    let user = await userModel.findOne({ email: email });

    if (user) return res.status(400).send('User already exists');

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
          username: username,
          name: name,
          age: age,
          email: email,
          password: hash
        });

        let token = jwt.sign({
          email: email,
          _id: user._id  // Using _id consistently
        }, "secretkey");

        res.cookie('token', token);
        res.redirect('/profile');
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email: email });

    if (!user) return res.status(400).send('Invalid credentials');

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = jwt.sign({
          email: email,
          _id: user._id  // Using _id consistently
        }, "secretkey");

        res.cookie('token', token);
        res.redirect('/profile');
      } else {
        res.status(400).send('Invalid credentials');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Middleware to protect routes
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const data = jwt.verify(token, 'secretkey');
    req.user = data; // decoded user payload from token
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.redirect('/login');
  }
}

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});