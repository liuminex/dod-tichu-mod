// ==UserScript==
// @name         Tichu Mod
// @version      0.2
// @description  Tichu Mod Script for counting game cards
// @author       Jason-Manos
// @match        https://dod.gr/*
// @grant        none
// @run-at       document-end
// ==/UserScript==


let myCards = [], tmateCards = [], opp1Cards = [], opp2Cards = [], playedCards = [], unknownCards = [];

function createModBox() {
    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "Open Tichu Mod Menu";
    menuBtn.style.cssText = "position: fixed; top: 0; left: 0; z-index: 9998; background-color: #121212; color: #cdcdcd; border: none; padding: 10px; font-size: 20px;";
    menuBtn.onclick = openModMenu;
    document.body.appendChild(menuBtn);

    const modBox = document.createElement("div");
    modBox.id = "modBox";
    modBox.style.cssText = "position: fixed; top: 0; left: 0; width: 400px; height: 100vh; background-color: #121212; z-index: 9999; font-size: 20px; overflow-y: auto; color: #cdcdcd; padding: 2px; box-sizing: border-box;";
    modBox.innerHTML = `
        <h3 style='width: calc(100% - 4px); text-align:center; padding: 0 2px;'>Tichu Mod Box <button id='closeModMenuBtn'>close</button></h3>
        <hr style='margin: 0 2px;'>
            <div style='padding: 10px; font-size: 0.7em; border: solid 2px green; box-sizing: border-box; margin-bottom: 2px;'>
                <input id='tmateCardsInput' type='text' placeholder='TMate Cards'>
                <button onclick='readTMateCards()'>OK</button>
            </div>
            <div style='padding: 10px; font-size: 0.7em; border: solid 2px red; box-sizing: border-box; margin-bottom: 2px;'>
                <button id='openTichuBtn'>Open Tichu</button>
                <button id='resetAllBtn'>Reset</button>
                <button id='copyMyCardsBtn'>Copy My Cards</button>
                <button id='readMyCardsBtn'>Read My Cards</button>
            </div>
            <div id='cardsArea' style='padding: 10px; font-size: 0.7em; overflow-y: auto; border: solid 2px yellow; box-sizing: border-box; margin-bottom: 2px;'></div>
            <div id='modBoxLog' style='padding: 10px; font-size: 0.7em; height: 200px; overflow-y: auto; border: solid 2px cyan; box-sizing: border-box;'></div>
        `;
    document.body.appendChild(modBox);

    document.getElementById("closeModMenuBtn").onclick = closeModMenu;
    document.getElementById("openTichuBtn").onclick = openTichu;
    document.getElementById("resetAllBtn").onclick = resetAll;
    document.getElementById("copyMyCardsBtn").onclick = copyMyCards;
    document.getElementById("readMyCardsBtn").onclick = findMyCurrentCards;
}

function closeModMenu() { document.getElementById("modBox").style.display = "none"; }
function openModMenu() { document.getElementById("modBox").style.display = "block"; }

function copyMyCards() {
    navigator.clipboard.writeText(myCards.join(" "));
    log("My cards copied to clipboard");
}
function readTMateCards() {
    const cards = document.getElementById("tmateCardsInput").value.trim().split(" ");
    cards.forEach(card => { if (!rmFromUnkCards(card)) tmateCards.push(card); });
    displayCurrentCards();
}

