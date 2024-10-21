const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' 
    }]
})

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    videos: [VideoSchema] 
})

module.exports = mongoose.model('Course' , CourseSchema)