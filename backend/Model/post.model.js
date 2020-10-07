const mongoose = require('mongoose');

const schema = mongoose.Schema;

const postSchema = new schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;
