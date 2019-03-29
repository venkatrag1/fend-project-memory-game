/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function resetGameState() {
    const date = new Date();
    gameState.startTime = date;
    gameState.endTime = date;
    gameState.timer = null;
    gameState.matchedCount = 0;
    gameState.moveCount = 0;
    gameState.openedCards = [];
    if (gameState.registeredDeckHandler === false) {
        deck.addEventListener('click', selectCard);
        gameState.registeredDeckHandler = true;
    }
}


function initGame() {
    resetGameState();
    // check and add if not present - deck.addEventListener('click', selectCard); - cos reset in middle of game won't remove- endgame may removebased on cancel
    // Reset deck
    deck.innerHTML = '';
    cards = shuffle(cards);
    for (let card of cards) {
        const cardli = document.createElement('li');
        cardli.classList.add('card');
        cardli.innerHTML = `<i class="fa ${card}"></i>`;
        deck.appendChild(cardli);
    }
    // Reset score-panel
    updateScorePanel();
}

function updateScorePanel() {
    moves.innerText = gameState.moveCount;
    if (gameState.moveCount === 0) {
        setStars(3);
        setTimer();
    } else if (gameState.moveCount === 1) {
        startTimer();
    } else if (gameState.moveCount === 20) {
        setStars(2);
    } else if (gameState.moveCount === 40) {
        setStars(1);
    }
}

function setStars(count) {
    if (count > STARCOUNT) {
        console.error("Star count cannot exceed 3");
    }
    stars.innerHTML = '';
    for (let i=0; i < count; i++) {
        stars.insertAdjacentHTML('beforeend', '<li><i class="fa fa-star"></i></li>');
    }
    for (let i=count; i < STARCOUNT; i++) {
        stars.insertAdjacentHTML('beforeend', '<li><i class="fa fa-star-o"></i></li>');
    }
}

function startTimer() {
    gameState.startTime = new Date();
    gameState.timer = setInterval(setTimer, 1000);
}

function stopTimer() {
    clearInterval(gameState.timer);
}

function setTimer() {
    gameState.endTime = new Date();
    timer.innerText = getTimeElapsedString();
}

function getTimeElapsedString() {
    const seconds = (gameState.endTime - gameState.startTime) / 1000;
    let date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
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
    updateScorePanel();

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
    stopTimer();
    // Pop up and then deregister if needed
    if (gameState.registeredDeckHandler) {
        deck.removeEventListener('click', selectCard);
        gameState.registeredDeckHandler = false;
    }
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
    initModal();
    restart.addEventListener('click', openModal);
    initGame();
}

function initModal() {
    modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function() {
    },
    onClose: function() {
    },
    beforeClose: function() {
        return true;
    }
    });

    // add a button
    modal.addFooterBtn('Close', 'tingle-btn tingle-btn--default', function() {
        // here goes some logic
        modal.close();
    });

        // add a button
    modal.addFooterBtn('Play again', 'tingle-btn tingle-btn--primary', function() {
        // here goes some logic
        initGame();
        modal.close();
    });

}

function openModal() {
    let winHTML = `<div><h1>Congratulation! You won!</h1>
                     <h3>Your timing is ${getTimeElapsedString()} and won in ${gameState.moveCount} moves</h3>
                     </div>`;
    modal.setContent(winHTML);
    modal.open();
}


doOnce();