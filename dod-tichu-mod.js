var myCards = [];
var tmateCards = [];
var opp1Cards = [];
var opp2Cards = [];
var playedCards = [];
var unknownCards = [];



// create left mod box

function createModBox(){

    var menuBtn = document.createElement("button");
    menuBtn.innerHTML = "Open Tichu Mod Menu";
    menuBtn.style.cssText = "position: fixed; top: 0; left: 0; z-index: 9998; background-color: #121212; color: #cdcdcd; border: none; padding: 10px; font-size: 20px;";
    menuBtn.onclick = openModMenu;
    document.body.appendChild(menuBtn);

    var modBox = document.createElement("div");
    modBox.id = "modBox";
    modBox.style.cssText = "position: fixed; top: 0; left: 0; width: 400px; height: 100vh; background-color: #121212; z-index: 9999; font-size: 20px;\
    overflow-y: auto; color: #cdcdcd;";
    modBox.innerHTML = "<h3 style='width: 100%; text-align:center;'>Tichu Mod Box</h3>";
    modBox.innerHTML += "<h3 style='width: 100%; text-align:center;'><button id='closeModMenuBtn'>close</button></h3>";
    modBox.innerHTML += "<hr>";
    modBox.innerHTML += "<div style='padding: 10px; font-size: 0.7em; border: solid 1px green;'>\
    <input id='tmateCardsInput' type='text' placeholder='TMate Cards'>\
    <button onclick='readTMateCards()'>OK</button>\
    </div>";
    modBox.innerHTML += "<div style='padding: 10px; font-size: 0.7em; border: solid 1px red;'>\
    <button id='openTichuBtn'>Open Tichu</button>\
    <button id='resetAllBtn'>Reset</button>\
    <button id='copyMyCardsBtn'>Copy My Cards</button>\
    <button id='readMyCardsBtn'>Read My Cards</button>\
    </div>";
    modBox.innerHTML += "<div id='cardsArea' style='padding: 10px; font-size: 0.7em; overflow-y: auto; border: solid 1px yellow;'></div>";
    modBox.innerHTML += "<div id='modBoxLog' style='padding: 10px; font-size: 0.7em; height: 200px; overflow-y: auto; border: solid 1px cyan;'></div>";
    document.body.appendChild(modBox);

    document.getElementById("closeModMenuBtn").onclick = closeModMenu;
    document.getElementById("openTichuBtn").onclick = openTichu;
    document.getElementById("resetAllBtn").onclick = resetAll;
    document.getElementById("copyMyCardsBtn").onclick = copyMyCards;
    document.getElementById("readMyCardsBtn").onclick = findMyCurrentCards;

}

function closeModMenu(){
    document.getElementById("modBox").style.display = "none";
}
function openModMenu(){
    document.getElementById("modBox").style.display = "block";
}
function copyMyCards(){
    navigator.clipboard.writeText(myCards.join(" "));
    log("My cards copied to clipboard");
}
function readTMateCards(){
    const cards = document.getElementById("tmateCardsInput").value.trim().split(" ");

    for(var i = 0; i < cards.length; i++){
        if(!rmFromUnkCards(cards[i])){
            tmateCards.push(cards[i]);
        }
    }

    displayCurrentCards();
}

