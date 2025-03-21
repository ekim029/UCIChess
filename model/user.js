const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    finalFen: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    moves: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    game: [gameSchema]
})

module.exports = mongoose.model('User', userSchema);