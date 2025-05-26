const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/scatch')

const userSchema = new mongoose.Schema({
    fullname:{
        type : String,
        minLength : 3,
        trim : true,
    } ,
    
    email: String,
     
    password: String,
       
    cart: {
        type: Array,
        default: []
    },
   
    order: {
        type: Array,
        default: []
    },
    contact: Number,

    picture: String,
});

module.exports = mongoose.model('user', userSchema);