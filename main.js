/** main.js - Main JavaScript for Citation Tic-Tac-Toe.
 *
 */

/* Constants. */
var MIN_GAME_WIDTH = 3;
var MAX_GAME_WIDTH = 10;
var MIN_WIN_LENGTH = 3;
var MAX_WIN_LENGTH = 10;
var MIN_PLAYER_COUNT = 2;
var MAX_PLAYER_COUNT = 4;

/* Global data. */

var gGame = null;

/* Program initialization. */
$(document).ready(function () {
    console.log('Document ready, creating game.');

    // Create the global object for the Calculator.
    gGame = new Game();
    gGame.resetGame();

    // TODO: Fill in the logo section if not already filled in by HTML.

});

/********************************************************************************
 * Game object.
 *      Main Game object to synchronize the overall game play.
 ********************************************************************************/
function Game() {
    console.log('Game: constructor');
    this.gameWidth = null;
    this.winLength = null;
    this.cellCount = null;
    this.cellsFilled = null;
    this.playerCount = null;

    // Flags for the current gameplay.
    this.currentPlayerNum = 0;
    this.gameOver = false;

    // Main arrays for the child objects.
    this.controlPanel = new ControlPanel(this);
    this.cells = [];

    // Create all of the player objects, even if we don't use them all.
    this.players = [];
    for (var i = 0; i < MAX_PLAYER_COUNT; i++) {
        this.players.push(new Player(this, i));
    }

    // Save a copy of this as self.
    var self = this;

    //
    // Reset the game, either based on program initialization or the 'New Game' button.
    this.resetGame = function() {
        console.log('resetGame');

        // Get the settings for this game.
        this.gameWidth = this.controlPanel.getGameWidth();
        this.cellCount = this.gameWidth * this.gameWidth;
        this.cellsFilled = 0;
        this.winLength = this.controlPanel.getWinLength();
        this.playerCount = this.controlPanel.getPlayerCount();

        // Reset the gameplay information.
        this.currentPlayerNum = 0;
        this.gameOver = false;

        // Create the cells.
        this.cells = [];
        for (var i = 0; i < this.cellCount; i++) {
            var cell = new Cell(this, i);
            this.cells.push(cell);
            $('#gameboard').append(cell.getElement());
        }
    };

    // Notification from the cell that it was clicked.
    this.notifyCellClicked = function(cellNum) {
        console.log('notifyCellClicked: ' + cellNum);
        var cell = self.cells[cellNum];

        if (this.gameOver) {
            console.log('Game already over: ignoring click');
        } else if (cell.getOwner() !== null) {
            // If this is already clicked, ignore it.
            var playerName = self.players[cell.getOwner()].getPlayerName();
            console.log(cell.getCellName() + ' is already owned by ' + playerName);
            // TODO: Add some animation and/or sound if they should not have clicked here.
        } else {
            // The current player now owns the specified cell.
            var player = self.players[this.currentPlayerNum];
            cell.setOwner(self.currentPlayerNum);
            cell.setImageFile(player.getImageFile());

            // Check whether the current play creates a winner or a stalemate.
            var winningCells = self.checkForWinner(cellNum);
            if (winningCells.length >= self.winLength) {
                console.log(player.getPlayerName() + ' is the winner!');
                self.gameOver = true;
                // TODO: Make a pop-up that says the winner.
            } else if (++this.cellsFilled === this.cellCount) {
                console.log('Game over without a winner.');
                self.gameOver = true;
                // TODO: Make a pop-up that says we have a stalemate.
            } else {
                // Now move on to the next player.
                self.selectNextPlayer();
            }
        }
    };

    // Move to the next player in the rotation.
    this.selectNextPlayer = function() {
        console.log('selectNextPlayer: was ' + this.currentPlayerNum);

        // Clear the flag for the current player.
        this.players[this.currentPlayerNum].setCurrent(false);

        // Pick the next one in turn.
        if (this.currentPlayerNum === this.playerCount - 1) {
            this.currentPlayerNum = 0;
        } else {
            this.currentPlayerNum++;
        }

        // Set the flag for the new player.
        this.players[this.currentPlayerNum].setCurrent(true);
        console.log('selectNextPlayer: now ' + this.currentPlayerNum);
    };

    // Check whether the specified cell is a winner. If so, return array of winning cell numbers.
    this.checkForWinner = function(cellNum) {
        console.log('checkForWinner: ' + cellNum);
        var matchArray = [];

        // Check for matches left (offset -1) and right (offset +1).
        matchArray = this.checkMatches(cellNum, 1, 1);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Check for matches up (offset -gameWidth) and down (offset +gameWidth).
        matchArray = this.checkMatches(cellNum, this.gameWidth, this.gameWidth);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Check for matches up-left (offset -gameWidth-1) and down-right (offset +gameWidth+1).
        matchArray = this.checkMatches(cellNum, this.gameWidth + 1, this.gameWidth + 1);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Check for matches upright (offset -gameWidth+1) and down-left (offset +gameWidth-1).
        matchArray = this.checkMatches(cellNum, this.gameWidth - 1, this.gameWidth - 1);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Not a winner; return an empty array as an indication.
        return [];
    };

    // Check for matches in a negative direction plus a positive direction. Return array of matches.
    this.checkMatches = function(cellNum, negOffset, posOffset) {
        console.log('checkMatches: ' + cellNum + '<-' + negOffset + ',' + posOffset + '>');
        var matchOwner = this.cells[cellNum].getOwner();
        var retArray = [cellNum];
        var curCellNum;

        // Check cells in the negative direction while still on the board, adding matches.
        curCellNum = cellNum - negOffset;
        while (curCellNum >= 0 && this.cells[curCellNum].getOwner() == matchOwner) {
            console.log('Match at ' + curCellNum);
            retArray.push(curCellNum);
            curCellNum -= negOffset;
        }

        // Check cells in the positive direction while still on the board, adding matches.
        curCellNum = cellNum + posOffset;
        while (curCellNum < self.cellCount && this.cells[curCellNum].getOwner() == matchOwner) {
            console.log('Match at ' + curCellNum);
            retArray.push(curCellNum);
            curCellNum += posOffset;
        }
        console.log(retArray);
        return retArray;
    };

}

