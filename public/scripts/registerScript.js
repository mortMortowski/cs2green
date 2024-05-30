// BUTTONS
let submitBtn = document.getElementById("submit-form");

// DOM ELEMENTS

let form = document.getElementsByClassName("register-form")[0];
let errorWindow = document.getElementsByClassName("error-window")[0];
//experimental
let loginInput = document.getElementById("login-reg");
let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("email");
let pass1Input = document.getElementById("pass1");
let pass2Input = document.getElementById("pass2");
//experimental

// GLOBAL VARIABLES

// EVENT LISTENERS

submitBtn.addEventListener("click", async function (e){

    e.preventDefault();

    let login = loginInput.value;
    let username = usernameInput.value;
    let email = emailInput.value;
    let pass1 = pass1Input.value;
    let pass2 = pass2Input.value;

    const response = await fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ login, username, email, pass1, pass2 })
    });

    const data = await response.json();

    if(data.isError){
        showError(data.errorText);
    }
});

// FUNCTIONS

function showError(message){
    errorWindow.textContent = message;
    errorWindow.style.display = "block";
    setTimeout(() => {
        errorWindow.style.display = "none";
        errorWindow.textContent = "";
    },5000);
}