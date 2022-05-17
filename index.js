document.addEventListener("DOMContentLoaded", function() {

    const appDiv = document.getElementById('app');

    const COLUMNS = 12;
    const LINES = 24;
    const CELL_SIDE = Math.trunc(screen.width / COLUMNS); //px
    //const CELL_SIDE = 8; //%
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

    // Set width and height based on screen width
    let width = CELL_SIDE - 6;

    // Draw playfield
    let playfieldHTML = '';
    for (let line = 0; line < LINES; line++) {
      for (let col = 0; col < COLUMNS; col++) {
        playfieldHTML += `<div id='cell_${line}_${col}' class='cell unclicked' data-line='${line}' data-col='${col}' `
            + ` style='left: ${(col * CELL_SIDE)}px; top: ${(line * CELL_SIDE)}px; width: ${width}px; height: ${width}px;' `
            + ` onclick='window.CellClick(this);'></div>`;
      }
    }
    appDiv.innerHTML = playfieldHTML;
    
    // Update matrix to include ref for each HTML cell
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
      
      counter = 0;

      let line = parseInt(cell.getAttribute('data-line'));
      let col = parseInt(cell.getAttribute('data-col'));
      let currentMatrixPos = matrix[line][col];
      
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
          EmptyCell(cell, "");
        }
      }

      SetCellClicked(cell);

    };
    window.CellClick = CellClick;
    
    const SetCellClicked = (cell) => {
        cell.classList.remove('unclicked');
        cell.classList.add('empty');
  
        // Set width and height based on screen width
        let width = CELL_SIDE - 1;
        cell.style.width = width + "px";
        cell.style.height = width + "px";

        let line = parseInt(cell.getAttribute('data-line'));
        let col = parseInt(cell.getAttribute('data-col'));
        let currentMatrixPos = matrix[line][col];
        currentMatrixPos.isClicked = true;
    };

    let counter = 0;
    const EmptyCell = (cell, direction) => {

        counter++;
        if(counter >= 1000) {
            // console.info('error: too much recursion'); // debug
            return;
        }

        let line = parseInt(cell.getAttribute('data-line'));
        let col = parseInt(cell.getAttribute('data-col'));

        try {
            // console.info(counter + ' - ' + line + ', ' + col);
            
            let currentMatrixPos = matrix[line][col];
            if ((currentMatrixPos.neighborhood > 0) || currentMatrixPos.hasBomb || currentMatrixPos.isClicked) return;
            
            //cell.click();
            
            SetCellClicked(cell);
            
            if (line > 0 && direction != "up")              EmptyCell(matrix[line - 1][col].cell, "up");
            if (col > 0 && direction != "right")            EmptyCell(matrix[line][col - 1].cell, "left");
            if (line < (LINES - 1) && direction != "up")    EmptyCell(matrix[line + 1][col].cell, "down");
            if (col < (COLUMNS - 1) && direction != "left") EmptyCell(matrix[line][col + 1].cell, "right");
            
        } catch (error) {
            //console.info(error);
            //console.info(line + ', ' + col);
        }
    
    };
    
    // Show all cells
    // const collection = document.getElementsByClassName('cell');
    // for (let i = 0; i < collection.length; i++) {
    //   collection[i].click();
    // }
    
});

//alert("screen resolution: " + screen.width + "x" + screen.height);

