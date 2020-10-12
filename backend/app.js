const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const postRouter = require('./Routes/post.route');
const userRouter = require('./Routes/user.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join('backend/images')));

require('./initDB')();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin,Content-type,Accept,X-Requested-With,Authorization");
    res.setHeader("Access-Control-Allow-Methods", "POST,PATCH,DELETE,GET,OPTIONS,PUT");
    next();    
});

app.use('/api/posts',postRouter);
app.use('/api/user', userRouter);

module.exports = app;