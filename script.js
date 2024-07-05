var arr = [];  // Initialize as empty array

function createGrid() {
	// Create the grid dynamically
	const sudokuContainer = document.getElementById('sudoku-container');
	for (let i = 0; i < 9; i++) {
	for (let j = 0; j < 9; j++) {
		const cell = document.createElement('div');
		cell.classList.add('cell');
		cell.id = i * 9 + j;
		arr.push(cell);  // Add cell to the array
		sudokuContainer.appendChild(cell);
	}
	}
}

createGrid();  // Call the function to create the grid on page load

var board = [[], [], [], [], [], [], [], [], []];

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		if (board[i][j] != 0) {
		arr[i * 9 + j].innerText = board[i][j];
		} else {
		arr[i * 9 + j].innerText = '';
		}
	}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest();
	xhrRequest.onload = function () {
	var response = JSON.parse(xhrRequest.response);
	console.log(response);
	board = response.board;
	FillBoard(board);
	};
	xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
	xhrRequest.send();
}

SolvePuzzle.onclick = () => {
	SudokuSolver(board, 0, 0, 9);
};

function SudokuSolver(board, i, j, n) {
	// Write your Code here (replace this comment with your Sudoku solving logic)
}