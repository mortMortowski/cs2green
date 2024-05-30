const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingsSchema = new Schema({
    user_id: Number,
    listing_date: Date,
    sell_date: Date, //optional
    item_id: Number, //it may also be a string idk
    coins: Number,
    buyer_id: Number, //optional
    status: String
});

const listings = mongoose.model("listings", listingsSchema);

module.exports = listings;