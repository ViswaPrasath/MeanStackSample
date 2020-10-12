const postModel = require('../Model/post.model');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new postModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then((createdPost) => {
        res.status(201).json({
            message: "post Added",
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    })
        .catch(err => res.status(500).json({
            message: "Create Post Failed!"
        }));
};


exports.getPosts = (req, res, next) => {
    console.log(req.params);
    const pageSize = +req.query.pagesize;
    const page = +req.query.page;
    const postQuery = postModel.find();
    let fetchedPost;
    if (pageSize && page) {
        postQuery.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
    }
    postQuery.find()
        .then(documents => {
            fetchedPost = documents;
            return postModel.estimatedDocumentCount();
        })
        .then(count => {
            res.status(200).json({
                message: "Post sent successfully",
                posts: fetchedPost,
                maxPost: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong, try again"
            })
        });
};


exports.getPost = (req, res, next) => {
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
        }).catch(err => {
            res.status(500).json({
                message: "Something went wrong, try again"
            })
        });
};


exports.updatePost = (req, res, next) => {
    const id = req.params.id;
    let imagePath = req.body.imagePath;
    console.log(imagePath);
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new postModel({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    console.log(post);
    postModel.updateOne({ _id: id, creator: req.userData.userId }, post)
        .then(result => {
            console.log(result)
            if (result.n > 0) {
                res.status(200).json({
                    message: "post updated",
                    post: post
                });
            } else {
                res.status(401).json({ error: "Not Authorized" });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Update failed!!"
            })
        })
};


exports.deletePost = (req, res, next) => {
    postModel.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then((result) => {
            if (result.n > 0) {
                res.status(200).json({
                    message: "Post Deleted"
                });
            } else {
                res.status(401).json({ error: "Not Authorized" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Oops,Something went wrong..Try again"
            })
        });
};