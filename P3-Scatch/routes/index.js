const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Product = require('../models/product-model'); // Import your product model

router.get('/', (req, res) => {
    let error = req.flash('error');
    res.render('index' , {error});
});

router.post('/register', async (req, res) => {  
    try{  
    let { email, password,  fullname } = req.body;
    let user = await userModel.create({
        email,
        password,
        fullname,

    });
    res.send(user);
    }
    catch (error) {
        console.error(error.message);
    }
});

// In your routes file (likely indexRouter.js)

router.get('/shop', isLoggedIn, async function(req, res) {
    try {
        const products = await Product.find(); // Fetch products from database
        res.render('shop', { products }); // Pass products to the view
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
// This is the main router for the application.