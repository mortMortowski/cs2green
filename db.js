const mongoose = require("mongoose"); //import mongoose dependency

const { MONGO_URL } = process.env; //get variable from .env file

exports.connect = () => { //db connection module

    //mongoose connection
    mongoose.connect(MONGO_URL)
    .then(() => {
        //connection succesfull
        console.log("Connected to db");
    }).catch((error) => {
        //connection error
        console.log("Failed to connect to the db");
        console.error(error); //display a red message in console instead of a normal one
        process.exit(1); //close mongoose connection
    });
}