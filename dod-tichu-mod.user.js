// ==UserScript==
// @name         Tichu Mod
// @version      0.7.2
// @description  Tichu Mod Script for counting game cards
// @author       Jason-Manos
// @match        https://www.dod.gr/*
// @run-at       document-end
// ==/UserScript==


/*

1. VARIABLES
2. MOD BOX
3. FIND ELEMENTS

*/


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 1. VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// PARAMETERS
const EXCH_CARDS_URL = 'https://manos2400.github.io'; // domain where card-exchange rooms are hosted
const EXCH_CARDS_PATH = 'https://manos2400.github.io/card-exchange/'; // exact location where card-exchange rooms are hosted

// RUN TIME (do not need to change)
let newTab = undefined;

let myCards = [], tmateCards = [], playedCards = [], unknownCards = [];

const intervals_list = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 2. MOD BOX ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function createModBox() {

    const btn_style = "border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;";

    // OUT OF MODBOX

    // open mod box btn
    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "Open Tichu Mod Menu";
    menuBtn.id = "openModMenuBtn";
    menuBtn.style.cssText = "position: fixed; display: none; bottom: 0; left: 0; z-index: 9998; "+btn_style;
    menuBtn.onclick = function () {
        document.getElementById("modBox").style.display = "block";
        document.getElementById("openModMenuBtn").style.display = "none";
    };
    document.body.appendChild(menuBtn);

    // open tichu btn (one time outside btn)
    const theTichuBtn = document.createElement("button");
    theTichuBtn.innerHTML = "Open Tichu";
    theTichuBtn.style.cssText = btn_style + "position: fixed; bottom: 0; left: 0; z-index: 9998;";
    theTichuBtn.onclick = function(){
        document.getElementById("modBox").style.display = "block";
        openTichu();
        this.remove();
    }
    document.body.appendChild(theTichuBtn);

    // MODBOX

    const modBox = document.createElement("div");
    modBox.id = "modBox";
    modBox.style.cssText = "position: fixed; top: 0; left: 0; display: none; max-width: 400px; height: 100vh; background-color: rgba(35,37,46,0.8); z-index: 9999; font-size: 15px; font-weight: bold; box-sizing: border-box;";
    modBox.innerHTML = `
        <div style='height: 30px; font-weight: bold; font-size: 17px; color: #dc0303; padding: 2px; text-align: center;'>Tichu Mod Box
            <button id='closeModMenuBtn' style='${btn_style}'>close</button>
        </div>

        <hr style='margin: 0 2px; color: #dc0303;'>

        <div style='padding: 5px;'>
            <button id='mod-tab-1' style='${btn_style}'>PLAYED</button>
            <button id='mod-tab-3' style='${btn_style}'>LOG</button>
            <button id='mod-tab-4' style='${btn_style}'>EXTRA</button>
        </div>

        <hr style='margin: 0 2px; color: #dc0303;'>

        <div style='padding: 5px; max-height: calc(100vh - 70px); overflow-y: auto;'> <!-- tabs contents -->

            <div id='cardsArea' style='font-size: 0.7em;'></div>

            <div id='mod-extras'>
                <p>manual actions (optional)</p>

                <hr>

                <button id='openTichuBtn' style='${btn_style}'>Open Tichu</button>
                <button id='resetAllBtn' style='${btn_style}'>Reset</button>
                <button id='readMyCardsBtn' style='${btn_style}'>Read My Cards</button>
                <button id='openCardExchTab' style='${btn_style}'>Open Card Exchange</button>
                <button id='copyMyCardsBtn' style='${btn_style}'>Copy My Cards</button>
                <button id='stopIntervalsBtn' style='${btn_style}'>Stop Intervals</button>
                <button id='addListenersBtn' style='${btn_style}'>Add Listeners</button>

                <hr>

                <div id='tmatecardsinput'>
                    <input id='tmateCardsInput' type='text' placeholder='Teammate Cards'>
                    <button id='readTMateCardsBtn'>OK</button>
                </div>

            </div>

            <div id='modBoxLog' style='font-size: 0.7em;'></div>

        </div>
        `;
    document.body.appendChild(modBox);

    document.getElementById("closeModMenuBtn").onclick = function () {
        document.getElementById("modBox").style.display = "none";
        document.getElementById("openModMenuBtn").style.display = "block";
    };
    document.getElementById("openTichuBtn").onclick = openTichu;
    document.getElementById("resetAllBtn").onclick = resetAll;
    document.getElementById("copyMyCardsBtn").onclick = copyMyCards;
    document.getElementById("readMyCardsBtn").onclick = findMyCurrentCards;
    document.getElementById("readTMateCardsBtn").onclick = readTMateCards;
    document.getElementById("openCardExchTab").onclick = openCardExchangeTab;
    document.getElementById("stopIntervalsBtn").onclick = stopAllIntervals;
    document.getElementById("addListenersBtn").onclick = addListeners;

    document.getElementById("mod-tab-1").onclick = function(){
        hideAllTabs();
        findCardsArea().style.display = "block";
    };
    document.getElementById("mod-tab-3").onclick = function(){
        hideAllTabs();
        findModBoxLog().style.display = "block";
    }
    document.getElementById("mod-tab-4").onclick = function(){
        hideAllTabs();
        findModExtras().style.display = "block";
    }
}

