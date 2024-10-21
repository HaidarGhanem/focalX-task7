const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    username: {
        type: String,
        required: false
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('Comment', CommentSchema)