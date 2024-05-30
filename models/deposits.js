const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const depositsSchema = new Schema({
    user_id: Number,
    type: String,
    coin: String, //optional
    coin_amount: Number, //optional
    amount: Number,
    date: Date,
    status: String
});

const deposits = mongoose.model("deposits", depositsSchema);

module.exports = deposits;