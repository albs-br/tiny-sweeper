const appDiv = document.getElementById('app');

const COLUMNS = 12;
const LINES = 24;
const CELL_SIDE = 20;
const BOMBS_NUMBER = 10;

// Initialize playfield matrix
var matrix = [];
for (let line = 0; line < LINES; line++) {
  matrix[line] = [];
  for (let col = 0; col < COLUMNS; col++) {
    matrix[line][col] = {
      hasBomb: false,
      isClicked: false,
      neighborhood: 0,
      cell: undefined,
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
for (let line = 0; line < LINES; line++) {
  for (let col = 0; col < COLUMNS; col++) {
    if (!matrix[line][col].hasBomb) {
      let bombs = 0;

      if (line > 0 && col > 0) {
        if (matrix[line - 1][col - 1].hasBomb) bombs++;
      }
      if (line > 0) {
        if (matrix[line - 1][col].hasBomb) bombs++;
      }
      if (line > 0 && col < COLUMNS - 1) {
        if (matrix[line - 1][col + 1].hasBomb) bombs++;
      }
      if (col > 0) {
        if (matrix[line][col - 1].hasBomb) bombs++;
      }
      if (col < COLUMNS - 1) {
        if (matrix[line][col + 1].hasBomb) bombs++;
      }
      if (line < LINES - 1 && col > 0) {
        if (matrix[line + 1][col - 1].hasBomb) bombs++;
      }
      if (line < LINES - 1) {
        if (matrix[line + 1][col].hasBomb) bombs++;
      }
      if (line < LINES - 1 && col < COLUMNS - 1) {
        if (matrix[line + 1][col + 1].hasBomb) bombs++;
      }

      matrix[line][col].neighborhood = bombs;
    }
  }
}

// Draw playfield
let playfieldHTML = '';
for (let line = 0; line < LINES; line++) {
  for (let col = 0; col < COLUMNS; col++) {
    playfieldHTML +=
      "<div id='cell_" +
      line +
      '_' +
      col +
      "' " +
      " class='cell unclicked' " +
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

// Upadte matrix to include ref for each HTML cell
for (let line = 0; line < LINES; line++) {
  for (let col = 0; col < COLUMNS; col++) {
    matrix[line][col].cell = document.getElementById(
      'cell_' + line + '_' + col
    );
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const CellClick = (cell) => {
  cell.classList.remove('unclicked');
  cell.classList.add('empty');

  // console.info(
  //   cell.getAttribute('data-line') + ', ' + cell.getAttribute('data-col')
  // );

  let currentMatrixPos =
    matrix[cell.getAttribute('data-line')][cell.getAttribute('data-col')];

  if (currentMatrixPos.hasBomb) {
    cell.innerHTML = '*';
  } else {
    if (currentMatrixPos.neighborhood > 0) {
      cell.innerHTML = currentMatrixPos.neighborhood;
      switch (currentMatrixPos.neighborhood) {
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
    } else {
      // recursivelly find all empty cells connected to this one
      EmptyCell(cell);
    }
  }
};
window.CellClick = CellClick;

const EmptyCell = (cell) => {
  let line = cell.getAttribute('data-line');
  let col = cell.getAttribute('data-col');

  console.info(line + ', ' + col);

  let currentMatrixPos = matrix[line][col];
  if (currentMatrixPos.hasBomb || currentMatrixPos.isClicked) return;

  //cell.click();

  if (line > 0) EmptyCell(matrix[line - 1][col].cell); //matrix[line - 1][col].cell.click();
};

// Show all cells
// const collection = document.getElementsByClassName('cell');
// for (let i = 0; i < collection.length; i++) {
//   collection[i].click();
// }
