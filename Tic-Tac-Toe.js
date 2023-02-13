// module pattern
//The Gameboard represents the state of the board
var GameBoard = function () {
	"use strict";
	const rows = 3;
	const columns = 3;
	const board = [];

	//a 2d array that will represent the state of the game board

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i].push(Cell());
		}
	}

	function placeToken(column, row, player) {
		//checks if cell is available to place the players token
	}
};



// module will leverage an updateScreen pattern.
// module pattern
//The function that will render the contents of the gameboard array to the webpage
// take some data about our game, such as the state of the game board and which player's turn it is, and update the screen each time a player takes their turn.
var displayController = function () {};

// factory function pattern
const player = (name) => {
	return { name };
};



// allows players to add marks to a specific spot on the board, and then ties it to the DOM, letting players click on the gameboard to place their marker.
// prevents players from playing in spots that are already taken

// an object to control the flow of the game itself
// checks for when the game is over, by checking for 3-in-a-row and a tie
function playRound() {}
