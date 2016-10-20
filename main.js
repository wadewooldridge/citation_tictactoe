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
        self.makePlayersActive();
        // Get the settings for this game.
        this.gameWidth = this.controlPanel.getGameWidth();
        this.cellCount = this.gameWidth * this.gameWidth;
        this.cellsFilled = 0;
        this.winLength = this.controlPanel.getWinLength();
        this.playerCount = this.controlPanel.getPlayerCount();

        // Reset the gameplay information.
        this.currentPlayerNum = 0;
        this.gameOver = false;

        // Delete any old cells.
        $('#gameboard .cell').remove();

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
        self.savedCellNum = cellNum;
        var cell = self.cells[cellNum];

        if (this.gameOver) {
            console.log('Game already over: ignoring click');
        } else if (cell.getOwner() !== null) {
            // If this is already clicked, ignore it.
            var playerName = self.players[cell.getOwner()].getPlayerName();
            console.log(cell.getCellName() + ' is already owned by ' + playerName);
            // TODO: Add some animation and/or sound if they should not have clicked here.
        } else {
            // TODO: Currently has 1-in-3 chance of asking a question; this could be made user-selectable.
            if (Math.random() < 0.667) {
                // No question; complete the turn immediately.
                self.completeCurrentTurn(cellNum);
            } else {
                // Make the user answer a question before completing their turn.
                var correct = askRandomQuestion(self);
                console.log('notifyCellClicked: correct: ', correct);


            }
        }
    };

    // Complete the current player's turn. If there is no question, this happens directly and is passed
    // undefined as the success value.  If there is a question, this happens from the modal close, and
    // is passed the success value of whether they got the question right.
    this.completeCurrentTurn = function(cellNum, success) {
        if (cellNum === null) {
            cellNum = self.savedCellNum;
        }
        if (success === undefined) {
            success = true;
        }
        console.log('completeCurrentTurn: ' + cellNum + ', ' + success);

        if (success) {
            var cell = self.cells[cellNum];

            // The current player now owns the specified cell.
            var player = self.players[this.currentPlayerNum];
            cell.setOwner(self.currentPlayerNum);

            // Check whether the current play creates a winner or a stalemate.
            var winningCells = self.checkForWinner(cellNum);
            if (winningCells.length >= self.winLength) {
                var message = player.getPlayerName() + ' is the winner!'
                console.log(message);
                self.gameOver = true;
                displayNotifyModal(message);
            } else if (++this.cellsFilled === this.cellCount) {
                console.log('Game over without a winner.');
                self.gameOver = true;
                displayNotifyModal('OOPS! The game over with no winner.')
            }
        } else {
            console.log('completeCurrentTurn: ignoring failed question.')
        }

        // Now move on to the next player.
        self.selectNextPlayer();
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

        // Check for matches left and right (x offset 1, y offset 0).
        matchArray = this.checkMatches(cellNum, 1, 0);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Check for matches up and down (x offset 0, y offset 1).
        matchArray = this.checkMatches(cellNum, 0, 1);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Check for matches up-left and down-right (x offset 1, y offset 1).
        matchArray = this.checkMatches(cellNum, 1, 1);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Check for matches up-right and down-left (x offset 1, y offset -1).
        matchArray = this.checkMatches(cellNum, 1, -1);
        if (matchArray.length >= this.winLength) {
            return matchArray;
        }

        // Not a winner; return an empty array as an indication.
        return [];
    };

    // Check for matches in a negative direction plus a positive direction. Return array of matches.
    this.checkMatches = function(cellNum, xOffset, yOffset) {
        console.log('checkMatches: ' + cellNum + ' <' + xOffset + ',' + yOffset + '>');
        var cellY = Math.floor(cellNum / this.gameWidth);
        var cellX = cellNum - (cellY * this.gameWidth);
        console.log('checkMatches: at (', + cellX + ',' + cellY + ')');

        var matchOwner = this.cells[cellNum].getOwner();
        var retArray = [cellNum];
        var curCellNum, curX, curY;

        // The cellOffset factors in the xOffset and the yOffset.
        var cellOffset = (yOffset * this.gameWidth) + xOffset;

        // Get the x and y positions of the current cell.
        curCellNum = cellNum - cellOffset;
        curX = cellX - xOffset;
        curY = cellY - yOffset;

        // Check cells in the negative direction while still on the board, adding matches.
        console.log('Check: ' + curCellNum + ' = (' + curX + ',' + curY + ')');
        while (curCellNum >= 0 && curX >= 0 && curY >= 0 &&
                curCellNum <= this.cellCount && curX < this.gameWidth && curY < this.gameWidth &&
                this.cells[curCellNum].getOwner() == matchOwner) {
            console.log('Match at ' + curCellNum);
            retArray.push(curCellNum);
            curCellNum -= cellOffset;
            curX -= xOffset;
            curY -= yOffset;
        }

        // Get the x and y positions of the current cell.
        curCellNum = cellNum + cellOffset;
        curX = cellX + xOffset;
        curY = cellY + yOffset;

        // Check cells in the positive direction while still on the board, adding matches.
        console.log('Check: ' + curCellNum + ' = (' + curX + ',' + curY + ')');
        while (curCellNum >= 0 && curX >= 0 && curY >= 0 &&
                curCellNum <= this.cellCount && curX < this.gameWidth && curY < this.gameWidth &&
                this.cells[curCellNum].getOwner() == matchOwner) {
            console.log('Match at ' + curCellNum);
            retArray.push(curCellNum);
            curCellNum += cellOffset;
            curX += xOffset;
            curY += yOffset;
        }
        console.log(retArray);
        return retArray;
    };
    this.makePlayersActive = function() {
        console.log('this is the makePlayers Active function');
        if (self.playerCount < 4){
            self.players[3].setInactive();

        } else {
            self.players[3].setActive();
        }

        if (self.playerCount < 3) {
            self.players[2].setInactive();

        } else {
            self.players[2].setActive();

        }
    }

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
        this.element.addClass('player'+ playerNum);
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
    this.getGameWidth = function() {return this.gameWidth};

    //Function for getting the Game Width from the sliders
    $('#gameSize').change(function() {
         var gameCells = parseInt($('#gameSize').val());
        self.gameWidth = gameCells;
        console.log('game width is now ' + self.gameWidth);
        $('span.gameSizeText').text(self.gameWidth);
    });

    this.winLength = MIN_WIN_LENGTH;
    this.getWinLength = function() { return this.winLength };

    //Function for getting the Win Length from the sliders
    $('#winLength').change(function() {
        var winWay = parseInt($('#winLength').val());
        self.winLength = winWay;
         if(self.winLength > self.gameWidth) {
             self.winLength = self.gameWidth;
             console.log('winLength was greater than gameLength so winLength is ' + self.winLength);
         } else {
             self.winLength = winWay;
         }
          var winLengthText;
          $('span.winLengthText').text(self.winLength);
          //winLengthText = winLengthText.append(self.winLength);
    });

    this.playerCount = MIN_PLAYER_COUNT;
    this.getPlayerCount = function() { return this.playerCount };

    console.log('before newGame function');
    $('#newGame').click(function() {
        console.log('newGame is being called');
        self.parent.resetGame();

    });

    //Gets the amount of players from radio buttons
    $('input[name=playerCount]').change(function() {
        var playerAmount;
        playerAmount = parseInt($('input[type=radio]:checked').val());
        self.playerCount = playerAmount;
        console.log(self.playerCount + ' players selected');

    });


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
    this.elementSelector = '.player' + playerNum;
    this.element = $(this.elementSelector);
    this.getElement = function() { return this.element };

    //Functions to make players inactive
    this.setInactive = function() {
        console.log('Setting the player to inactive');
        $(self.element).addClass('inactive');
    };
    this.setActive = function() {
        console.log('setting the player to active');
        $(self.element).removeClass('inactive');
    };

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
        if(current) {
            console.log('At current', self.element);
            $(self.element).addClass('current-player');
        }
        else {
            $(self.element).removeClass('current-player');
        }
    }
}