/********************************************************************************
 * Cell object.
 *      Main Cell object to hold the context of one cell in the game.
 ********************************************************************************/
function Cell(parent, cellNum) {
    // Save a copy of this as self.
    var self = this;

    // Parent = the Game object that owns the cell.
    this.parent = parent;

    // Cell number in main Game array.
    this.cellNum = cellNum;
    this.getCellNum = function() { return this.cellNum };

    // Cell name is just shorthand for 'Cell n'.
    this.cellName = 'Cell ' + cellNum;
    this.getCellName = function() { return this.cellName };
    console.log(this.cellName + ': constructor');

    // Owner = null if cell free, otherwise player number.
    this.owner = null;
    this.getOwner = function() { return this.owner };
    this.setOwner = function(playerNum) {
        console.log(this.cellName + ': setOwner to ' + playerNum);
        this.owner = playerNum;
    };

    // Last played flag, set for the last cell that was played successfully.
    this.lastPlayed = false;
    this.isLastPlayed = function() { return this.lastPlayed };
    this.setLastPlayed = function() {
        console.log(this.cellName + ': setLastPlayed');
        // TODO: Add class that highlights the cell.
        this.lastPlayed = true;
    };
    this.clearLastPlayed = function() {
        console.log(this.cellName + ': clearLastPlayed');
        // TODO: Remove class that highlights the cell.
        this.lastPlayed = false;
    };

    // Main click handler for the cell.
    this.onClick = function() {
        console.log(self.cellName + ': clicked');
        self.parent.notifyCellClicked(self.cellNum);
    };

    // Element for the cell itself.
    var cellPercent = Math.floor(100 / parent.controlPanel.getGameWidth()).toString() + '%';
    this.element = $('<div>').addClass('cell').css({width: cellPercent, height: cellPercent});
    this.element.on('click', this.onClick);
    this.getElement = function() { return this.element };

    // Image associated with the cell.
    this.setImageFile = function(filename) {
        console.log(self.cellName + ': setImageFile: ' + filename);
        this.imageFile = filename;
        this.imgElement = $('<img>').attr('src', this.imageFile);
        this.element.append(this.imgElement);
    };

}

/********************************************************************************
 * ControlPanel object.
 *      Main ControlPanel object to handle control panel events and pass the
 *      control panel information to the main Game object.
 ********************************************************************************/
function ControlPanel(parent) {
    console.log('ControlPanel: constructor');

    // Save a copy of this as self.
    var self = this;

    // Parent = the Game object that owns the cell.
    this.parent = parent;

    // Main element for the control panel div.
    this.element = $('#control');
    this.getElement = function() { return this.element };

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
function Player(parent, playerNum) {
    console.log('Player ' + playerNum + ': constructor');

    // Save a copy of this as self.
    var self = this;

    // Parent = the Game object that owns the cell.
    this.parent = parent;

    // Player number from 0 to MAX_PLAYER_COUNT - 1. Note that players[0] should display to user as 'Player 1'.
    this.playerNum = playerNum;
    this.getPlayerNum = this.playerNum;
    this.getPlayerName = function() { return 'Player ' + (this.playerNum + 1) };

    // Element for the player area for this player.
    this.elementSelector = '#player' + playerNum;
    this.element = $(this.elementSelector);
    this.getElement = function() { return this.element };

    // Pick a picture that goes with this player number.
    // TODO: Allow user to select which image they want for their player icon.
    switch (playerNum) {
        case 0:
            this.imageFile = 'images/Charles_Dickens.png';
            break;
        case 1:
            this.imageFile = 'images/George_Martin.png';
            break;
        case 2:
            this.imageFile = 'images/Stephen_King.png';
            break;
        case 3:
            this.imageFile = 'images/William_Shakespeare.png';
            break;
        default:
            console.log('Invalid playerNum ' + playerNum);
            this.imageFile = null;
            break;
    }
    this.getImageFile = function() { return this.imageFile };
    $(this.element).attr('src', this.imageFile);

    // Current flag of whether this is the current player.
    this.current = false;
    this.setCurrent = function(current) {
        console.log(this.getPlayerName() + ': setCurrent: ' + current);
        this.current = current;
        // TODO: Add/remove class based on whether this player is current.
    }
}
