// Module pattern - as only one needed
//The GameBoard represents the state of the board
var GameBoard = function () {
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
	//Checks if space is free, then adds marker using cell addMarker method
	function placeMarker(row, column, player) {
		//checks if cell is available to place the players token. If the move is invalid execution is stopped, prevents players from playing in spots that are already taken
		if (board[row][column].getMarker === "") {
			return;
		} else {
			// Otherwise, I have a valid cell
			board[row][column].addMarker(player);
		}
	}
	// This will be the method of getting the entire board that our UI will eventually need to render it.
	const getBoard = () => board;

	//Call on the Cell object class for the value
	const printBoard = () => {
		const boardWithCellValues = board.map((row) =>
			row.map((cell) => cell.getValue())
		);
		console.log(boardWithCellValues);
	};

	// an interface for the rest of our application to interact with the board
	return { getBoard, placeMarker, printBoard };
};
// Factory function pattern - as we want multiple cells
const Cell = () => {
	let value = "";
	let playerId;
	// Accept a player's marker to change the value of the cell allowing players to add marks to a specific spot on the board
	const addMarker = (player) => {
		value = player.getMarker();
		playerId = player;
	};
	// How we will retrieve the current value of the cell marker through closure
	const getValue = () => value;
	const getPlayerId = () => playerId;
	return { addMarker, getValue, getPlayerId };
};
// Factory function pattern - as we want multiple players
//  Players stored in objects
const player = (name, marker) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { getName, getMarker };
};
// Module pattern - as only one needed
var GameController = function (player1, player2) {
	const players = [player1, player2];
	const board = GameBoard();
	let activePlayer = players[0];
	let winner;
	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0]; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
	};
	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().getName()}'s turn.`);
	};

	const playRound = (column, row) => {
		console.log(
			`Dropping ${activePlayer.getName()}'s token into cell ${row}${column}`
		);
		board.placeMarker(row, column, activePlayer);
		//This is where we would check for a winner and handle that logic
		checkWinAndTie();
		//checks for when the game is over, either s 3-in-a-row or a tie
		//Activates a display element that congratulates the winning player

		// Switching player turn
		switchPlayerTurn();
		printNewRound();
	};

	const checkWinAndTie = () => {
		let winnerFound = false;
		board.printBoard();
		gameBoard = board.getBoard();
		//Check if horizontal winner
		if (!winnerFound) {
			for (var i = 0; i < gameBoard.length; i++) {
				if (checkCells(i, 0, i, 1, i, 2)) {
					winnerFound = true;
					console.log(winningMessage() + "horizontal");
					return winningMessage();
				} else {
					continue;
				}
			}
		} //Check if vertical winner
		if (!winnerFound) {
			for (var i = 0; i < gameBoard.length; i++) {
				if (checkCells(0, i, 1, i, 2, i)) {
					winnerFound = true;
					console.log(winningMessage() + "vertical");
					return winningMessage(gameBoard[i][0].getPlayerId);
				}
			}
		} //Check if diagonal winner
		if (!winnerFound) {
			if (checkCells(0, 0, 1, 1, 2, 2) || checkCells(0, 2, 1, 1, 2, 0)) {
				winnerFound = true;
				console.log(winningMessage() + "diagonal");
				return winningMessage();
			}
		} else if (!gameBoard.filter((cell) => cell.value === undefined).length) {
			return `It's a tie`;
			// if none of the condition above are met, the game continues
		} else {
			return;
		}
	};

	//Checks to see if 3 cells are equal to one another & makes sure to exclude empty cells
	const checkCells = (a, b, c, d, e, f) => {
		const cell1 = gameBoard[a][b].getValue();
		const cell2 = gameBoard[c][d].getValue();
		const cell3 = gameBoard[e][f].getValue();
		console.log(`${cell1} + ${cell2} + ${cell3}`);
		if (cell1 === cell2 && cell2 === cell3 && cell1 !== "") {
			return true;
		} else {
			return false;
		}
	};
	const winningMessage = () => {
		winner = activePlayer; 
		return `Congrats, ${activePlayer.getName()} is the winner!`;
	};
	return { playRound, getActivePlayer };
};

const player1 = player("Jake", "X");
const player2 = player("Jet", "O");
const game = GameController(player1, player2);
game.playRound(0, 1, player1);
game.playRound(0, 2, player1);
game.playRound(1, 1, player2);
game.playRound(0, 0, player2);
game.playRound(2, 1, player1);
game.playRound(2, 2, player2);
game.playRound(2, 1);
