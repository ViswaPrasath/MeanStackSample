const express = require('express');

const authCheck = require('../Middleware/check-auth');
const postController = require('../Controller/post.controller');

const extractFile = require('../Middleware/multer.middleware');


const router = express.Router();

router.post('',authCheck, extractFile, postController.createPost);

router.get('', postController.getPosts);

router.get('/:postId', postController.getPost);

router.put('/:id', authCheck, extractFile, postController.updatePost );

router.delete('/:id', authCheck, postController.deletePost);


module.exports = router;