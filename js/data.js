
/* Global variables */
const deck = document.querySelector('.deck');
const scorePanel = document.querySelector('.score-panel');
const stars = scorePanel.querySelector('.stars');
const moves = scorePanel.querySelector('.moves');

/*
 * Create a list that holds all of your cards
 */

let cards = [];

let gameState = {
    matchedCount: 0,
    moveCount: 0,
    openedCards: []
};
