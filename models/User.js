const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    passwrod: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User' , UserSchema)