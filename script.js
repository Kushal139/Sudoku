const newGameButton = document.getElementById('new-game');
const resetButton = document.getElementById('reset');
const difficulty = document.getElementById('difficulty');
const sudokuGrid = document.getElementById('sudoku-grid');
const statusContainer = document.getElementById('status-container');

let selectedCell = null;
let mistakes = 0;
let startTime;
let timerInterval;

const mistakesElement = document.createElement('div');
mistakesElement.id = 'mistakes';

const timeElement = document.createElement('div');
timeElement.id = 'time';

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
  statusContainer.innerText = '';
  mistakes = 0;
  
  mistakesElement.innerText = `Mistakes: ${mistakes}/3`;
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTime, 1000);

  statusContainer.appendChild(mistakesElement);
  statusContainer.appendChild(timeElement);

  removeClassFromAll("cell", "incorrect");
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

createSudokuGrid();

async function getPuzzleValues() {
  let difficultyLevel = difficulty.value;
  const url = `https://sugoku.onrender.com/board?difficulty=${difficultyLevel}`;
  const response = await fetch(url);
  let values = await response.json();
  return values.board; 
}

async function initializeGame() {
  statusContainer.innerText = 'Puzzle loading...';
  sudokuBoard = await getPuzzleValues();
  solvedBoard = JSON.parse(JSON.stringify(sudokuBoard));
  solveBoard(solvedBoard);
  fillBoard(sudokuBoard);
}

initializeGame();
function updateTime() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timeElement.innerText = `Time: ${minutes}:${seconds.toString().padStart(2, '0')} s`;
}

function removeClassFromAll(className, classToRemove) {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach(element => {
      element.classList.remove(classToRemove);
  });
}

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
  if(selectedCell.innerText ){
    highlightNumbers(selectedCell.innerText);
  }
  selectedCell.classList.add('highlight');
}

function onNumberClick(event) {
  if(selectedCell && (selectedCell.innerText == '' || selectedCell.classList.contains('incorrect'))){
    const {row, col} = getRowColFromId(selectedCell.id);
    const selectedNumber = parseInt(event.target.innerText);
    selectedCell.innerText = selectedNumber;
    highlightNumbers(selectedNumber);
    if(solvedBoard[row][col] === selectedNumber){
      selectedCell.classList.remove('incorrect');
      if(isFullyFilled){
        alert("You Win. Try another game")
        initializeGame();
      }
    }
    else{
      selectedCell.classList.add('incorrect');
      mistakes++;
      mistakesElement.innerText = `Mistakes: ${mistakes}/3`;
      if(mistakes == 3){
        alert("Too many mistakes, Try again");
        fillBoard(sudokuBoard);
      }
    }
  }
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
            board[row][col] = 0; 
          }
        }
        return false;
      }
    }
  }
  return true;
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

function getRowColFromId(cellId){
  const idNumber = parseInt(cellId.replace('id', ''));
  const row = Math.floor(idNumber/9);
  const col = idNumber % 9;
  return {row, col};
}

function highlightNumbers(number) {
  const cells = document.querySelectorAll('.cell');

  if (number) {
    cells.forEach(cell => {
      if (cell.innerText === number) {
        cell.classList.add('highlightedNumber');
      } else {
        cell.classList.remove('highlightedNumber');
      }
    });
  } else {
    // Remove the 'highlightedNumber' class from all cells
    cells.forEach(cell => {
      cell.classList.remove('highlightedNumber');
    });
  }
}