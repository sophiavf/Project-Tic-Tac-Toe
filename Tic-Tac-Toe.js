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

	// This will be the method of getting the entire board that our UI will eventually need to render it.
	const getBoard = () => board;

	function placeMarker(row, column, player) {
		//checks if cell is available to place the players token. If the move is invalid execution is stopped, prevents players from playing in spots that are already taken
		if (board[row][column] !== null) {
			return;
		} else {
			// Otherwise, I have a valid cell
			board[row][column].addMarker(player);
		}
	}
	// an interface for the rest of our application to interact with the board

	return { getBoard, placeMarker };
};

// factory function pattern
// A Cell represents one "square" on the board and can have one of
// O: Player One's market, X: Player 2's marker
const Cell = () => {
	let value = "";

	// Accept a player's marker to change the value of the cell allowing players to add marks to a specific spot on the board
	const addMarker = (player) => {
		value = player.getMarker;
	};
	// How we will retrieve the current value of this cell through closure
	const getValue = () => value;

	return { addMarker, getValue };
};

// an object to control the flow of the game itself
function gameController(player1, player2) {
	const players = [player1, player2];
	const board = GameBoard();

	let activePlayer = players[0];

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0]; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
	};
	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const playRound = (column, row) => {
		console.log(
			`Dropping ${getActivePlayer().name}'s token into cell ${row}${column}`
		);
		board.placeMarker(row, column, activePlayer);
		//This is where we would check for a winner and handle that logic

		//checks for when the game is over, either s 3-in-a-row or a tie
		//Activates a display element that congratulates the winning player

		// Switch player turn
		switchPlayerTurn();
		printNewRound();
	};

	// Initial play game message
	printNewRound();

	return { getActivePlayer, playRound, getBoard: board.getBoard };
}

// module will leverage an updateScreen pattern https://studio.code.org/docs/concepts/patterns/update-screen-pattern/
// module pattern
//The function that will render the contents of the gameboard array to the webpage
// take some data about our game, such as the state of the game board and which player's turn it is, and update the screen each time a player takes their turn.
var DisplayController = function () {
	const game = GameController();
	const playerTurnDiv = document.querySelector(".turn");
	const boardDiv = document.querySelector(".board");

	const updateScreen = () => {
		// clear the board
		boardDiv.textContent = "";

		// get the newest version of the board and player turn
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		// Display player's turn
		playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

		// Render board squares
		board.forEach((row) => {
			row.forEach((cell, index) => {
				// Anything clickable should be a button!!
				const cellButton = document.createElement("button");
				cellButton.classList.add("cell");
				// Create a data attribute to identify the column
				// This makes it easier to pass into our `playRound` function
				cellButton.dataset.column = index;
				cellButton.textContent = cell.getValue();
				boardDiv.appendChild(cellButton);
			});
		});
	};
	// Add event listener for the board
	function clickHandlerBoard(e) {
		const selectedCell = e.target.dataset.cell;
		// Make sure I've clicked a column and not the gaps in between
		if (!selectedCell) return;

		game.playRound(selectedCell);
		updateScreen();
	}
	boardDiv.addEventListener("click", clickHandlerBoard);

	// Initial render
	updateScreen();

	// button to start/restart
	return { updateScreen, clickHandlerBoard };
};

// factory function pattern
const player = (name, marker) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { getName, getMarker };
};

ScreenController();
