const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawsSchema = new Schema({
    user_id: Number,
    type: String,
    coin: String, //optional
    coin_amount: Number, //optional
    amount: Number,
    date: Date,
    status: String
});

const withdraws = mongoose.model("withdraws", withdrawsSchema);

module.exports = withdraws;