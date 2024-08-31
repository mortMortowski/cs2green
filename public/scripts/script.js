//BUTTONS
let testSpinBtn = document.getElementById("test-spin-btn");
let randomSpinBtn = document.getElementById("random-spin-btn");
//let startTimerBtn = document.getElementById("start-timer-btn");
//let stopTimerBtn = document.getElementById("stop-timer-btn");
let addChatBtn = document.getElementById("add-chat-btn");
let addBetBtn = document.getElementById("add-bet-btn");
let addHistoryBtn = document.getElementById("add-history-btn");
let clearBtn = document.getElementById("clear-btn");
let btn10 = document.getElementById("10-btn");
let btn100 = document.getElementById("100-btn");
let btn1000 = document.getElementById("1000-btn");
let halfBtn = document.getElementById("half-btn");
let btn2x = document.getElementById("2x-btn");
let maxBtn = document.getElementById("max-btn");
let closeBtn = document.querySelectorAll(".close-btn");
let playerInfoSpan = document.querySelectorAll(".player-info");

//DOM ELEMENTS
let rouletteTiles = document.getElementsByClassName("roulette-tiles")[0];
let timerContainer = document.getElementsByClassName("timer-text")[0];
let chatMessages = document.getElementsByClassName("messages")[0];
let timerFilling = document.getElementsByClassName("timer-filling")[0];
let redPlayerList = document.getElementsByClassName("red-bet-players")[0];
let greenPlayerList = document.getElementsByClassName("green-bet-players")[0];
let blackPlayerList = document.getElementsByClassName("black-bet-players")[0];
let betInput = document.getElementsByClassName("bet-input")[0];
let history = document.getElementsByClassName("history")[0];
let chatForm = document.getElementById("form-chat");
let chatInput = document.getElementById("input-chat");
let playerCount = document.getElementsByClassName("online-players")[0];
let serverForm1 = document.getElementById("server-test"); //delete later
let disableBackground = document.getElementsByClassName("disable-background")[0];
let errorWindow = document.getElementsByClassName("error-window")[0];
let roundInfo = document.getElementsByClassName("round-info")[0];
let playerInfo = document.getElementsByClassName("player-info-div")[0];
let roulette = document.getElementsByClassName("roulette")[0];

//GLOBAL VARIABLES

let defaultTime = 10; //starting time in seconds for timer
let remainingTime = null;
let timerRunning = false;
let timerInterval = null;
let balance = 666;

//EVENT LISTENERS

testSpinBtn.addEventListener('click', () => {
    let testSpinNumber = document.getElementsByClassName("test-spin-number")[0].value;
    testSpinNumber = parseInt(testSpinNumber);
    if(testSpinNumber < 0 || testSpinNumber > 14){
        alert("Number out of range");
    }else{
        rollAnimation(8000, "ease", "forwards", testSpinNumber);
    }
});

randomSpinBtn.addEventListener('click', () => {
    let randomNumber = Math.floor(Math.random() * 15);
    console.log("number generated: ", randomNumber);
    rollAnimation(8000, "ease", "forwards", randomNumber);
});

/*
startTimerBtn.addEventListener('click', () => {
    setTimer();
});
*/

/*
stopTimerBtn.addEventListener('click', () => {
    if(timerRunning){
        clearInterval(timerInterval);
        console.log("timer stopped");
        timerContainer.textContent = "timer stopped";
        timerRunning = false;
    }else{
        console.log("timer is already stopped");
        addMessage("img/system.png", "System", "timer is already stopped");
    }
});
*/

addChatBtn.addEventListener('click', () => {
    for(let i=0; i<10; i++){
        addMessage("img/player.png", "pietrek", "witam na morence");
    }
});

addBetBtn.addEventListener('click', () => {
    for(let i=0; i<15; i++){
        let columnNumber = Math.floor(Math.random() * 3);
        addBettor(columnNumber, "img/player.png", "pietrek", 250);
    }
});

addHistoryBtn.addEventListener('click', () => {
    let randomNumber = Math.floor(Math.random() * 15);
    addToHistory(randomNumber);
});

clearBtn.addEventListener('click', () => {
    changeBetAmount(0);
});

btn10.addEventListener('click', () => {
    changeBetAmount(10);
});

btn100.addEventListener('click', () => {
    changeBetAmount(100);
});

btn1000.addEventListener('click', () => {
    changeBetAmount(1000);
});

halfBtn.addEventListener('click', () => {
    changeBetAmount(0.5);
});

btn2x.addEventListener('click', () => {
    changeBetAmount(2);
});

maxBtn.addEventListener('click', () => {
    changeBetAmount(666);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(chatInput.value){
        socket.emit("chat message", chatInput.value);
        addMessage("img/player.png", "Pietrek", chatInput.value);
        chatInput.value = "";
    }
});

serverForm1.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit("start timer");
}); //delete later

closeBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        disableBackground.style.display = "none";
        roundInfo.style.display = "none";
        playerInfo.style.display = "none";
    });
});

playerInfoSpan.forEach((btn) => {
    btn.addEventListener('click', () => {
        disableBackground.style.display = "block";
        playerInfo.style.display = "block";
    });
});

//FUNCTIONS

