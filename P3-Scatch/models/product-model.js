const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0  // Ensures price isn't negative
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0,  // Properly typed default value
        min: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Product', productSchema);