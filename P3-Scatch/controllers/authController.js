const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(401).send('User already exists. Please login.');
        }

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return res.status(500).send(err.message);

            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.status(500).send(err.message);

                try {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });

                    let token = generateToken(user);
                    res.cookie('token', token);
                    res.send('User created successfully');
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send('User creation failed');
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/');
    }

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie('token', token);
            return res.redirect('/shop'); // ✅ Redirect to /shop after successful login
        } else {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/');
        }
    });
};

 