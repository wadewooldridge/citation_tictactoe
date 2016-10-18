/** main.js - Main JavaScript for Citation Tic-Tac-Toe.
 *
 */

/* Constants. */
var MIN_GAME_WIDTH = 3;
var MAX_GAME_WIDTH = 10;
var MIN_WIN_LENGTH = 3;
var MAX_WIN_LENGTH = 10;
var MIN_PLAYER_COUNT = 2;
var MAX_PLAYER_COUNT = 2;

/* Global data. */

var gGame = null;

/* Program initialization. */
$(document).ready(function () {
    console.log('Document ready, creating game.');

    // Create the global object for the Calculator.
    gGame = new Game();
    gGame.resetGame();
});

/********************************************************************************
 * Game object.
 *      Main Game object to synchronize the overall game play.
 ********************************************************************************/
function Game() {
    console.log('Game: constructor');
    this.gameWidth = null;
    this.winLength = null;
    this.playerCount = null;

    // Main arrays for the child objects.
    this.controlPanel = new ControlPanel();
    this.cells = [];

    // Create all of the player objects, even if we don't use them all.
    this.players = [];
    for (var i = 0; i < MAX_PLAYER_COUNT; i++) {
        this.players.push(new Player(i));
    }

    // Save a copy of this as self.
    var self = this;

    // Reset the game, either based on program initialization or the 'New Game' button.
    this.resetGame = function() {
        console.log('resetGame');

        // Get the settings for this game.
        this.gameWidth = this.controlPanel.getGameWidth();
        this.cellCount = this.gameWidth * this.gameWidth;
        this.winLength = this.controlPanel.getWinLength()
        this.playerCount = this.controlPanel.getPlayerCount();

        // Create the cells.
        this.cells = [];
        for (var i = 0; i < this.cellCount; i++) {
            this.cells.push(new Cell(i));
        }
    }
}

/********************************************************************************
 * Cell object.
 *      Main Cell object to hold the context of one cell in the game.
 ********************************************************************************/
function Cell(cellNum) {
    console.log('Cell ' + cellNum + ': constructor');

    // Save a copy of this as self.
    var self = this;

    // Cell number in main Game array.
    this.cellNum = cellNum;
    this.getCellNum = function() { return this.cellNum };

    // Owner = null if cell free, otherwise player number.
    this.owner = null;
    this.getOwner = function() { return this.owner };

}

/********************************************************************************
 * ControlPanel object.
 *      Main ControlPanel object to handle control panel events and pass the
 *      control panel information to the main Game object.
 ********************************************************************************/
function ControlPanel() {
    console.log('ControlPanel: constructor');

    // Save a copy of this as self.
    var self = this;

    // Return temporary values for now; these will eventually be set from the control elements.
    this.gameWidth = MIN_GAME_WIDTH;
    this.getGameWidth = function() { return this.gameWidth };

    this.winLength = MIN_WIN_LENGTH;
    this.getWinLength = function() { return this.winLength };

    this.playerCount = MIN_PLAYER_COUNT;
    this.getPlayerCount = function() { return this.playerCount };

}

/********************************************************************************
 * Player object.
 *      Main Player object to hold the context of one of the players.
 ********************************************************************************/
function Players(playerNum) {
    console.log('Player ' + playerNum + ': constructor');

    // Save a copy of this as self.
    var self = this;

    // Player number from 0 to MAX_PLAYER_COUNT - 1. Note that players[0] should display to user as 'Player 1'.
    this.playerNum = playerNum;
    this.getPlayerNum = this.playerNum;
    this.getPlayerName = 'Player ' + (this.playerNum + 1);
}
