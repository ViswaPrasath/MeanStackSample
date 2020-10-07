const express = require('express');

const postModel = require('../Model/post.model');

const router = express.Router();

router.post('', (req, res, next) => {
    const post = new postModel({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then((createdPost) => {        
        res.status(201).json({
            message: "post Added",
            postId: createdPost._id
        });
    })
 });

router.get('',(req, res, next) => {
    postModel.find()
        .then(document => {
            res.status(200).json({
                message: "Post sent successfully",
                posts: document
            });
        })
        .catch(error => {
            console.log(error.message)
        });    
});

router.get('/:postId', (req, res, next) => {
    const id = req.params.postId;
    postModel.findById(id)
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: "post fetched",
                    post: result
                });
            } else {
                res.status(404).json({
                    message: "post not found"
                })
            }
        });
});

router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    const post = new postModel({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    
    postModel.updateOne({ _id: id }, post)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "post updated",
                post: post
            });
        })
        .catch( err => console.log(err.message))
});

router.delete('/:id', (req, res, next) => {
    postModel.deleteOne({ _id: req.params.id })
        .then((result) => {
            console.log(result)
            res.status(200).json({
                message: "Post Deleted"
            });
        })
        .catch((error) => {
            console.log(error.message)
        });
});


module.exports = router;