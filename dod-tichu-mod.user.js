// ==UserScript==
// @name         Tichu Mod
// @version      0.6.2
// @description  Tichu Mod Script for counting game cards
// @author       Jason-Manos
// @match        https://www.dod.gr/*
// @run-at       document-end
// ==/UserScript==

let newTab = undefined;


// Create new tab to bypass CSP
function openCardExchangeTab(){
    newTab = window.open('https://manos2400.github.io/card-exchange/', '_blank', 'width=600,height=450,top=100,left=100');
}

let myCards = [], tmateCards = [], opp1Cards = [], opp2Cards = [], playedCards = [], unknownCards = [];

function createModBox() {
    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "Open Tichu Mod Menu";
    menuBtn.id = "openModMenuBtn";
    menuBtn.style.cssText = "position: fixed; bottom: 0; left: 0; z-index: 9998; background-color: #121212; color: #f5f5f5; border: none; padding: 10px; font-size: 10px;";
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
            <button id='mod-tab-0' style='height: 25px; padding: 5px; margin: 0; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>START</button>
            <button id='mod-tab-1' style='height: 25px; padding: 5px; margin: 0; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>PLAYED</button>
            <button id='mod-tab-3' style='height: 25px; padding: 5px; margin: 0; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>LOG</button>
            <button id='mod-tab-4' style='height: 25px; padding: 5px; margin: 0; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>EXTRA</button>
        </div>

        <hr style='margin: 0 2px; color: #dc0303;'>

        <div style='padding: 5px;'> <!-- tabs contents -->

            <div id='tab-0-start' style='max-height: calc(100vh - 70px); overflow-y: auto;'>
                <button id='openTichuBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Open Tichu</button>
            </div>

            <div id='cardsArea' style='max-height: calc(100vh - 70px); font-size: 0.7em; overflow-y: auto;'></div>

            <div id='mod-extras' style='max-height: calc(100vh - 70px); overflow-y: auto;'>
                <p>manual actions (optional)</p>

                <hr>

                <button id='resetAllBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Reset</button>
                <button id='readMyCardsBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Read My Cards</button>
                <button id='openCardExchTab' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Open Card Exchange</button>
                <button id='copyMyCardsBtn' style='border: solid 1px black; padding: 3px; margin: 2px; background: rgb(13,43,85); background: linear-gradient(180deg, rgba(13,43,85,1) 0%, rgba(26,81,161,1) 35%, rgba(39,123,245,1) 100%); font-weight: bold; color: #f5f5f5; cursor: pointer;'>Copy My Cards</button>

                <hr>

                <div id='tmatecardsinput'>
                    <input id='tmateCardsInput' type='text' placeholder='Teammate Cards'>
                    <button id='readTMateCardsBtn'>OK</button>
                </div>

            </div>

            <div id='modBoxLog' style='max-height: calc(100vh - 170px); overflow-y: auto;'></div>

        </div>
        `;
    document.body.appendChild(modBox);

    document.getElementById("closeModMenuBtn").onclick = closeModMenu;
    document.getElementById("openTichuBtn").onclick = openTichu;
    document.getElementById("resetAllBtn").onclick = resetAll;
    document.getElementById("copyMyCardsBtn").onclick = copyMyCards;
    document.getElementById("readMyCardsBtn").onclick = findMyCurrentCards;
    document.getElementById("readTMateCardsBtn").onclick = readTMateCards;
    document.getElementById("openCardExchTab").onclick = openCardExchangeTab;

    document.getElementById("mod-tab-0").onclick = function(){ openTab(0); };
    document.getElementById("mod-tab-1").onclick = function(){ openTab(1); };
    document.getElementById("mod-tab-3").onclick = function(){ openTab(3); };
    document.getElementById("mod-tab-4").onclick = function(){ openTab(4); };
}

function hideAllTabs(){
    document.getElementById("tab-0-start").style.display = "none";
    document.getElementById("cardsArea").style.display = "none";
    document.getElementById("modBoxLog").style.display = "none";
    document.getElementById("mod-extras").style.display = "none";
}

function openTab(tab) {
    hideAllTabs();
    if(tab === 0){
        document.getElementById("tab-0-start").style.display = "block";
    }
    else if(tab === 1){
        document.getElementById("cardsArea").style.display = "block";
    }
    else if(tab === 3){
        document.getElementById("modBoxLog").style.display = "block";
    }
    else if(tab === 4){
        document.getElementById("mod-extras").style.display = "block";
    }
}

function closeModMenu() {
    document.getElementById("modBox").style.display = "none";
    document.getElementById("openModMenuBtn").style.display = "block";
}
function openModMenu() {
    document.getElementById("modBox").style.display = "block";
    document.getElementById("openModMenuBtn").style.display = "none";
}

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
    if(newTab) newTab.postMessage(myCards.join(" "), 'https://manos2400.github.io');
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
    resetScores();
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
    const live_score = getHTMLLiveScore();
    ca.innerHTML = `

            <p>${live_score}</p>
            <hr>
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
        log("interval: tichu button");
        if(findTichuButton()){
            callMouseDown(findTichuButton());
            log('opened tichu');
            findCloseGamesButton().click();
            log('closed games');

            openTab(1);
            openCardExchangeTab();
            addAllListeners();
            resetAll();
            resetListeners();

            clearInterval(tichuButtonInterval);
        }
    }, 1000);
}