function findGamesButton(){
    return document.getElementById("component_bottom_middle_main_games");
}
function findCloseGamesButton(){
    return document.querySelector("#topBarCloseButton");
}
function findTichuButton(){
    return document.evaluate("/html/body/div/div/div[7]/div[2]/div[2]/div/div/div/div[2]/div[2]/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function findEkkinhshButton(){
    return document.getElementById("go_startstop");
}
function findModBox(){
    return document.getElementById("modBox");
}
function findModBoxLog(){
    return document.getElementById("modBoxLog");
}
function findCardsArea(){
    return document.getElementById("cardsArea");
}
function findMyCurrentCards(){
    const myCardsArea = document.getElementById("hand");

    if(!myCardsArea){
        log("my cards area not found");
        return "";
    }

    for(var i = 0; i < myCardsArea.children.length; i++){
        let cardEl = myCardsArea.children[i];
        let cardname = cardEl.getAttribute("card");

        if(!rmFromUnkCards(cardname)){
            myCards.push(cardname);
        }
    }

    displayCurrentCards();

}
function rmFromUnkCards(cardname){
    // remove from unknown cards
    let newUnknownCards = [];
    let found = false;
    for(var j = 0; j < unknownCards.length; j++){
        if(unknownCards[j] !== cardname){
            newUnknownCards.push(unknownCards[j]);
        }else{
            found=true;
        }
    }
    if(!found){
        //log("ERROR: card not found in unknown cards: "+cardname);
        return 1;
    }
    unknownCards = newUnknownCards;
    return 0;
}
function rmFromMyCards(cardname){
    // remove from my cards
    let newMyCards = [];
    let found = false;
    for(var j = 0; j < myCards.length; j++){
        if(myCards[j] !== cardname){
            newMyCards.push(myCards[j]);
        }else{
            found=true;
        }
    }
    if(!found){
        //log("ERROR: card not found in my cards: "+cardname);
        return 1;
    }
    myCards = newMyCards;
    return 0;
}
function rmFromTmateCards(cardname){
    // remove from tmate cards
    let newTmateCards = [];
    let found = false;
    for(var j = 0; j < tmateCards.length; j++){
        if(tmateCards[j] !== cardname){
            newTmateCards.push(tmateCards[j]);
        }else{
            found=true;
        }
    }
    if(!found){
        //log("ERROR: card not found in tmate cards: "+cardname);
        return 1;
    }
    tmateCards = newTmateCards;
    return 0;
}
function findPlayedCardsArea(){
    return document.getElementById("cardsHolder");
}
function findCurrentPlayedCards(){
    //*[@id="cardsHolder"]
    const playedCardsArea = findPlayedCardsArea();

    if(!playedCardsArea){
        log("played cards area not found");
        return "";
    }

    for(var i = 0; i < playedCardsArea.children.length; i++){
        let cardEl = playedCardsArea.children[i];
        let cardname = cardEl.getAttribute("card");

        if(!rmFromUnkCards(cardname)){
            playedCards.push(cardname);
        }
        if(!rmFromMyCards(cardname)){
            playedCards.push(cardname);
        }
        if(!rmFromTmateCards(cardname)){
            playedCards.push(cardname);
        }
    }

    displayCurrentCards();
}

function log(str){
    findModBoxLog().innerHTML += "<p class='logtry'>" + str + "</p>";

    // scroll into view
    var logtry = document.getElementsByClassName("logtry");
    logtry[logtry.length-1].scrollIntoView();
}

function resetAll(){
    document.title = "DOD Tichu MOD";
    log("resetting all...");
    myCards = [];
    tmateCards = [];
    opp1Cards = [];
    opp2Cards = [];
    playedCards = [];
    unknownCards = [
        "Dragon",
        "Ad", "Ac", "Ah", "As",
        "Kd", "Kc", "Kh", "Ks",
        "Qd", "Qc", "Qh", "Qs",
        "Jd", "Jc", "Jh", "Js",
        "Td", "Tc", "Th", "Ts",
        "9d", "9c", "9h", "9s",
        "8d", "8c", "8h", "8s",
        "7d", "7c", "7h", "7s",
        "6d", "6c", "6h", "6s",
        "5d", "5c", "5h", "5s",
        "4d", "4c", "4h", "4s",
        "3d", "3c", "3h", "3s",
        "2d", "2c", "2h", "2s",
        "Dogs",
        "PQ", // phoenix
        "Mahjong",
    ];
    displayCurrentCards();
}

function callMouseDown(el){
    el.dispatchEvent(new MouseEvent("mousedown", {bubbles: true, cancelable: true, view: window}));
}

function styleCards(cards){
    // sort cards (first special cards then A and then K,Q,...
    cards.sort(function(a, b){
        if(a === "Dragon") return -1;
        if(b === "Dragon") return 1;
        if(a === "PQ") return -1;
        if(b === "PQ") return 1;
        if(a === "Mahjong") return -1;
        if(b === "Mahjong") return 1;
        if(a === "Dogs") return -1;
        if(b === "Dogs") return 1;
        if(a === "Ad") return -1;
        if(b === "Ad") return 1;
        if(a === "Ac") return -1;
        if(b === "Ac") return 1;
        if(a === "Ah") return -1;
        if(b === "Ah") return 1;
        if(a === "As") return -1;
        if(b === "As") return 1;
        if(a === "Kd") return -1;
        if(b === "Kd") return 1;
        if(a === "Kc") return -1;
        if(b === "Kc") return 1;
        if(a === "Kh") return -1;
        if(b === "Kh") return 1;
        if(a === "Ks") return -1;
        if(b === "Ks") return 1;
        if(a === "Qd") return -1;
        if(b === "Qd") return 1;
        if(a === "Qc") return -1;
        if(b === "Qc") return 1;
        if(a === "Qh") return -1;
        if(b === "Qh") return 1;
        if(a === "Qs") return -1;
        if(b === "Qs") return 1;
        if(a === "Jd") return -1;
        if(b === "Jd") return 1;
        if(a === "Jc") return -1;
        if(b === "Jc") return 1;
        if(a === "Jh") return -1;
        if(b === "Jh") return 1;
        if(a === "Js") return -1;
        if(b === "Js") return 1;
        if(a === "Td") return -1;
        if(b === "Td") return 1;
        if(a === "Tc") return -1;
        if(b === "Tc") return 1;
        if(a === "Th") return -1;
        if(b === "Th") return 1;
        if(a === "Ts") return -1;
        if(b === "Ts") return 1;
        if(a === "9d") return -1;
        if(b === "9d") return 1;
        if(a === "9c") return -1;
        if(b === "9c") return 1;
        if(a === "9h") return -1;
        if(b === "9h") return 1;
        if(a === "9s") return -1;
        if(b === "9s") return 1;
        if(a === "8d") return -1;
        if(b === "8d") return 1;
        if(a === "8c") return -1;
        if(b === "8c") return 1;
        if(a === "8h") return -1;
        if(b === "8h") return 1;
        if(a === "8s") return -1;
        if(b === "8s") return 1;
        if(a === "7d") return -1;
        if(b === "7d") return 1;
        if(a === "7c") return -1;
        if(b === "7c") return 1;
        if(a === "7h") return -1;
        if(b === "7h") return 1;
        if(a === "7s") return -1;
        if(b === "7s") return 1;
        if(a === "6d") return -1;
        if(b === "6d") return 1;
        if(a === "6c") return -1;
        if(b === "6c") return 1;
        if(a === "6h") return -1;
        if(b === "6h") return 1;
        if(a === "6s") return -1;
        if(b === "6s") return 1;
        if(a === "5d") return -1;
        if(b === "5d") return 1;
        if(a === "5c") return -1;
        if(b === "5c") return 1;
        if(a === "5h") return -1;
        if(b === "5h") return 1;
        if(a === "5s") return -1;
        if(b === "5s") return 1;
        if(a === "4d") return -1;
        if(b === "4d") return 1;
        if(a === "4c") return -1;
        if(b === "4c") return 1;
        if(a === "4h") return -1;
        if(b === "4h") return 1;
        if(a === "4s") return -1;
        if(b === "4s") return 1;
        if(a === "3d") return -1;
        if(b === "3d") return 1;
        if(a === "3c") return -1;
        if(b === "3c") return 1;
        if(a === "3h") return -1;
        if(b === "3h") return 1;
        if(a === "3s") return -1;
        if(b === "3s") return 1;
        if(a === "2d") return -1;
        if(b === "2d") return 1;
        if(a === "2c") return -1;
        if(b === "2c") return 1;
        if(a === "2h") return -1;
        if(b === "2h") return 1;
        if(a === "2s") return -1;
        if(b === "2s") return 1;
        return 0;
    }
    );

    // add color eg <span style='color: red'>Ad</span>

    let ret="";

    for(var i = 0; i < cards.length; i++){
        let card = cards[i];
        let color = "white";
        if(card === "Dragon" || card === "PQ" || card === "Mahjong" || card === "Dogs") color = "magenta";
        if(card[1] === "d") color = "black";
        if(card[1] === "h") color = "red";
        if(card[1] === "s") color = "blue";
        if(card[1] === "c") color = "#1ced54";
        if(card=="PQ") card = "Phoenix";

        if(card.length === 2) card = card[0];
        ret += "<span style='font-size: 1.6em; color: "+color+"; background-color: white; padding: 1px;'>"+card+"</span> ";
    }

    return "<div>"+ret+"</div>";
}

function displayCurrentCards(){
    const ca = findCardsArea();
    ca.innerHTML = "";
    ca.innerHTML += "<p><span>Me ("+myCards.length+"): </span><span style='color: #929292'; font-size: 1.2em;>"+styleCards(myCards)+"</span></p>";
    ca.innerHTML += "<p><span>TMate ("+tmateCards.length+"): </span><span style='color: red' font-size: 1.2em;>"+styleCards(tmateCards)+"</span></p>";
    //ca.innerHTML += "<p><span>Opponent1 ("+opp1Cards.length+"): </span><span style='color: lime' font-size: 1.2em;>"+styleCards(opp1Cards)+"</span></p>";
    //ca.innerHTML += "<p><span>Opponent2 ("+opp2Cards.length+"): </span><span style='color: lime' font-size: 1.2em;>"+styleCards(opp2Cards)+"</span></p>";
    ca.innerHTML += "<p><span>Played ("+playedCards.length+"): </span><span style='color: cyan' font-size: 1.2em;>"+styleCards(playedCards)+"</span></p>";
    ca.innerHTML += "<p><span>Unknown ("+unknownCards.length+"): </span><span style='color: yellow' font-size: 1.2em;>"+styleCards(unknownCards)+"</span></p>";

    if(playedCards.length + myCards.length + tmateCards.length + opp1Cards.length + opp2Cards.length + unknownCards.length !== 56){
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

    // wait untill tichu button exists, then open tichu and close games
    var tichuButtonInterval = setInterval(function(){
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

// wait untill ekkinhsh button exists, then add event listener
var ekkinhshButtonInterval = setInterval(function(){
    if(findEkkinhshButton()){
        log('ekkinhsh button found');
        findEkkinhshButton().addEventListener("click", function(){
            log('ekkinhsh button clicked');
            resetAll();
        });
        clearInterval(ekkinhshButtonInterval);
    }
}, 1000);


/* ====================== in game ====================== */

resetAll();

// add event listener to detect every time a card is played
// wait until cards area exists, then add event listener
var cardsAreaInterval = setInterval(function(){
    if(findPlayedCardsArea()){
        findPlayedCardsArea().addEventListener("DOMNodeInserted", function(){
            log('card played');
            findCurrentPlayedCards();
        });
        clearInterval(cardsAreaInterval);
    }
}, 1000);