function hideAllTabs(){
    findCardsArea().style.display = "none";
    findModBoxLog().style.display = "none";
    findModExtras().style.display = "none";
}

function log(str, level="default"){

    let color = "white";
    if(level === "e") color = "red";
    if(level === "w") color = "yellow";

    findModBoxLog().innerHTML += "<p class='logtry' style='color: "+color+"'>" + str + "</p>";
    // scroll into view
    findLastLogtry().scrollIntoView();
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 3. FIND ELEMENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function findLastLogtry(){
    let logtry = document.getElementsByClassName("logtry");
    return logtry[logtry.length - 1];
}
function findModExtras(){
    return document.getElementById("mod-extras");
}
function findGamesButton() {
    return document.getElementById("component_bottom_middle_main_games");
}
function findCloseGamesButton() {
    return document.querySelector("#topBarCloseButton");
}
function findTichuButton() {
    return getElByXPath("/html/body/div/div/div[7]/div[2]/div[2]/div/div/div/div[2]/div[2]/div[5]");
}
function findEkkinhshButton() {
    return document.getElementById("go_startstop");
}
function findModBoxLog() {
    return document.getElementById("modBoxLog");
}
function findCardsArea() {
    return document.getElementById("cardsArea");
}
function findMyTeamScore() {
    return document.getElementById("txtMyTeamScore");
}
function findOpTeamScore() {
    return document.getElementById("txtOpTeamScore");
}
function findMyCardsArea(){
    return document.getElementById("hand");
}
function findTMateCardInput(){
    return document.getElementById("tmateCardsInput");
}
function findPlayedCardsArea() {
    return document.getElementById("cardsHolder");
}
function findParalaveteKartesButton() {
    return document.getElementById("btnReceive");
}
function findBonusLayer(){ // listener to get hand score
    return document.getElementById("bonusAnimationsLayer");
}
function findLastPlayer(){ // listener to keep track of winner of hand
    return document.getElementById("txtLastHand");
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 4. GENERAL FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function getElByXPath(xpath){
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}

function callMouseDown(el){
    el.dispatchEvent(new MouseEvent("mousedown", {bubbles: true, cancelable: true, view: window}));
}

function copyMyCards() {
    navigator.clipboard.writeText(myCards.join(" ")).catch(err => console.error('Failed to copy: ', err));
    log("My cards copied to clipboard");
}

function readTMateCards() {
    const cards = findTMateCardInput().value.trim().split(" ");
    cards.forEach(card => { if (!rmFromUnkCards(card)) tmateCards.push(card); });
    displayCurrentCards();
    hideAllTabs();
    findCardsArea().style.display = "block";
}

function findMyCurrentCards() {
    const myCardsArea = findMyCardsArea();

    if (!myCardsArea) {
        log("my cards area not found", "e");
        return "";
    }

    for (let i = 0; i < myCardsArea.children.length; i++) {
        let cardEl = myCardsArea.children[i];
        let cardName = cardEl.getAttribute("card");

        if (!rmFromUnkCards(cardName)) {
            myCards.push(cardName);
        }
    }
    if(newTab) newTab.postMessage(myCards.join(" "), EXCH_CARDS_URL);
    else log("newTab not found", "e");

    displayCurrentCards();
}

function rmFromUnkCards(cardName) {
    const index = unknownCards.indexOf(cardName);
    if (index === -1) return 1;
    unknownCards.splice(index, 1);
    return 0;
}

function rmFromMyCards(cardName) {
    const index = myCards.indexOf(cardName);
    if (index === -1) return 1;
    myCards.splice(index, 1);
    return 0;
}

function rmFromTmateCards(cardName) {
    const index = tmateCards.indexOf(cardName);
    if (index === -1) return 1;
    tmateCards.splice(index, 1);
    return 0;
}

function findCurrentPlayedCards() {
    const playedCardsArea = findPlayedCardsArea();

    if (!playedCardsArea) {
        log("played cards area not found", "e");
        return "";
    }

    for (let i = 0; i < playedCardsArea.children.length; i++) {
        let cardEl = playedCardsArea.children[i];
        let cardName = cardEl.getAttribute("card");
        if(cardName[0] === "P") cardName = "P!";
        if (!rmFromUnkCards(cardName)) {
            playedCards.push(cardName);
        }
        if (!rmFromMyCards(cardName)) {
            playedCards.push(cardName);
        }
        if (!rmFromTmateCards(cardName)) {
            playedCards.push(cardName);
        }
    }

    displayCurrentCards();
}

function resetAll() {
    log("resetting all...");
    myCards = []; tmateCards = []; playedCards = [];
    unknownCards = [
        "Dragon", "Ad", "Ac", "Ah", "As", "Kd", "Kc", "Kh", "Ks", "Qd", "Qc", "Qh", "Qs", "Jd", "Jc", "Jh", "Js",
        "Td", "Tc", "Th", "Ts", "9d", "9c", "9h", "9s", "8d", "8c", "8h", "8s", "7d", "7c", "7h", "7s", "6d", "6c", "6h", "6s",
        "5d", "5c", "5h", "5s", "4d", "4c", "4h", "4s", "3d", "3c", "3h", "3s", "2d", "2c", "2h", "2s", "Dogs", "P!", "Mahjong"
    ];
    displayCurrentCards();
    resetScores();
}

function styleCards(cards, grid = false) {
    const order = ["Dragon", "Phoenix", "Dogs", "Mahjong", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
    const groupedCards = {};
    cards.forEach(card => {
        let rank = card[0];
        if (card === "Dragon") rank = "Dragon";
        if (card === "P!") rank = "Phoenix";
        if (card === "Mahjong") rank = "Mahjong";
        if (card === "Dogs") rank = "Dogs";
        if (rank === "T") rank = "10";
        if (!groupedCards[rank]) {
            groupedCards[rank] = [];
        }
        groupedCards[rank].push(card);
    });

    let sortedKeys = Object.keys(groupedCards).sort((a, b) => order.indexOf(a) - order.indexOf(b));

    let formattedCards = sortedKeys.map(rank => {
        const cardGroup = groupedCards[rank].map(card => {
            let displayRank = rank; // Use rank without suit for display
            let color = "white";

            // Determine color based on suit (second character in card)
            if (["Dragon", "P!", "Mahjong", "Dogs"].includes(card)) {
                color = "magenta";
            } else if (card.includes("d")) {
                color = "black";
            } else if (card.includes("h")) {
                color = "red";
            } else if (card.includes("s")) {
                color = "blue";
            } else if (card.includes("c")) {
                color = "#0cb635";
            }
            if (card === "P!") displayRank = "Phoenix";

            return `<span style='font-size: 1.6em; color: ${color}; background-color: white; padding: 1px 5px; margin: 2px; border-radius: 4px;'>${displayRank}</span>`;
        }).join(" ");

        if (grid) {
            return `<div style='display: flex; flex-direction: row; align-items: center; gap: 5px;'>${cardGroup}</div>`;
        } else {
            return cardGroup;
        }
    });

    if (grid) {
        return `<div style='display: flex; flex-direction: column; align-items: center; gap: 5px;'>${formattedCards.join("")}</div>`;
    } else {
        return formattedCards.join(" ");
    }
}

function displayCurrentCards() {
    const ca = findCardsArea();
    const live_score = getHTMLLiveScore();
    ca.innerHTML = `

            <p>${live_score}</p>
            <hr>
            <p><span>Me (${myCards.length}): </span><span>${styleCards(myCards, false)}</span></p>
            <p><span>Teammate (${tmateCards.length}): </span><span>${styleCards(tmateCards, false)}</span></p>
            <p><span>Played (${playedCards.length}): </span><span>${styleCards(playedCards, false)}</span></p>
            <p><span>Unknown (${unknownCards.length}): </span><span>${styleCards(unknownCards, true)}</span></p>
        `;
    if (playedCards.length + myCards.length + tmateCards.length + unknownCards.length !== 56) {
        log("cards count is not 56", "w");
    }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Driver ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* ====================== create mod box ====================== */

createModBox();

/* ====================== open tichu window ====================== */

function openTichu(){
    // open games
    callMouseDown(findGamesButton());
    log('opened games');

    // wait until tichu button exists, then open tichu and close games
    let interval_tichu_btn = setInterval(function(){
        log("interval: tichu button");
        if(findTichuButton()){
            callMouseDown(findTichuButton());
            log('opened tichu');
            findCloseGamesButton().click();
            log('closed games');

            hideAllTabs();
            findCardsArea().style.display = "block";

            openCardExchangeTab();
            addChildTabListener();

            resetAll();

            clearInterval(interval_tichu_btn);
        }
    }, 1000);
}


/* ====================== LISTENERS ====================== */

function cardsRecieved(){
    log('paralavi button clicked');

    setTimeout(function(){

        findMyCurrentCards();
        resetScores();

    }, 500);
}


// Create new tab to bypass CSP
function openCardExchangeTab(){
    newTab = window.open(EXCH_CARDS_PATH, '_blank', 'width=600,height=450,top=100,left=300');
}


/* ====================== live score ====================== */

let livePlayerScores = {};
let lastPlayerName, score;

function getHTMLLiveScore(){
    let scoreHTML = "";
    let sum = 100;
    for (let [key, value] of Object.entries(livePlayerScores)) {
        if(value === undefined || value === null) value = 0;
        scoreHTML += `<p>${key}: ${value}</p>`;
        sum -= value;
    }
    scoreHTML += `<p>remaining: ${sum}</p>`;
    return scoreHTML;
}

function updateScores(s,n){
    if(livePlayerScores[n]){
        livePlayerScores[n] += parseInt(s);
    }else{
        livePlayerScores[n] = parseInt(s);
    }
    displayCurrentCards();
}
function resetScores(){
    // call this when new game starts
    livePlayerScores = {};
    displayCurrentCards();
}


const eventListeners = new WeakMap();

// Function to add custom event listeners
function addListenerCustom(interval_index, find_function, event, callback) {
    let el;

    // Create and store the interval
    intervals_list[interval_index] = setInterval(function () {
        log("interval " + interval_index);

        // Check if the element is found
        if ((el = find_function())) {
            // If the listener has already been added, don't add it again
            if (hasTrackedEventListener(el, event)) {
                log(`${event} listener already exists for this element`);
                clearInterval(intervals_list[interval_index]);
                return;
            }

            // Add the event listener if element is found
            el.addEventListener(event, callback);

            // Track the listener in the WeakMap
            if (!eventListeners.has(el)) {
                eventListeners.set(el, {});
            }

            const listeners = eventListeners.get(el);
            listeners[event] = callback; // Track specific event listener

            log(`+ ${event} listener added`);
            clearInterval(intervals_list[interval_index]); // Clear the interval after listener is added
        }
    }, 1000);
}

// Check if the element has a tracked listener
function hasTrackedEventListener(element, event) {
    return eventListeners.has(element) && eventListeners.get(element)[event] !== undefined;
}

function addListeners() {
    const playedCardsArea = findPlayedCardsArea();
    if (playedCardsArea) {
        if (hasTrackedEventListener(playedCardsArea, "DOMNodeInserted")) {
            log("played cards area has a listener");
        } else {
            log("played cards area does not have a listener", "w");
            // add listener
            addListenerCustom(1, findPlayedCardsArea, "DOMNodeInserted", findCurrentPlayedCards);
        }
    } else {
        log("played cards area not found", "w");
    }

    const lastPlayer = findLastPlayer();
    if (lastPlayer) {
        if (hasTrackedEventListener(lastPlayer, "DOMNodeInserted")) {
            log("last player has a listener");
        } else {
            log("last player does not have a listener", "w");
            // add listener
            addListenerCustom(2, findLastPlayer, "DOMNodeInserted", updateLastPlayer);
        }
    } else {
        log("last player not found", "w");
    }

    const myTeamScore = findMyTeamScore();
    if (myTeamScore) {
        if (hasTrackedEventListener(myTeamScore, "DOMNodeInserted")) {
            log("my team score has a listener");
        } else {
            log("my team score does not have a listener", "w");
            // add listener
            addListenerCustom(3, findMyTeamScore, "DOMNodeInserted", resetAll);
        }
    } else {
        log("my team score not found", "w");
    }

    const opTeamScore = findOpTeamScore();
    if (opTeamScore) {
        if (hasTrackedEventListener(opTeamScore, "DOMNodeInserted")) {
            log("op team score has a listener");
        } else {
            log("op team score does not have a listener", "w");
            // add listener
            addListenerCustom(4, findOpTeamScore, "DOMNodeInserted", resetAll);
        }
    } else {
        log("op team score not found", "w");
    }

    const bonusLayer = findBonusLayer();
    if (bonusLayer) {
        if (hasTrackedEventListener(bonusLayer, "DOMNodeInserted")) {
            log("bonus layer has a listener");
        } else {
            log("bonus layer does not have a listener", "w");
            // add listener
            addListenerCustom(5, findBonusLayer, "DOMNodeInserted", getHandPoints);
        }
    } else {
        log("bonus layer not found", "w");
    }

    const paralaveteKartesButton = findParalaveteKartesButton();
    if (paralaveteKartesButton) {
        if (hasTrackedEventListener(paralaveteKartesButton, "click")) {
            log("paralavete kartes button has a listener");
        } else {
            log("paralavete kartes button does not have a listener", "w");
            // add listener
            addListenerCustom(8, findParalaveteKartesButton, "click", cardsRecieved);
        }
    } else {
        log("paralavete kartes button not found", "w");
    }
}


// LISTENERS ARE ADDED ONLY EVERY TIME EKKINHSH BUTTON IS CLICKED
let ekkinhshButtonInterval = setInterval(function(){
    log("interval: ekkinhsh button");
    if(findEkkinhshButton()){
        log('ekkinhsh button found');
        findEkkinhshButton().addEventListener("click", function(){
            log('ekkinhsh button clicked');
            addListeners();
        });
        log('+ ekkinhsh button listener added');
        clearInterval(ekkinhshButtonInterval);
    }
}, 1000);


// DETECT WHEN TEAMMATE SENDS CARDS - does not need check, this listener does not get removed
function addChildTabListener(){
    window.addEventListener('message', function(event) {
        if (event.origin === EXCH_CARDS_URL) {
            const cards = event.data.trim().split(" ");
            cards.forEach(card => { if (!rmFromUnkCards(card)) tmateCards.push(card); });
            displayCurrentCards();
        }
    }, false);
    log('+ child tab listener added');
}


function getHandPoints(){
    score = findBonusLayer().innerText;
    if(score.includes("XP")) return;
    log("hand score: "+score);
    updateScores(score, lastPlayerName);
}

// LISTENER CALLBACKS

// Named callback for the last player listener to ensure proper reference tracking
function updateLastPlayer() {
    const full = findLastPlayer().innerText;
    const last_player = full.split(" ").slice(2).join(" ");
    lastPlayerName = last_player;
    log("last player: " + last_player);
}

function stopAllIntervals(){
    for(let i=0; i<intervals_list.length; i++){
        clearInterval(intervals_list[i]);
    }
    log("all intervals stopped");
}