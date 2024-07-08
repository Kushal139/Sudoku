const newGameButton = document.getElementById('new-game');
const resetButton = document.getElementById('reset');
const difficultySelect = document.getElementById('difficulty');
const sudokuGrid = document.getElementById('sudoku-grid');

function createSudokuGrid() {
  sudokuGrid.innerHTML = ''; // Clear existing grid
  let type = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const threeByThree = document.createElement('div');
      for(let k = 0; k < 3; k++){
        for(let l=0; l < 3; l++){
          const cell = document.createElement('div');
          cell.id = l + 3*k + 9*j+ 27*i;
          threeByThree.appendChild(cell);
        }
      }
      threeByThree.className = "class"+type;
      sudokuGrid.appendChild(threeByThree); 
      type = (type+1)%2;  
    }
  }
}
createSudokuGrid();

