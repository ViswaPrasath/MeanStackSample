const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
       return  res.status(401).json({ message: "Auth token missing" });
    }
    
    const token = req.headers.authorization.split(" ")[1];
  
    jwt.verify(token,"hey_man_secret_password_comes_here", (err, payload) => {
        if (err) {
            return res.status(401).json({ message: "Invalid Authentication Credentials!!", error: err });
        }
        const decodedData = payload;
        req.userData = { email: decodedData.email, userId: decodedData.userId };
        next();
    });
}