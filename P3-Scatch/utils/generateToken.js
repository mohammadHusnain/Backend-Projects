const jwt = require('jsonwebtoken');

const generateToken = (user) => {
return jwt.sign(
    { id: user._id, email: user.email },
process.env.JWT_KEY || 'default_jwt_secret_key',
    {
        expiresIn: '1h', // Token expiration time
    }
);
}

module.exports.generateToken = generateToken;