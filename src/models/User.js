const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    relStatus: {
        type: String,
        required: true
    },
    relAge: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('users', UserSchema)

module.exports = User