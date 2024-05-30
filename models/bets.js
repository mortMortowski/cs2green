const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const betsSchema = new Schema({
    user_id: Number,
    color: String,
    amount: Number,
    date: Date,
    result: Number, //optional
    hash: String, //optional
    status: String
});

const bets = mongoose.model('bets', betsSchema);

module.exports = bets;