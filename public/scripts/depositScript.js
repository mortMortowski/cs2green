//BUTTONS AND CLICKABLE DIVS
let switchCryptoBtn = document.getElementById("switch-crypto");
let switchCs2Btn = document.getElementById("switch-cs2");
let switchBTC = document.getElementById("crypto-option-btc");
let switchLTC = document.getElementById("crypto-option-ltc");
let switchETH = document.getElementById("crypto-option-eth");
let generateAddressBtn = document.getElementById("generate-address");
let instructionBtn = document.getElementsByClassName("instruction-btn")[0];
let closeBtn = document.querySelectorAll(".close-btn");
let listingsBtn = document.getElementsByClassName("select-listings")[0];
let awaitingsBtn = document.getElementsByClassName("select-awaitings")[0];

//DOM ELEMENTS
let cryptoWindow = document.getElementsByClassName("crypto-window")[0];
let cs2Window = document.getElementsByClassName("cs2-window")[0];
let choosenCoin = document.getElementsByClassName("selected-coin")[0];
let choosenNetwork = document.getElementsByClassName("selected-network")[0];
let coinsInput = document.getElementById("coins-input");
let cryptoInput = document.getElementById("crypto-input");
let usdInput = document.getElementById("usd-input");
let errorWindow = document.getElementsByClassName("error-window")[0];
let btcPrice = document.getElementsByClassName("btc-price")[0];
let ltcPrice = document.getElementsByClassName("ltc-price")[0];
let ethPrice = document.getElementsByClassName("eth-price")[0];
let cryptoLabel = document.getElementById("crypto-label");
let disableBackground = document.getElementsByClassName("disable-background")[0];
let depositInstruction = document.getElementsByClassName("deposit-instruction")[0];
let depositConfirmation = document.getElementsByClassName("deposit-confirmation")[0];
let cancelListing = document.getElementsByClassName("cancel-listing")[0];
let buyerFound = document.getElementsByClassName("buyer-found")[0];
let steamItemInv = document.querySelectorAll(".steam-item-inv");
let activeListings = document.getElementsByClassName("active-listings")[0];
let awaitings = document.getElementsByClassName("awaitings")[0];

//GLOBAL VARIABLES
let cryptoWindowVisible = true;
let listingsVisible = true;
let selectedCoin = "btc";
let selectedNetwork = "btc";
let selectedCoinValue = 1;
let BTCPrice = 0;
let LTCPrice = 0;
let ETHPrice = 0;

//EVENT LISTENERS

switchCryptoBtn.addEventListener('click', () => {
    if(!cryptoWindowVisible){
        cs2Window.style.display = "none";
        cryptoWindow.style.display = "block";
        switchCs2Btn.classList.remove("option-selected");
        switchCryptoBtn.classList.add("option-selected");
        cryptoWindowVisible = true;
    }
});

switchCs2Btn.addEventListener('click', () => {
    if(cryptoWindowVisible){
        cryptoWindow.style.display = "none";
        cs2Window.style.display = "block";
        switchCryptoBtn.classList.remove("option-selected");
        switchCs2Btn.classList.add("option-selected");
        cryptoWindowVisible = false;
    }
});

switchBTC.addEventListener('click', () => {
    if(selectedCoin != "btc"){
        switchLTC.classList.remove("crypto-option-selected");
        switchETH.classList.remove("crypto-option-selected");
        switchBTC.classList.add("crypto-option-selected");
        selectedCoin = "btc";
        selectedNetwork = "btc";
        choosenCoin.textContent = "Bitcoin";
        choosenNetwork.textContent = "Bitcoin";
        cryptoInput.placeholder = "BTC";
        cryptoLabel.textContent = "Crypto (BTC)";
        selectedCoinValue = BTCPrice;
    }
});

switchLTC.addEventListener('click', () => {
    if(selectedCoin != "ltc"){
        switchETH.classList.remove("crypto-option-selected");
        switchBTC.classList.remove("crypto-option-selected");
        switchLTC.classList.add("crypto-option-selected");
        selectedCoin = "ltc";
        selectedNetwork = "ltc";
        choosenCoin.textContent = "Litecoin";
        choosenNetwork.textContent = "Litecoin";
        cryptoInput.placeholder = "LTC";
        cryptoLabel.textContent = "Crypto (LTC)";
        selectedCoinValue = LTCPrice;
    }
});

