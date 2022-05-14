import './style.css';

const appDiv = document.getElementById('app');

const COLUMNS = 12;
const LINES = 24;
const CELL_SIDE = 20;
const BOMBS_NUMBER = 100;

// Initialize playfield matrix
var matrix = [];
for (let line = 0; line < LINES; line++) {
  matrix[line] = [];
  for (let col = 0; col < COLUMNS; col++) {
    matrix[line][col] = {
      hasBomb: false,
      isClicked: false,
      neighborhood: 0,
    };
  }
}

// Randomly put bombs
for (let bomb = 0; bomb < BOMBS_NUMBER; bomb++) {
  let bombSet;
  do {
    bombSet = false;
    let line = getRandomInt(LINES);
    let col = getRandomInt(COLUMNS);
    if (!matrix[line][col].hasBomb) {
      matrix[line][col].hasBomb = true;
      bombSet = true;
    }
  } while (!bombSet);
}

// Calc neighborhood for each cell
for (let line = 1; line < LINES - 1; line++) {
  for (let col = 1; col < COLUMNS - 1; col++) {
    if(!matrix[line][col].hasBomb) {
      let bombs = 0;
      if (matrix[line - 1][col - 1].hasBomb) bombs++;
      if (matrix[line - 1][col].hasBomb) bombs++;
      if (matrix[line - 1][col + 1].hasBomb) bombs++;
      if (matrix[line][col - 1].hasBomb) bombs++;
      if (matrix[line][col + 1].hasBomb) bombs++;
      if (matrix[line + 1][col - 1].hasBomb) bombs++;
      if (matrix[line + 1][col].hasBomb) bombs++;
      if (matrix[line + 1][col + 1].hasBomb) bombs++;

      // if (line > 0) {
      //   if (matrix[line - 1][col].hasBomb) bombs++;
      // }
      // if (line < LINES - 1) {
      //   if (matrix[line + 1][col].hasBomb) bombs++;
      // }
      // if (col > 0) {
      //   if (matrix[line][col - 1].hasBomb) bombs++;
      // }
      // if (col < COLUMNS - 1) {
      //   if (matrix[line][col + 1].hasBomb) bombs++;
      // }
      matrix[line][col].neighborhood = bombs;
    }
  }
}

// Draw playfield
let playfieldHTML = '';
for (let line = 0; line < LINES; line++) {
  for (let col = 0; col < COLUMNS; col++) {
    playfieldHTML +=
      "<div class='cell unclicked' " +
      " data-line='" +
      line +
      "' data-col='" +
      col +
      "' " +
      " style='left: " +
      col * CELL_SIDE +
      'px; top: ' +
      line * CELL_SIDE +
      "px' " +
      " onclick='window.CellClick(this);' " +
      '>' +
      '</div>';
  }
}
appDiv.innerHTML = playfieldHTML;

// Show all cells
const collection = document.getElementsByClassName('cell');
for (let i = 0; i < collection.length; i++) {
  collection[i].click();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const CellClick = (cell) => {
  cell.classList.remove('unclicked');
  cell.classList.add('empty');

  console.info(cell.getAttribute("data-line") + ", " + cell.getAttribute("data-col"));

  let current =
    matrix[cell.getAttribute('data-line')][cell.getAttribute('data-col')];

  if (current.hasBomb) {
    cell.innerHTML = '*';
  } else {
    if (current.neighborhood > 0) {
      cell.innerHTML = current.neighborhood;
      switch (current.neighborhood) {
        case 1:
          cell.style.color = 'blue';
          break;
        case 2:
          cell.style.color = 'green';
          break;
        case 3:
          cell.style.color = 'red';
          break;
        case 4:
          cell.style.color = 'darkblue';
          break;
        case 5:
          cell.style.color = 'darkred';
          break;
        default:
          cell.style.color = 'black';
      }
    }
  }
};
window.CellClick = CellClick;
