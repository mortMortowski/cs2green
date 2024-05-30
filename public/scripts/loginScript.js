// BUTTONS

// DOM ELEMENTS
let form = document.getElementsByClassName("login-form")[0];
let errorWindow = document.getElementsByClassName("error-window")[0];
let loginInput = document.getElementById("login");
let passInput = document.getElementById("pass");

// GLOBAL VARIABLES

// EVENT LISTENERS
form.addEventListener("submit", async function(e){
    e.preventDefault();

    let login = loginInput.value;
    let pass = passInput.value;

    const response = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ login, pass })
    });

    const data = await response.json();

    if(response.status == 200){
        window.location.assign("/");
    }else{
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