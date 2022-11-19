// Elements
const gameElement = document.querySelector('game');
const coinsElement = document.querySelector('.coins__value');
const heartsElement = document.querySelector('.hearts__value');
const historyElement = document.querySelector('.history');
const btnStart = document.querySelector('.startButton');
const btnBuyUpgrade1 = document.querySelector('.market__upgrade__price.heart');
const btnBuyUpgrade2 = document.querySelector('.market__upgrade__price.value');
const btnBuyUpgrade3 = document.querySelector('.market__upgrade__price.lifetime');
const lvlUpgrade1Element = document.querySelector('.market__upgrade__level.heart');
const lvlUpgrade2Element = document.querySelector('.market__upgrade__level.value');
const lvlUpgrade3Element = document.querySelector('.market__upgrade__level.lifetime');
let buttons; //represents array of 25 game buttons

// Game settings
const buttonSpawnInterval = 500; //in ms
const buttonLifeTime = 750;

// Game variables
let buttonsIntervalId;
let timerIntervalId;
let currentScore = 0;
let isActivated = new Array(25).fill(false); //this array is used to check if particular button is activated
let history = [];

// Game variables (Upgradable)
let maxHearts = 3;
let clickValue = 1;
let clickLifetime = 1;

// Additional variables
let currentHearts = maxHearts;
let lvlUpgrade1 = 0;
let lvlUpgrade2 = 0;
let lvlUpgrade3 = 0;

// Functions
updateGame = function () {
    //getting random button id that is not activated(0 to 24)
    let rnd = 0;
    do {
        rnd = Math.floor(Math.random() * 25);
    } while (isActivated[rnd])

    activateButton(rnd);
}

activateButton = function (buttonId) {
    let button = document.querySelector(`.gameButton.b-${buttonId}`);
    button.src = 'green.png';
    isActivated[buttonId] = true;

    //Button will gray out in buttonLifTime ms
    setTimeout(function () {
        button.src = 'gray.png';
        isActivated[buttonId] = false;
    }, buttonLifeTime*clickLifetime);
}

disableGameButtons = function(){
    buttons.forEach(function(element){
        element.disabled = true;
    });
}

enableGameButtons = function(){
    buttons.forEach(function(element){
        element.disabled = false;
    });
}

updateUI = function () {
    heartsElement.textContent = currentHearts;
    updateHistory();
}

updateHistory = function () {
    historyElement.innerHTML = '';
    let newHtml = '';

    history.slice(0).reverse().forEach(function(element){
        let label = element >= 0 ? "earned" : "purchase";
        let type = element >= 0 ? "game" : "purchase";
        newHtml +=
        `<div class="history__row">
            <div class="history__type history__type__${type}">${label}</div>
            <div class="history__coins">
                <div class="history__coins__value">${element > 0 ? '+' : ''}${element}</div>
                <div class="history__coins__label">coins</div>
            </div>
        </div>`;
    })

    //adding start bonus to history
    newHtml +=
    `<div class="history__row">
        <div class="history__type history__type__game">start bonus</div>
        <div class="history__coins">
            <div class="history__coins__value">+50</div>
            <div class="history__coins__label">coins</div>
        </div>
    </div>`;
    historyElement.innerHTML = newHtml;
}

startGame = function () {
    if(btnStart.disabled) {
        return;
    }
    btnStart.disabled = true;
    btnStart.style.backgroundColor = 'gray';
    enableGameButtons();

    resetGame();
    updateUI();
    timerIntervalId = setInterval(updateGame, buttonSpawnInterval);
}

stopGame = function () {
    btnStart.disabled = false;
    btnStart.style.backgroundColor = 'limegreen';
    disableGameButtons();
    clearInterval(timerIntervalId);

    //Adding coins depending on result
    history.push(currentScore*clickValue);
    coinsElement.textContent = Number(coinsElement.textContent) + (currentScore*clickValue);
    
    updateUI();
}

resetGame = function(){
    currentHearts = maxHearts;
    currentScore = 0;
}

// Game setup
// creating game buttons
for (let i = 0; i < 5; i++) {
    gameElement.innerHTML += "<div>";
    for (let j = 0; j < 5; j++) {
        let html = `<input class="gameButton b-${i * 5 + j}" type="image" src="gray.png"/>`
        gameElement.innerHTML += html;
    }
}
// Adding event listeners
buttons = document.querySelectorAll('.gameButton');
buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        if(button.disabled) {
            return;
        }
        
        let isActivated = button.getAttribute('src') == "green.png"
        if (isActivated) {
            currentScore++;
            button.src = 'gray.png';
        } else {
            currentHearts--;
            updateUI();
            if(currentHearts <= 0){
                stopGame();
            }
        }
    });
});
btnStart.addEventListener('click', startGame);
//there is quite a bit of code reuse, but js is not oop
btnBuyUpgrade1.addEventListener('click', function(){
    if(btnBuyUpgrade1.disabled){
        return;
    }

    let coins = Number(coinsElement.textContent);
    let price = Number(btnBuyUpgrade1.textContent);

    if(coins >= price){
        coinsElement.textContent = coins-price;
        btnBuyUpgrade1.textContent = price == 30? 60 : 90;
        history.push(-price);

        maxHearts++;
        lvlUpgrade1Element.textContent = `${++lvlUpgrade1}/3`;
    }else{
        alert("not enough coins");
    }
    //once hit max lvl, disable the buy button
    if(lvlUpgrade1 == 3){
        btnBuyUpgrade1.disabled = true;
        btnBuyUpgrade1.hidden = true;
    }
    updateUI();
});
btnBuyUpgrade2.addEventListener('click', function(){
    if(btnBuyUpgrade2.disabled){
        return;
    }

    let coins = Number(coinsElement.textContent);
    let price = Number(btnBuyUpgrade2.textContent);

    if(coins >= price){
        coinsElement.textContent = coins-price;
        btnBuyUpgrade2.textContent = price == 30? 60 : 90;
        history.push(-price);

        clickValue++;
        lvlUpgrade2Element.textContent = `${++lvlUpgrade2}/3`;
    }else{
        alert("not enough coins");
    }
    //once hit max lvl, disable the buy button
    if(lvlUpgrade2 == 3){
        btnBuyUpgrade2.disabled = true;
        btnBuyUpgrade2.hidden = true;
    }
    updateUI();
});
btnBuyUpgrade3.addEventListener('click', function(){
    if(btnBuyUpgrade3.disabled){
        return;
    }

    let coins = Number(coinsElement.textContent);
    let price = Number(btnBuyUpgrade3.textContent);

    if(coins >= price){
        coinsElement.textContent = coins-price;
        btnBuyUpgrade3.textContent = price == 30? 60 : 90;
        history.push(-price);

        clickLifetime+= .5;
        lvlUpgrade3Element.textContent = `${++lvlUpgrade3}/3`;
    }else{
        alert("not enough coins");
    }
    //once hit max lvl, disable the buy button
    if(lvlUpgrade3 == 3){
        btnBuyUpgrade3.disabled = true;
        btnBuyUpgrade3.hidden = true;
    }
    updateUI();
});


disableGameButtons();
updateUI();