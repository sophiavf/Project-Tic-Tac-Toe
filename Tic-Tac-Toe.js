// Factory function pattern - as we want multiple cells
const Cell = () => {
	let value = null;
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

// Module pattern - as only one needed
//The GameBoard represents the state of the board
var GameBoard = (function () {
	const rows = 3;
	const columns = 3;
	let board = [];

	//a 2d array that will represent the state of the game board
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			const cell = Cell();
			board[i].push(cell);
		}
	}
	//Checks if space is free, then adds marker using cell addMarker method
	function placeMarker(row, column, player) {
		//checks if cell is available to place the players token. If the move is invalid execution is stopped, prevents players from playing in spots that are already taken
		if (board[row][column].getValue() === null) {
			board[row][column].addMarker(player);
		} else {
			// Otherwise, I have a valid cell
			return;
		}
	}
	// This will be the method of getting the entire board that our UI will eventually need to render it.
	const getBoard = () => board;

	//Call on the Cell object class for the value
	const printBoard = () => {
		const boardWithCellValues = board.map((row) =>
			row.map((Cell) => Cell.getValue())
		);
		console.log(boardWithCellValues);
	};

	// an interface for the rest of our application to interact with the board
	return {
		getBoard,
		placeMarker,
		printBoard,
		set board(value) {
			board = value;
		},
	};
})();

// Factory function pattern - as we want multiple players
//  Players stored in objects
const player = (name, marker) => {
	this.name = name;
	this.marker = marker;
	const getName = () => name;
	const getMarker = () => marker;
	return { getName, getMarker };
};
// Module pattern - as only one needed
const GameController = (() => {
	let players = [];
	let activePlayer = players[0];
	const board = GameBoard;
	let winnerFound = false;

	function startGame() {
		let player1 = player(setPlayerName("player1"), "X");
		let player2 = player(setPlayerName("player2"), "O");
		players.push(player1, player2);
		activePlayer = players[0];
	}

	function setPlayerName(player) {
		var name = prompt(`${player} Please enter your username`);
		return name;
	}

	function restartGame() {
		//Clear board
		board.board = board.getBoard().splice(0, 2);
		//Clear players
		players = players.splice(0, 2);
		console.log(players);
		winnerFound = false;
	}

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0]; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
	};
	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		board.printBoard();
		console.log(`${activePlayer.getName()}'s turn.`);
	};

	const playRound = (column, row) => {
		if (winnerFound) {
			return;
		}
		console.log(
			`Dropping ${getActivePlayer().getName()}'s token into row ${row} column ${column}`
		);
		board.placeMarker(row, column, activePlayer);
		//This is where we check for a winner and handle that logic
		checkWinAndTie();
		//Activates a display element that congratulates the winning player

		// Switching player turn, until winner is found
		if (!winnerFound) {
			switchPlayerTurn();
			printNewRound();
		}
	};

	const getPlayers = () => players;

	const checkWinAndTie = () => {
		board.printBoard();
		gameBoard = board.getBoard();
		//Check if horizontal winner
		if (!winnerFound) {
			for (var i = 0; i < gameBoard.length; i++) {
				if (checkCells(i, 0, i, 1, i, 2)) {
					winnerFound = true;
					console.log(winningMessage() + " horizontal");
					return winningMessage();
				}
			}
		} //Check if vertical winner
		if (!winnerFound) {
			for (var i = 0; i < gameBoard.length; i++) {
				if (checkCells(0, i, 1, i, 2, i)) {
					winnerFound = true;
					console.log(winningMessage() + " vertical");
					return winningMessage(gameBoard[i][0].getPlayerId);
				}
			}
		} //Check if diagonal winner
		if (!winnerFound) {
			if (checkCells(0, 0, 1, 1, 2, 2) || checkCells(0, 2, 1, 1, 2, 0)) {
				winnerFound = true;
				console.log(winningMessage() + " diagonal");
				return winningMessage();
			}
		} else if (!gameBoard.filter((Cell) => Cell.value === null).length) {
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
		if (cell1 === cell2 && cell2 === cell3 && cell1 !== null) {
			return true;
		} else {
			return false;
		}
	};
	const winningMessage = () => {
		winner = activePlayer;
		return `Congrats, ${activePlayer.getName()} is the winner!`;
	};

	return {
		startGame,
		restartGame,
		playRound,
		getActivePlayer,
		getPlayers,
		getBoard: board.getBoard,
	};
})();
// Module pattern - as only one needed
// module will leverage an updateScreen pattern https://studio.code.org/docs/concepts/patterns/. update-screen-pattern/
// The function that will render the contents of the GameBoard array to the webpage
var ScreenController = (() => {
	const playerTurnDiv = document.querySelector(".turn");
	const boardDiv = document.querySelector(".gameBoard");
	const startButton = document.querySelector(".start-restart");

	const player1Name = document.querySelector(".player1Name");
	const player2Name = document.querySelector(".player2Name");
	const game = GameController;

	const updateScreen = () => {
		// clear the board
		boardDiv.textContent = "";
		// get the newest version of the board and player turn
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();
		// Display player's turn & checks if active player is not defined
		if (activePlayer !== undefined) {
			playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;
			const playersArray = game.getPlayers();
			console.log(playersArray);
			player1Name.textContent = playersArray[0].getName();
			player2Name.textContent = playersArray[1].getName();
		}
		board.forEach((row, index) => {
			//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
			let rowNum = index;
			row.forEach((cell, index) => {
				//Created each of the clickable cells where people can place
				const cellButton = document.createElement("button");
				cellButton.classList.add("cell");
				// Create a data attribute to identify the row and column making it easier to pass into our `playRound` function https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
				cellButton.dataset.row = rowNum;
				cellButton.dataset.column = index;

				if (cell.getValue() !== null) cellButton.textContent = cell.getValue();
				boardDiv.appendChild(cellButton);
			});
		});
	};
	// Add event listener for the board to detect moves
	function clickHandlerBoard(e) {
		const selectedColumn = e.target.dataset.column;
		const selectedRow = e.target.dataset.row;
		//Checks if the spaces between the cells have been clicked and not the cell
		if (!selectedColumn || !selectedRow) return;
		game.playRound(selectedColumn, selectedRow);
		updateScreen();
	}
	boardDiv.addEventListener("click", clickHandlerBoard);
	startButton.addEventListener("click", () => {
		if (game.getActivePlayer() === undefined) {
			game.startGame();
			toggleButtonText();
		} else if (GameController.getActivePlayer().getName() !== undefined) {
			GameController.restartGame();
			toggleButtonText();
		}
	});

	function toggleButtonText() {
		if (startButton.innerHTML === "Start") {
			startButton.innerHTML = "Restart game";
			updateScreen();
		} else {
			startButton.innerHTML = "Start";
		}
	}

	// Initial screen render
	updateScreen();
})();

ScreenController;
