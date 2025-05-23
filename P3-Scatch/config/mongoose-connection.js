const mongoose = require('mongoose');
const config = require('config');
const debugr = require('debug')('development:mongoose');
 

mongoose.connect(`${config.get("MongoDB_URI")}/scatch`).then(() => {
    debugr('MongoDB connected');

}).catch((err) => {
    debugr
    ('MongoDB connection error:', err);
});

module.exports = mongoose.connection;