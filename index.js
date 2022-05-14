import './style.css';

const appDiv = document.getElementById('app');

const COLUMNS = 12;
const LINES = 24;
const CELL_SIDE = 20;
const BOMBS_NUMBER = 100;

// Randomly put bombs and calc each neighborhood
var matrix = [];
for (let line = 0; line < LINES; line++) {
  matrix[line] = [];
  for (let col = 0; col < COLUMNS; col++) {
    matrix[line][col] = {
      hasBomb: false,
      isClicked: false,
      neighborhood: 0
    };
  }
}

for (let bomb = 0; bomb < BOMBS_NUMBER; bomb++) {
  let bombSet = false;
  do {
    bombSet = false;
    let line = getRandomInt(LINES);
    let col = getRandomInt(COLUMNS);
    if(!matrix[line][col].hasBomb) {
      matrix[line][col].hasBomb = true;
      bombSet = true;
    }
  }
  while (!bombSet);
}

for (let line = 0; line < LINES; line++) {
  for (let col = 0; col < COLUMNS; col++) {
    let bombs = 0;
    if(line > 0) {
      if(matrix[line-1][col].hasBomb) bombs++;
    }
    if(col > 0) {
      if(matrix[line][col-1].hasBomb) bombs++;
    }
    matrix[line][col].neighborhood = bombs;
  }
}


// Draw playfield
let playfieldHTML = '';
for (let line = 0; line < LINES; line++) {
  for (let col = 0; col < COLUMNS; col++) {
    playfieldHTML +=
      "<div class='cell unclicked' " +
      " data-line='" + line + "' data-col='" + col + "' " +
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



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const CellClick = (cell) => {
  cell.classList.remove('unclicked');
  cell.classList.add('empty');

  //console.info(cell.getAttribute("data-line"));

  let current = matrix[cell.getAttribute("data-line")][cell.getAttribute("data-col")];

  if(current.hasBomb) {
    cell.innerHTML = '*';
  }
  else {
    cell.innerHTML = current.neighborhood;
  }
};
window.CellClick = CellClick;