/* ====================== LISTENERS ====================== */

// keep track of listeners to avoid duplicates
let listeners = {
    playedCardsArea: false,
    newGame: false,
    feed: false,
    childTab: false,
    bonusLayer: false,
    lastPlayer: false
};

function addAllListeners(){
    addPlayedCardsAreaListener();
    addNewGameListener();
    addFeedListener();
    addChildTabListener();
    addBonusLayerListener();
    addLastPlayerListener();
}

function resetListeners(){
    if(listeners.playedCardsArea) findPlayedCardsArea().removeEventListener("DOMNodeInserted", function(){});
    if(listeners.feed) findGoFeed().removeEventListener("DOMNodeInserted", function(){});
    if(listeners.bonusLayer) findBonusLayer().removeEventListener("DOMNodeInserted", function(){});
    if(listeners.lastPlayer) findLastPlayer().removeEventListener("DOMNodeInserted", function(){});

    // remove currents
    listeners.playedCardsArea = false;
    listeners.feed = false;
    listeners.bonusLayer = false;
    listeners.lastPlayer = false;

    addPlayedCardsAreaListener(); addFeedListener(); addBonusLayerListener(); addLastPlayerListener();
}

// DETECT WHEN NEW CARDS ARE PLAYED
function addPlayedCardsAreaListener(){
    if(listeners.playedCardsArea) return;
    let cardsAreaInterval = setInterval(function(){
        log("interval: played cards area");
        if(findPlayedCardsArea()){
            findPlayedCardsArea().addEventListener("DOMNodeInserted", function(){
                findCurrentPlayedCards();
            });
            listeners.playedCardsArea = true;
            log('+ played cards listener added');
            clearInterval(cardsAreaInterval);
        }
    }, 1000);
}

function addNewGameListener(){
    if(listeners.newGame) return;
    let intve54h6 = setInterval(function(){
        log("interval: new game");
        if(findMyTeamScore() && findOpTeamScore()){
            findMyTeamScore().addEventListener("DOMNodeInserted", function(){
                log('new game detected (1)');
                resetAll();
                resetListeners();
            });
            findOpTeamScore().addEventListener("DOMNodeInserted", function(){
                log('new game detected (2)');
                resetAll();
                resetListeners();
            });
            listeners.newGame = true;
            log('+ new game listener added');
            clearInterval(intve54h6);
        }
    }, 1000);
}

// DETECT WHEN WE RECEIVE CARDS

function findParalaveteKartesButton() {
    return document.getElementById("btnReceive");
}
function addFeedListener(){
    if(listeners.feed) return;

    let intv9384hbg = setInterval(function(){
        log("interval: paralavi button");
        if(findParalaveteKartesButton()){
            log('paralavi button found');
            findParalaveteKartesButton().onclick = function(){

                log('paralavi button clicked');

                setTimeout(function(){

                    findMyCurrentCards();
                    resetScores();

                }, 500);
                
            };
            listeners.feed = true;
            log('+ paralavete kartes listener added');
            clearInterval(intv9384hbg);
        }
    }, 1000);
}

// DETECT WHEN TEAMMATE SENDS CARDS
function addChildTabListener(){
    if(listeners.childTab) return;
    window.addEventListener('message', function(event) {
        if (event.origin === 'https://manos2400.github.io') {
            const cards = event.data.trim().split(" ");
            cards.forEach(card => { if (!rmFromUnkCards(card)) tmateCards.push(card); });
            displayCurrentCards();
            openTab(1);
        }
    }, false);
    listeners.childTab = true;
    log('+ child tab listener added');
}

// DETECT WHEN SOMEONE WINS A HAND
function addBonusLayerListener(){
    if(listeners.bonusLayer) return;
    let intv34f287g = setInterval(function(){
        log("interval: bonus layer");
        if(findBonusLayer()){
            findBonusLayer().addEventListener("DOMNodeInserted", function(){
                score = findBonusLayer().innerText;

                // if score == 'XP*' skip it
                if(score.includes("XP")) return;


                log("hand score: "+score);
                // triggered every time someone wins a hand

                updateScores(score, lastPlayerName);
            });
            listeners.bonusLayer = true;
            log('+ bonus layer listener added');
            clearInterval(intv34f287g);
        }
    }, 1000);
}

// DETECT WHEN LAST PLAYER CHANGES - used to find winer of hand
function addLastPlayerListener(){
    if(listeners.lastPlayer) return;
    let intvg495h84g = setInterval(function(){
        log("interval: last player layer");
        if(findLastPlayer()){
            findLastPlayer().addEventListener("DOMNodeInserted", function(){

                const full = findLastPlayer().innerText;
                // return all content after the second " ":
                const last_player = full.split(" ").slice(2).join(" ");
                lastPlayerName = last_player;

                log("last player: " + last_player);
            });
            listeners.lastPlayer = true;
            log('+ last player layer listener added');
            clearInterval(intvg495h84g);
        }
    }, 1000);
}




/* ====================== in game ====================== */

openTab(0);


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

// listener to get hand score
function findBonusLayer(){
    return document.getElementById("bonusAnimationsLayer");
}


// listener to keep track of winner of hand
function findLastPlayer(){
    return document.getElementById("txtLastHand");
}



