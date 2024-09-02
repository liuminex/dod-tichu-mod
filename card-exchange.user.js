// ==UserScript==
// @name         Card exchange
// @version      0.2
// @description  Tichu Mod Script for exchanging cards bypassing CSP
// @author       Jason-Manos
// @match        https://jsites.xyz/*
// @run-at       document-end
// ==/UserScript==

import('https://cdn.jsdelivr.net/gh/liuminex/dod-tichu-mod@351af16/trystero-nostr.min.js')
    .then(({ joinRoom}) => {
        const room = joinRoom({appId: 'dod-tichu-mod'}, 'card-exchange');

        room.onPeerJoin((peer) => {
            console.log('peer joined', peer);
        });

        const [sendCards, getCards] = room.makeAction('cards');

        window.addEventListener('message', async function(event) {
            if(event.origin !== 'https://www.dod.gr') return;
            const cards = event.data;
            console.log('Sending cards', cards);
            sendCards({cards: cards});
        }, false);

        getCards((data, peerId) => {
            console.log('Received cards', data);
            window.opener.postMessage(data, 'https://www.dod.gr');
        });
    });