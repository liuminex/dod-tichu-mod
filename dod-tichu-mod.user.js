// ==UserScript==
// @name         Tichu Mod
// @version      0.2
// @description  Tichu Mod Script for counting game cards
// @author       Jason-Manos
// @match        https://www.dod.gr/*
// @grant        none
// @run-at       document-end
// ==/UserScript==


let myCards = [], tmateCards = [], opp1Cards = [], opp2Cards = [], playedCards = [], unknownCards = [];

function createModBox() {
    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "Open Tichu Mod Menu";
    menuBtn.style.cssText = "position: fixed; top: 0; left: 0; z-index: 9998; background-color: #121212; color: #f5f5f5; border: none; padding: 10px; font-size: 20px;";
    menuBtn.onclick = openModMenu;
    document.body.appendChild(menuBtn);

    const modBox = document.createElement("div");
    modBox.id = "modBox";
    modBox.style.cssText = "position: fixed; top: 0; left: 0; width: 400px; height: 100vh; background-color: rgba(35,37,46,0.8); z-index: 9999; font-size: 15px; overflow-y: auto; font-weight: bold; box-sizing: border-box;";
    modBox.innerHTML = `
        <div style='height: 30px; font-weight: bold; font-size: 17px; color: #dc0303; text-align:center; padding: 2px;'>Tichu Mod Box <button id='closeModMenuBtn'
        style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'
        >close</button></div>

        <hr style='margin: 0 2px; color: #dc0303;'>

        <div style='padding: 5px;'>
            <button id='mod-tab-0' style='height: 25px; padding: 5px; margin: 0px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>START</button>
            <button id='mod-tab-1' style='height: 25px; padding: 5px; margin: 0px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>PLAYED</button>
            <button id='mod-tab-2' style='height: 25px; padding: 5px; margin: 0px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>TMATE</button>
            <button id='mod-tab-3' style='height: 25px; padding: 5px; margin: 0px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>LOG</button>
            <button id='mod-tab-4' style='height: 25px; padding: 5px; margin: 0px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>EXTRA</button>
        </div>

        <hr style='margin: 0 2px; color: #dc0303;'>

        <div style='padding: 5px;'> <!-- tabs contents -->

            <div id='tab-0-start' style='max-height: calc(100vh - 70px); overflow-y: auto;'>
                <button id='openTichuBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Open Tichu</button>
            </div>

            <div id='cardsArea' style='max-height: calc(100vh - 70px); font-size: 0.7em; overflow-y: auto;'></div>

            <div id='tmatetab' style='max-height: calc(100vh - 70px); overflow-y: auto;'>
                <div id='tmatecardsinput'>
                    <input id='tmateCardsInput' type='text' placeholder='Teammate Cards'>
                    <button id='readTMateCardsBtn'>OK</button>
                </div>
                <div id='copymycards'>
                    <button id='copyMyCardsBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Copy My Cards</button>
                </div>
            </div>

            <div id='mod-extras' style='max-height: calc(100vh - 70px); overflow-y: auto;'>
                manual actions (optional):
                <br>
                <br>
                <button id='resetAllBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Reset</button>
                <button id='readMyCardsBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Read My Cards</button>
            </div>

            <div id='modBoxLog' style='max-height: calc(100vh - 70px); overflow-y: auto;'></div>

        </div>
        `;
    document.body.appendChild(modBox);

    document.getElementById("closeModMenuBtn").onclick = closeModMenu;
    document.getElementById("openTichuBtn").onclick = openTichu;
    document.getElementById("resetAllBtn").onclick = resetAll;
    document.getElementById("copyMyCardsBtn").onclick = copyMyCards;
    document.getElementById("readMyCardsBtn").onclick = findMyCurrentCards;
    document.getElementById("readTMateCardsBtn").onclick = readTMateCards;

    document.getElementById("mod-tab-0").onclick = function(){ openTab(0); };
    document.getElementById("mod-tab-1").onclick = function(){ openTab(1); };
    document.getElementById("mod-tab-2").onclick = function(){ openTab(2); };
    document.getElementById("mod-tab-3").onclick = function(){ openTab(3); };
    document.getElementById("mod-tab-4").onclick = function(){ openTab(4); };
}

function hideAllTabs(){
    document.getElementById("tab-0-start").style.display = "none";
    document.getElementById("cardsArea").style.display = "none";
    document.getElementById("tmatetab").style.display = "none";
    document.getElementById("modBoxLog").style.display = "none";
    document.getElementById("mod-extras").style.display = "none";
}

function openTab(tab) {
    hideAllTabs();
    if(tab == 0){
        document.getElementById("tab-0-start").style.display = "block";
    }
    else if(tab == 1){
        document.getElementById("cardsArea").style.display = "block";
    }
    else if(tab == 2){
        document.getElementById("tmatetab").style.display = "block";
    }
    else if(tab == 3){
        document.getElementById("modBoxLog").style.display = "block";
    }
    else if(tab == 4){
        document.getElementById("mod-extras").style.display = "block";
    }
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
    openTab(1);
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
        if(cardname[0] === "P") cardname = "P!";
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
    addPlayedCardsAreaListener();
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

function addPlayedCardsAreaListener(){
    // add event listener to detect every time a card is played
    // wait until cards area exists, then add event listener
    let cardsAreaInterval = setInterval(function(){
        if(findPlayedCardsArea()){
            findPlayedCardsArea().addEventListener("DOMNodeInserted", function(){
                //log('card played');
                findCurrentPlayedCards();
            });
            clearInterval(cardsAreaInterval);
        }
    }, 1000);
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

openTab(0);
resetAll();