switchETH.addEventListener('click', () => {
    if(selectedCoin != "eth"){
        switchLTC.classList.remove("crypto-option-selected");
        switchBTC.classList.remove("crypto-option-selected");
        switchETH.classList.add("crypto-option-selected");
        selectedCoin = "eth";
        selectedNetwork = "eth";
        choosenCoin.textContent = "Ethereum";
        choosenNetwork.textContent = "Ethereum";
        cryptoInput.placeholder = "ETH";
        cryptoLabel.textContent = "Crypto (ETH)";
        selectedCoinValue = ETHPrice;
    }
});

generateAddressBtn.addEventListener('click', () => {
    generateDepositAddress(selectedCoin, selectedNetwork);
});

document.addEventListener('DOMContentLoaded', () => {
    calculateRates("usd");

    $.ajax({
        type: "GET",
        url: "/getcryptoprices",
        success: function(res){
            updatePrices(res.bitcoin.usd, res.litecoin.usd, res.ethereum.usd);
            selectedCoinValue = res.bitcoin.usd;
        }
   }); 
},false);

instructionBtn.addEventListener('click', () => {
    disableBackground.style.display = "block";
    depositInstruction.style.display = "block";
});

closeBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        disableBackground.style.display = "none";
        depositInstruction.style.display = "none";
        depositConfirmation.style.display = "none";
        cancelListing.style.display = "none";
        buyerFound.style.display = "none";
    });
});

steamItemInv.forEach((item) => {
    item.addEventListener('click', () => {
        disableBackground.style.display = "block";
        depositConfirmation.style.display = "block";
        console.log(item.className.substring(34)); //selected item id
    });
});

listingsBtn.addEventListener('click', () => {
    if(!listingsVisible){
        listingsVisible = !listingsVisible;
        awaitings.style.display = "none";
        activeListings.style.display = "block";
        awaitingsBtn.classList.remove("grey-button-selected");
        listingsBtn.classList.add("grey-button-selected");
    }
});

awaitingsBtn.addEventListener('click', () => {
    if(listingsVisible){
        listingsVisible = !listingsVisible;
        activeListings.style.display = "none";
        awaitings.style.display = "block";
        listingsBtn.classList.remove("grey-button-selected");
        awaitingsBtn.classList.add("grey-button-selected");
    }
});

//FUNCTIONS

function generateDepositAddress(coin, network){

}

function calculateRates(lastField){
    if(lastField == "coins"){
        let coinsAmount = coinsInput.value;
        let usdAmount = coinsAmount / 1000;
        let cryptoAmount = usdAmount / selectedCoinValue;
        usdInput.value = usdAmount.toFixed(2);
        cryptoInput.value = cryptoAmount.toFixed(6);
    }else if(lastField == "crypto"){
        let cryptoAmount = cryptoInput.value;
        let usdAmount = selectedCoinValue * cryptoAmount;
        let coinsAmount = usdAmount * 1000;
        usdInput.value = usdAmount.toFixed(2);
        coinsInput.value = coinsAmount.toFixed(0);
    }else if(lastField == "usd"){
        let usdAmount = usdInput.value;
        let coinsAmount = usdAmount * 1000;
        let cryptoAmount = usdAmount / selectedCoinValue;
        coinsInput.value = coinsAmount.toFixed(0);
        cryptoInput.value = cryptoAmount.toFixed(6);
    }else{
        showError("calculator error");
    }
}

function showError(message){
    errorWindow.textContent = message;
    errorWindow.style.display = "block";
    setTimeout(() => {
        errorWindow.style.display = "none";
        errorWindow.textContent = "";
    },5000);
}

function updatePrices(btcUSD, ltcUSD, ethUSD){
    btcPrice.textContent = "$" + btcUSD;
    ltcPrice.textContent = "$" + ltcUSD;
    ethPrice.textContent = "$" + ethUSD;
    BTCPrice = btcUSD;
    LTCPrice = ltcUSD;
    ETHPrice = ethUSD;
}