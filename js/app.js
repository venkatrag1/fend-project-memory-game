/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function initGame() {
    deck.innerHTML = '';
    cards = shuffle(cards);
    for (let card of cards) {
        const cardli = document.createElement('li');
        cardli.classList.add('card');
        cardli.innerHTML = `<i class="fa ${card}"></i>`;
        deck.appendChild(cardli);
    }
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function selectCard(evt) {
    //Get to the parent if necessary
      //Make sure li can capture
    // if not already open then add open and push to list
    // check for match
    if (evt.target.nodeName === "LI") {
        const card = evt.target;
        //Send for match only if its a not-opened card
        if (!card.classList.contains('open') ||
            !card.classList.contains('show')) {
            checkForMatch(card);
        }
    }
}

function checkForMatch(card) {
    if (gameState.openedCards.length > 1) {
        //Won't run until openedCard list has been reset
        return;
    }
    card.classList.add('open', 'show');
    gameState.openedCards.push(card);
    movesUpdate();
    if (gameState.openedCards.length === 2) {
        if (cardSymbol(gameState.openedCards[0]) === cardSymbol(gameState.openedCards[1])) {
            matchUpdate();
        } else {
            for (let card of gameState.openedCards) {
                card.classList.add('animated', 'wobble', 'mismatch');
            }
            setTimeout(mismatchUpdate, 1000);
        }
    }
}

function movesUpdate() {
    gameState.moveCount += 1;
    moves.innerText = gameState.moveCount;
    // if (moveCount === 20) {
    //
    // }

}

function cardSymbol(card) {
    return card.firstElementChild.classList[1];
}

function matchUpdate() {
    //Animate
    for (let card of gameState.openedCards) {
        card.classList.add('match', 'animated', 'rubberBand');
    }
    gameState.openedCards = [];
    gameState.matchedCount += 2;
    if (gameState.matchedCount === cards.length) {
        endGame();
    }
}

function endGame() {

}

function mismatchUpdate() {
    //Animate
    for (let card of gameState.openedCards) {
        card.classList.remove('mismatch', 'animated', 'wobble');
        card.classList.remove('open', 'show');
    }
    gameState.openedCards = [];
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function doOnce() {
    Array.from(deck.children).forEach(function (card, index) {
        cards.push(cardSymbol(card));
    });
    initGame();
    deck.addEventListener('click', selectCard);
}


doOnce();