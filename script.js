const newGameButton = document.getElementById('new-game');
const resetButton = document.getElementById('reset');
const difficulty = document.getElementById('difficulty');
const sudokuGrid = document.getElementById('sudoku-grid');
let selectedCell = null;

function createSudokuGrid() {
  sudokuGrid.innerHTML = '';
  let type = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const threeByThree = document.createElement('div');
      for(let k = 0; k < 3; k++){
        for(let l=0; l < 3; l++){
          const cell = document.createElement('div');
          cell.id = 'id'+(l + 9*k + 3*j+ 27*i);
          cell.className = 'cell';
          threeByThree.appendChild(cell);
        }
      }
      threeByThree.className = "class"+type;
      sudokuGrid.appendChild(threeByThree); 
      type = (type+1)%2;  
    }
  }

  document.querySelectorAll('.cell').forEach(button => {
    button.addEventListener('click', onCellClick);
  });
}

let sudokuBoard = [];
let solvedBoard = [];

function fillBoard(puzzleValues) {
  for(let i=0; i<9; i++){
    for(let j=0; j<9; j++){
      const cell = document.querySelector('#id'+(9*i+j));
      if(cell){
        if(puzzleValues[i][j]==0){
          cell.innerText ='';
        }
        else{
          cell.innerText = puzzleValues[i][j];
        }
      } 
    }
  }
}

async function getPuzzleValues() {
  let difficultyLevel = difficulty.value;
  const url = `https://sugoku.onrender.com/board?difficulty=${difficultyLevel}`;
  const response = await fetch(url);
  let values = await response.json();
  return values.board; 
}

async function initializeGame() {
  createSudokuGrid();
  sudokuBoard = await getPuzzleValues();
  console.log("Initial Board:", sudokuBoard);
  solvedBoard = JSON.parse(JSON.stringify(sudokuBoard)); // Deep copy for the solved board
  solveBoard(solvedBoard);
  console.log("Solved Board:", solvedBoard);
  fillBoard(sudokuBoard);
}

initializeGame();

newGameButton.addEventListener('click', initializeGame);
resetButton.addEventListener('click', () => fillBoard(sudokuBoard));
document.querySelectorAll('.number').forEach(button => {
  button.addEventListener('click', onNumberClick);
});

function onCellClick(event) {
  if (selectedCell) {
    selectedCell.classList.remove('highlight');
  }
  selectedCell = event.target;
  selectedCell.classList.add('highlight');
}

function onNumberClick(event) {
  if(selectedCell && (selectedCell.innerText == '' || selectedCell.classList.contains('incorrect'))){
    const {row, col} = getRowColFromId(selectedCell.id);
    const selectedNumber = parseInt(event.target.innerText);

    if(solvedBoard[row][col] === selectedNumber){
      selectedCell.innerText = selectedNumber;
      selectedCell.classList.remove('incorrect');
    }
    else{
      selectedCell.innerText = selectedNumber;
      console.log('incorrect');
      selectedCell.classList.add('incorrect');
    }
  }
}

function getRowColFromId(cellId){
  const idNumber = parseInt(cellId.replace('id', ''));
  const row = Math.floor(idNumber/9);
  const col = idNumber % 9;
  return {row, col};
}

function isSafe(board, row, col, value){
  // in row
  for(let j= 0; j<9; j++){
    if(board[row][j] == value){
      return false;
    }
  }
  // in column
  for(let i= 0; i<9; i++){
    if(board[i][col] == value){
      return false;
    }
  }
  // in 3x3 box
  let startRow = row - row % 3;
  let startCol = col - col % 3;
  for(let i = startRow; i < startRow + 3; i++){
    for(let j = startCol; j < startCol + 3; j++){
      if(board[i][j] == value){
        return false;
      }
    }
  }
  return true;
}

function solveBoard(board){
  for(let row = 0; row < 9; row++){
    for(let col = 0; col < 9; col++){
      if(board[row][col] == 0){
        for(let num = 1; num <= 9; num++){
          if(isSafe(board, row, col, num)){
            board[row][col] = num;
            if(solveBoard(board)){
              return true;
            }
            board[row][col] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}
