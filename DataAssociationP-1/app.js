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

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/register', async (req, res) => {
  const { username, name, age, email, password } = req.body;
   let user = await userModel.findOne({ email: email })

   if (user) return res.status(400).send('User already exists'); 

   bcrypt.genSalt(10, (err, salt) => {
bcrypt.hash(password, salt, async (err, hash) => {
    let user = await userModel.create({
        username: username,
        name: name,
        age: age,
        email: email,
        password: hash
    })
    let token = jwt.sign({
        email: email, userid: user._id, },"secretkey")
        res.cookie('token', token)
        res.send('User registered successfully');
})

})

});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email: email })
  if (!user) return res.status(400).send('Something went wrong'); 

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
        let token = jwt.sign({
            email: email, userid: user._id, },"secretkey")
            res.cookie('token', token)
            res.send('User logged in successfully');
        } else {
        res.status(400).send('Invalid credentials');
        }
    })

})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});