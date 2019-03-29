
/* DOM elements */
const deck = document.querySelector('.deck');
const scorePanel = document.querySelector('.score-panel');
const stars = scorePanel.querySelector('.stars');
const moves = scorePanel.querySelector('.moves');
const timer = scorePanel.querySelector('.timer');
const restart = scorePanel.querySelector('.restart');
var modal = null;

/* Global variables */
const MAXSTARCOUNT = 3;

let gameState = {
    startTime: new Date(),
    endTime: this.startTime,
    timer: null,
    matchedCount: 0,
    moveCount: 0,
    starCount: 3,
    openedCards: [],
    registeredDeckHandler: false
};
/*
 * Create a list that holds all of your cards
 */

let cards = [];