function rollAnimation(duration, timingFunction, fillMode, number){

    timerContainer.textContent = "Rolling...";

    let pixels = 0; //the amount of pixels a wheel has to move

    if(number == 0){ //assign the correct pixel amount depending on choosen number
        pixels = 5350;
    }else if(number == 1){
        pixels = 4550;
    }else if(number == 2){
        pixels = 4750;
    }else if(number == 3){
        pixels = 5000;
    }else if(number == 4){
        pixels = 5220;
    }else if(number == 5){
        pixels = 3900;
    }else if(number == 6){
        pixels = 4100;
    }else if(number == 7){
        pixels = 4310;
    }else if(number == 8){
        pixels = 4450;
    }else if(number == 9){
        pixels = 4200;
    }else if(number == 10){
        pixels = 4000;
    }else if(number == 11){
        pixels = 5450;
    }else if(number == 12){
        pixels = 5100;
    }else if(number == 13){
        pixels = 4900;
    }else{
        pixels = 4700;
    }

    rouletteTiles.animate([
        {
            right: "230px"
        },
        {
            right: pixels + "px"
        }
    ],
    {
        duration: duration,
        easing: timingFunction,
        fill: fillMode
    });
}

function drawTimer(remainingTime){
    if(remainingTime <= 0){
        timerContainer.textContent = "Rolling...";
    }
    timerContainer.textContent = "Rolling in " + remainingTime + " seconds";
    timerFilling.style.width = remainingTime + "0%";
}

function addMessage(img, name, msg){
    let message = document.createElement("div");
    message.classList.add("message");

    let messageImg = document.createElement("img");
    messageImg.src = img;
    messageImg.alt = name;
    messageImg.classList.add("message-img");

    let messageName = document.createElement("div");
    messageName.classList.add("message-username");
    messageName.textContent = name;

    let messageText = document.createElement("div");
    messageText.classList.add("message-content");
    messageText.textContent = msg;

    let clearingDiv = document.createElement("div");
    clearingDiv.classList.add("clear");

    message.appendChild(messageImg);
    message.appendChild(messageName);
    message.appendChild(messageText);
    message.appendChild(clearingDiv);
    chatMessages.appendChild(message);
}

function addBettor(columnNumber, img, name, amount){
    let playerDiv = document.createElement("div");
    let playerInfo = document.createElement("div");
    let playerImg = document.createElement("img");
    let playerName = document.createElement("div");
    let playerAmount = document.createElement("div");

    playerDiv.classList.add("player");

    playerInfo.classList.add("player-info");

    playerImg.src = img;
    playerImg.alt = name;
    playerImg.classList.add("player-img");

    playerName.classList.add("player-name");
    playerName.textContent = name;

    playerAmount.classList.add("player-amount");
    playerAmount.textContent = amount;

    playerDiv.appendChild(playerInfo);
    playerInfo.appendChild(playerImg);
    playerInfo.appendChild(playerName);
    playerDiv.appendChild(playerAmount);

    if(columnNumber == 0){
        redPlayerList.appendChild(playerDiv);
    }else if(columnNumber == 1){
        greenPlayerList.appendChild(playerDiv);
    }else{
        blackPlayerList.appendChild(playerDiv);
    }
}

function changeBetAmount(amount){
    if(betInput.value == ""){
        betInput.value = 0;
    }

    let inputAmount = parseInt(betInput.value);

    if(amount == 0 || amount == 0.5 || amount == 2){
        inputAmount *= amount;
        betInput.value = inputAmount;
    }else if(amount == 666){
        inputAmount = balance;
        betInput.value = inputAmount;
    }else{
        inputAmount += amount;
        betInput.value = inputAmount;
    }
}

function addToHistory(number){
    if(history.childElementCount >= 10){
        history.removeChild(history.firstElementChild);
    }

    let historyDiv = document.createElement("div");
    historyDiv.classList.add("history-circle");
    historyDiv.onclick = function() {showRoundInfo();};
    historyDiv.textContent = number;
    if(number == 0){
        historyDiv.classList.add("history-green");
    }else if(number >=1 && number <= 7){
        historyDiv.classList.add("history-red");
    }else{
        historyDiv.classList.add("history-black");
    }
    history.appendChild(historyDiv);
}

function setTimer(time){
    if(timerRunning){
        console.log("timer is already running");
    }else{
        timerRunning = true;
        remainingTime = time;
        drawTimer(remainingTime);
        timerInterval = setInterval(() => {
            remainingTime--;
            drawTimer(remainingTime);
            if(remainingTime <= 0){
                clearInterval(timerInterval);
                console.log('timer finished');
                timerRunning = false;
                timerContainer.textContent = "Rolling...";
            }
        }, 1000);
    }
}

function updateTimer(time){
    remainingTime = time;
    drawTimer(remainingTime);
}

function showRoundInfo(){
    disableBackground.style.display = "block";
    roundInfo.style.display = "block";
}

function makeBet(){
    showError("You must be logged in to place a bet!")
}

function showError(message){
    errorWindow.textContent = message;
    errorWindow.style.display = "block";
    setTimeout(() => {
        errorWindow.style.display = "none";
        errorWindow.textContent = "";
    },5000);
}

function alignRoulette(){ //call this function on every page resize
    let rouletteWidth = roulette.offsetWidth;
    //rouletteTiles.style.right = rouletteWidth - 10% + "px";
}

//number colors
//red from 1 to 7
//black from 8 to 14
//green is 0

//SOCKET LISTENERS

socket.on("chat message", (msg) => {
    addMessage("img/player.png", "Pietrek", msg);
}); //listen for new messages

socket.on("user change", (users) => {
    playerCount.textContent = users;
}); //listen for player counter change

socket.on("spin roulette", (nmbr) => {
    rollAnimation(8000, "ease", "forwards", nmbr);
}); //listen for spinning animation

socket.on("roulette time", (time) => {
    setTimer(time);
}); //listen for timer updates

socket.on("set roulette time", (time) => {
    updateTimer(time);
}); //sync server and client timer

alignRoulette();