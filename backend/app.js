
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const postRouter = require('./Routes/post.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./initDB')();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin,Content-type,Accept,X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "POST,PATCH,DELETE,GET,OPTIONS,PUT");
    next();    
});

app.use('/api/posts',postRouter);

module.exports = app;