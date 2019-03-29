/* Helper functions */

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

function cardSymbol(card) {
    return card.firstElementChild.classList[1];
}

/* Score-panel functions*/

function resetGameState() {
    // Reset gameState variables
    const date = new Date();
    gameState.startTime = date;
    gameState.endTime = date;
    gameState.timer = null;
    gameState.matchedCount = 0;
    gameState.moveCount = 0;
    gameState.starCount = 3;
    gameState.openedCards = [];
    // Event handler will be removed every time player wins
    if (gameState.registeredDeckHandler === false) {
        deck.addEventListener('click', selectCard);
        gameState.registeredDeckHandler = true;
    }
}

function updateScorePanel() {
    // Repaint elements on score panel
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
    if (count > MAXSTARCOUNT) {
        console.error("Star count cannot exceed 3");
    }
    gameState.starCount = count;
    stars.innerHTML = '';
    for (let i=0; i < count; i++) {
        stars.insertAdjacentHTML('beforeend', '<li><i class="fa fa-star"></i></li>');
    }
    for (let i=count; i < MAXSTARCOUNT; i++) {
        stars.insertAdjacentHTML('beforeend', '<li><i class="fa fa-star-o"></i></li>');
    }
}

/* Timer functions */
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

function startTimer() {
    gameState.startTime = new Date();
    gameState.timer = setInterval(setTimer, 1000);
}

function stopTimer() {
    clearInterval(gameState.timer);
}

 /* Card click event handling */
function selectCard(evt) {
    //
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
        // once you have two cards check for match and invoke matchUpdate or mismatchUpdate
        if (cardSymbol(gameState.openedCards[0]) === cardSymbol(gameState.openedCards[1])) {
            matchUpdate();
        } else {
            for (let card of gameState.openedCards) {
                card.classList.add('animated', 'wobble', 'mismatch');
            }
            /* Remove animation after 1 sec */
            setTimeout(mismatchUpdate, 1000);
        }
    }
}

function movesUpdate() {
    gameState.moveCount += 1;
    moves.innerText = gameState.moveCount;
    updateScorePanel();

}

function matchUpdate() {
    //Animate with rubberband
    for (let card of gameState.openedCards) {
        card.classList.add('match', 'animated', 'rubberBand');
    }
    gameState.openedCards = [];
    // Increment match count and check for all match
    gameState.matchedCount += 2;
    if (gameState.matchedCount === cards.length) {
        endGame();
    }
}

function mismatchUpdate() {
    //Animate with wobble and paint red
    for (let card of gameState.openedCards) {
        card.classList.remove('mismatch', 'animated', 'wobble');
        card.classList.remove('open', 'show');
    }
    gameState.openedCards = [];
}

/* Winning Modal */
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

    // add close button
    modal.addFooterBtn('Close', 'tingle-btn tingle-btn--default', function() {
        modal.close();
    });

        // add play again button
    modal.addFooterBtn('Play again', 'tingle-btn tingle-btn--primary', function() {
        // restart game and close modal
        initGame();
        modal.close();
    });

}

function openModal() {
    // Template literal to fill with actual win numbers
    let winHTML = `<div><h1>Congratulation! You won!</h1>
                     <h3>Your timing is ${getTimeElapsedString()} and you won in ${gameState.moveCount} moves. That's ${gameState.starCount} stars!</h3>
                     </div>`;
    modal.setContent(winHTML);
    modal.open();
}

/* (Re)start game */

function initGame() {
    stopTimer();
    resetGameState();
    // Reset deck
    deck.innerHTML = '';
    cards = shuffle(cards);
    for (let card of cards) {
        // Re-insert cards into deck
        const cardli = document.createElement('li');
        cardli.classList.add('card');
        cardli.innerHTML = `<i class="fa ${card}"></i>`;
        deck.appendChild(cardli);
    }
    // Repaint score-panel with new gameState
    updateScorePanel();
}

/* End game */

function endGame() {
    stopTimer();
    if (gameState.registeredDeckHandler) {
        /* Prevent clicks from having any effect until restart */
        deck.removeEventListener('click', selectCard);
        gameState.registeredDeckHandler = false;
    }
    openModal();
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
    restart.addEventListener('click', initGame);
    initGame();
}

doOnce();
