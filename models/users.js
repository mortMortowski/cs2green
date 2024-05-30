const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema and Model

const usersSchema = new Schema({
    username: { type: String, default: null, unique: true }, //optional
    login: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    coins: {type: Number, default: 1000},
    privilege: {type: String, default: "normal"},
    register_date: {type: Date, default: Date.now},
    banned: {type: Boolean, default: false},
    muted: {type: Boolean, default: false},
    locked_shop: {type: Boolean, default: false},
    steam_id: {type: String, unique: true, default: null},
    level: {type: Number, default: 0},
    totalBet: {type: Number, default: 0}
});

const users = mongoose.model('users', usersSchema);

module.exports = users;