const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../Model/user.model');

exports.signup = (req, res, next) => {
    let newUser;
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            newUser = new userModel({
                email: req.body.email,
                password: hash
            });
            newUser.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        });
};

exports.login = (req, res, next) => {
    let fetchedUser;
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid User'
                })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        }).then((result) => {
            if (!result) {
                return res.status(401).json({
                    message: "Invalid User"
                })
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                  "hey_man_secret_password_comes_here",
                { expiresIn: '1h' });
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Login Failed"
            })
        });
};