function findGamesButton() {
    return document.getElementById("component_bottom_middle_main_games");
}
function findCloseGamesButton() {
    return document.querySelector("#topBarCloseButton");
}
function findTichuButton() {
    return document.evaluate("/html/body/div/div/div[7]/div[2]/div[2]/div/div/div/div[2]/div[2]/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function findEkkinhshButton() {
    return document.getElementById("go_startstop");
}
function findModBox() {
    return document.getElementById("modBox");
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
function findGoFeed() {
    return document.querySelector("#go_feed > span.dodlangspan");
}

function findMyCurrentCards() {
    const myCardsArea = document.getElementById("hand");

    if (!myCardsArea) {
        log("my cards area not found");
        return "";
    }

    for (let i = 0; i < myCardsArea.children.length; i++) {
        let cardEl = myCardsArea.children[i];
        let cardname = cardEl.getAttribute("card");

        if (!rmFromUnkCards(cardname)) {
            myCards.push(cardname);
        }
    }

    displayCurrentCards();
}

function rmFromUnkCards(cardname) {
    const index = unknownCards.indexOf(cardname);
    if (index === -1) return 1;
    unknownCards.splice(index, 1);
    return 0;
}
function rmFromMyCards(cardname) {
    const index = myCards.indexOf(cardname);
    if (index === -1) return 1;
    myCards.splice(index, 1);
    return 0;
}
function rmFromTmateCards(cardname) {
    const index = tmateCards.indexOf(cardname);
    if (index === -1) return 1;
    tmateCards.splice(index, 1);
    return 0;
}

function findPlayedCardsArea() {
    return document.getElementById("cardsHolder");
}

function findCurrentPlayedCards() {
    const playedCardsArea = findPlayedCardsArea();

    if (!playedCardsArea) {
        log("played cards area not found");
        return "";
    }

    for (let i = 0; i < playedCardsArea.children.length; i++) {
        let cardEl = playedCardsArea.children[i];
        let cardname = cardEl.getAttribute("card");

        if (!rmFromUnkCards(cardname)) {
            playedCards.push(cardname);
        }
        if (!rmFromMyCards(cardname)) {
            playedCards.push(cardname);
        }
        if (!rmFromTmateCards(cardname)) {
            playedCards.push(cardname);
        }
    }

    displayCurrentCards();
}

function log(str) {
    findModBoxLog().innerHTML += "<p class='logtry'>" + str + "</p>";

    // scroll into view
    let logtry = document.getElementsByClassName("logtry");
    logtry[logtry.length - 1].scrollIntoView();
}

function resetAll() {
    document.title = "DOD Tichu MOD";
    log("resetting all...");
    myCards = []; tmateCards = []; opp1Cards = []; opp2Cards = []; playedCards = [];
    unknownCards = [
        "Dragon", "Ad", "Ac", "Ah", "As", "Kd", "Kc", "Kh", "Ks", "Qd", "Qc", "Qh", "Qs", "Jd", "Jc", "Jh", "Js",
        "Td", "Tc", "Th", "Ts", "9d", "9c", "9h", "9s", "8d", "8c", "8h", "8s", "7d", "7c", "7h", "7s", "6d", "6c", "6h", "6s",
        "5d", "5c", "5h", "5s", "4d", "4c", "4h", "4s", "3d", "3c", "3h", "3s", "2d", "2c", "2h", "2s", "Dogs", "P!", "Mahjong"
    ];
    displayCurrentCards();
}

function callMouseDown(el){
    el.dispatchEvent(new MouseEvent("mousedown", {bubbles: true, cancelable: true, view: window}));
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
    ca.innerHTML = `
            <p><span>Me (${myCards.length}): </span><span>${styleCards(myCards, false)}</span></p>
            <p><span>Teammate (${tmateCards.length}): </span><span>${styleCards(tmateCards, false)}</span></p>
            <p><span>Played (${playedCards.length}): </span><span>${styleCards(playedCards, false)}</span></p>
            <p><span>Unknown (${unknownCards.length}): </span><span>${styleCards(unknownCards, true)}</span></p>
        `;
    if (playedCards.length + myCards.length + tmateCards.length + opp1Cards.length + opp2Cards.length + unknownCards.length !== 56) {
        log("ERROR: cards count is not 56");
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
    let tichuButtonInterval = setInterval(function(){
        if(findTichuButton()){
            callMouseDown(findTichuButton());
            log('opened tichu');
            findCloseGamesButton().click();
            log('closed games');
            clearInterval(tichuButtonInterval);
        }
    }, 1000);
}

/* ====================== add event listener to ekkinhsh button ====================== */

// wait until ekkinhsh button exists, then add event listener
let ekkinhshButtonInterval = setInterval(function(){
    if(findEkkinhshButton()){
        log('ekkinhsh button found');
        findEkkinhshButton().addEventListener("click", function(){
            log('ekkinhsh button clicked');
            resetAll();
        });
        clearInterval(ekkinhshButtonInterval);
    }
}, 1000);

/* ====================== add event listener to score ====================== */

// wait until score text exists, then add event listener
let scoreInterval = setInterval(function(){
    if(findMyTeamScore() && findOpTeamScore()){
        log('score text found');
        // when myTeamScore + OpTeamScore changes, reset all
        let myTeamScore = findMyTeamScore().innerText;
        let opTeamScore = findOpTeamScore().innerText;
        clearInterval(scoreInterval);
        setInterval(function(){
            if(findMyTeamScore().innerText !== myTeamScore || findOpTeamScore().innerText !== opTeamScore){
                log('score changed');
                myTeamScore = findMyTeamScore().innerText;
                opTeamScore = findOpTeamScore().innerText;
                resetAll();
            }
        }, 1000);

        clearInterval(scoreInterval);
    }
}, 1000);

/* ====================== add event listener to feed ====================== */
setInterval(function(){
    if(findGoFeed().innerText === "Παραλάβετε τις κάρτες"){
        // when innerText changes again, get my cards
        const feedInterval = setInterval(function(){
            if(findGoFeed().innerText !== "Παραλάβετε τις κάρτες"){
                log('reading cards');
                findMyCurrentCards();
                clearInterval(feedInterval);
            }
        }, 1000);
    }
}, 1000);


/* ====================== in game ====================== */

resetAll();

// add event listener to detect every time a card is played
// wait until cards area exists, then add event listener
let cardsAreaInterval = setInterval(function(){
    if(findPlayedCardsArea()){
        findPlayedCardsArea().addEventListener("DOMNodeInserted", function(){
            log('card played');
            findCurrentPlayedCards();
        });
        clearInterval(cardsAreaInterval);
    }
}, 1000);