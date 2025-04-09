const jwt = require ('jsonwebtoken');
const credentials = require('../config/credentials');

module.exports = (req, res, next) => {
    const token = req.headers['x-observatory-auth'];
    const decoded = jwt.verify(token, credentials.secret);
    if (decoded.username != credentials.admin.username) {
        return res.status(401).json({
            message: "Auth failed. Admin privilages required."
        });
    }
    else next();
}