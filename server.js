// LOADING MODULES
require("dotenv").config();
require("./db").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const User = require("./models/users");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");

// EXPRESS SETUP
const app = express();
const PORT  = 3000 || process.env.PORT;
app.use(express.static("public", {index: false}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// GLOBAL VARIABLES
let users = 0;
let defaultTime = 10; //default time in seconds for timer
let remainingTime = null;
let timerRunning = false;
let timerInterval = null;
let siteDisabled = false;
const API_KEY = "CG-q9biPNh7j5EctCQuZEvnjtvt"; //figure out later what to do with this key
const API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Clitecoin&vs_currencies=usd";

// LISTENING TO REQUESTS
const io = new Server(app.listen(PORT, () => {
    console.log("Server listening on localhost:" + PORT);
}));

// GET REQUESTS

app.get("/", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/index.html", { root: __dirname });
    }
});

app.get("/deposit", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/deposit.html", { root: __dirname });
    }
});

app.get("/withdraw", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/withdraw.html", { root: __dirname });
    }
});

app.get("/bonus", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/bonus.html", { root: __dirname });
    }
});

app.get("/about", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/about.html", { root: __dirname });
    }
});

app.get("/login", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/login.html", { root: __dirname });
    }
});

app.get("/register", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/register.html", { root: __dirname });
    }
});

app.get("/terms", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/terms.html", { root: __dirname });
    }
});

app.get("/account", (req, res) => {
    if(siteDisabled){
        res.sendFile("./public/sitedisabled.html", { root: __dirname });
    }else{
        res.sendFile("./public/account.html", { root: __dirname });
    }
});

app.get("/getcryptoprices", async (req, res) => {
    fetch(API_URL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        if(!res.ok){
            console.log("response error");
        }
        return res.json();
    }).then((data) => {
        res.send(data);
    });
});

// POST REQUESTS

app.post("/login", async (req, res) => {

    try{

        const { login, pass } = req.body;

        if(!login){
            throw new Error("Login is required");
        }

        if(!pass){
            throw new Error("Password is required");
        }

        const user = await User.findOne({ login });

        if(user && (await bcrypt.compare(pass, user.password))){

            //create token
            let tokenKey = process.env.TOKEN_KEY;
            let data = {
                username: user.username,
                id: user._id
            }
            const token = jwt.sign(data, tokenKey, { expiresIn: "1h" });
            //create refresh token or something like that later

            //create cookie
            const secureCookie = true; //enable when https is ready
            const httpOnlyCookie = true;
            const cookieOptions = {
                secure: secureCookie,
                httpOnly: httpOnlyCookie
            };
            const cookieString = cookie.serialize('token', token, cookieOptions);

            res.setHeader('Set-Cookie', cookieString);
            res.status(200).send({ text: "morenka" });
        }else{
            throw new Error("Incorrect login or password");
        }

    }catch(err){
        res.status(401).send({ errorText: err.message });
    }
});

app.post("/register", async (req, res) => {
    let error = false;
    let errorMsg = null;

    try{
        const { login, username, email, pass1, pass2 } = req.body;

        //check if values are empty

        if(!login){
            throw new Error("Login is required");
        }

        if(!email){
            throw new Error("Email is required");
        }

        if(!pass1){
            throw new Error("Password is required");
        }

        if(!pass2){
            throw new Error("Please confirm your password");
        }

        if(pass1 != pass2){
            throw new Error("Passwords don't match");
        }

        //check if values exist in db

        const oldLogin = await User.findOne({ login });
        const oldEmail = await User.findOne({ email });

        if(oldLogin){
            throw new Error("You can't use this login");
        }

        if(oldEmail){
            throw new Error("You can't use this email address");
        }

        //encrypt password

        const encryptedPassword = await bcrypt.hash(pass1, 10);

        //add user to db

        const user = new User({
            username: username,
            login: login,
            password: encryptedPassword,
            email: email.toLowerCase()
        });

        let output = await user.save();
        if(output.error){
            console.log("DB ERROR");
            console.log(output);
            throw new Error("Error. If this problem persist please contact support.");
        }

        //generate token

    }catch(err){
        error = true;
        errorMsg = err.message;
        console.log(err); //disable in production version
    }

    res.send({isError: error, errorText: errorMsg});

    if(!error){
        //redirect user to main page
    }
});

// 404 PAGE

app.use((req, res) => {
    res.sendFile("./public/404.html", { root: __dirname });
});

// SOCKET STUFF

io.on("connection", (socket) => {
    users++;
    io.emit("user change", users); //when new user connects

    socket.on("disconnect", () => {
        users--;
        io.emit("user change", users); //when a user disconnects
    });

    socket.on("chat message", (msg) => {
        socket.broadcast.emit("chat message", msg); //when user sends a message
    });

    socket.on("start timer", () => {
        setTimer();
    });

    //io.emit("spin roulette", "number"); //do this when the animation is ready
});

//FUNCTIONS

function setTimer(){
    console.log(timerRunning);
    if(timerRunning){
        console.log("timer is already running");
    }else{
        generateRandomNumber(); //generate random number
        timerRunning = true;
        remainingTime = defaultTime;
        io.emit("roulette time", remainingTime); //send time to clients
        timerInterval = setInterval(() => {
            remainingTime--;
            if(remainingTime <= 0){
                clearInterval(timerInterval);
                console.log("timer finished");
                timerRunning = false;
                //send 0 time to clients so both timers are in sync
                io.emit("set roulette time", remainingTime);
                //stop placing bets
                //finalize placed bets
                //send number to client
            }
        }, 1000);
    }
}

function generateRandomNumber(){
    console.log("currently it does nothing");
}