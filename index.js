document.addEventListener("DOMContentLoaded", function() {

    const appDiv = document.getElementById('app');

    const BOMBS_NUMBER = 10;
    const COLUMNS = 12;
    const LINES = 22;
    
    let matrix = [];
    let cellClickedWidth;
    let bombsLeft;
    let gameStarted;
    let gameTimeStart;
    let timeBtnStartPressed;

    // DOM/ window Objects
    let timer;
    let displayBombsLeft;
    let displayTime;

    const StartGame = () => {
        gameStarted = false;

        timer = window.setInterval(UpdateScore, 1000);
        bombsLeft = BOMBS_NUMBER;
        // gameTimeStart = Date.now();
        
        // Initialize playfield matrix
        matrix = [];
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

        DrawPlayfield();
        UpdateScore();
    };

    const UpdateScore = () => {
        displayBombsLeft.innerText = bombsLeft;
        
        if(gameStarted) {
            let gameTime = new Date(Date.now() - gameTimeStart)
            let seconds = (gameTime.getSeconds() < 10) ? "0" + gameTime.getSeconds() : gameTime.getSeconds();
            displayTime.innerText = gameTime.getMinutes() + ":" + seconds;
        }
        else {
            displayTime.innerText = "0:00";
        }
    };

    const DrawPlayfield = () => {
        
        let playfieldHTML = '';

        // Draw top panel
        playfieldHTML += "<button id='btnNewGame'>:P</button>";
        playfieldHTML += "<div id='displayBombsLeft' class='display'></div>";
        playfieldHTML += "<div id='displayTime' class='display'></div>";

        // Draw playfield
        for (let line = 0; line < LINES; line++) {
            for (let col = 0; col < COLUMNS; col++) {
                playfieldHTML += `<div id='cell_${line}_${col}' class='cell unclicked' data-line='${line}' data-col='${col}' `
                    //+ ` style='left: ${(col * cellSide)}px; top: ${(line * cellSide)}px; width: ${width}px; height: ${width}px;' `
                    + ` onclick='window.CellClick(this);' onmousedown='window.CellClickDown(this, event);' onmouseup='window.CellClickUp(this, event);'></div>`;
            }
        }
        appDiv.innerHTML = playfieldHTML;
        
        // Update matrix to include ref for each HTML cell
        for (let line = 0; line < LINES; line++) {
            for (let col = 0; col < COLUMNS; col++) {
                matrix[line][col].cell = document.getElementById('cell_' + line + '_' + col);
            }
        }

        // pointer/repointer vars to DOM objs
        displayBombsLeft = document.getElementById("displayBombsLeft");
        displayTime = document.getElementById("displayTime");

        ResizePlayfield();
    };

    const ResizePlayfield = () => {

        // console.info(window.width);//[debug]
        // {
        //     const width  = window.innerWidth || document.documentElement.clientWidth || 
        //     document.body.clientWidth;
        //     const height = window.innerHeight|| document.documentElement.clientHeight|| 
        //     document.body.clientHeight;
            
        //     console.log(width, height);
        // }
        
        // const screenWidth  = window.innerWidth || document.documentElement.clientWidth || 
        //     document.body.clientWidth;
        const screenWidth  = screen.width;
    
        console.info(screenWidth);//[debug]

        let cellSide = Math.trunc(screenWidth / COLUMNS);
        let topPanelHeight = cellSide * 1.5;

        // Set width and height based on screen width
        let width = cellSide - 6;
        cellClickedWidth = cellSide - 1;

        // console.info(cellClickedWidth);//[debug]

        for (let line = 0; line < LINES; line++) {
            for (let col = 0; col < COLUMNS; col++) {
                // set left, top, width and height
                let cell = matrix[line][col].cell;
                cell.style.left = (col * cellSide) + "px";
                cell.style.top = (topPanelHeight + (line * cellSide)) + "px";
                if(!matrix[line][col].isClicked) {
                    cell.style.width = width + "px";
                    cell.style.height = width + "px";
                }
                else {
                    cell.style.width = cellClickedWidth + "px";
                    cell.style.height = cellClickedWidth + "px";
                }
            }
        }

        // Adjust top panel
        let btnNewGame = document.getElementById("btnNewGame");
        btnNewGame.style.width = topPanelHeight + "px";
        btnNewGame.style.height = topPanelHeight + "px";
        btnNewGame.style.left = ((screenWidth/2) - (topPanelHeight/2)) + "px";
        btnNewGame.addEventListener("click", StartGame);

        displayBombsLeft.style.width = topPanelHeight + "px";
        displayBombsLeft.style.height = topPanelHeight + "px";
        //displayBombsLeft.style.left = ((screenWidth/2) - (topPanelHeight/2)) + "px";
        displayTime.style.width = (topPanelHeight * 2) + "px";
        displayTime.style.height = topPanelHeight + "px";
        //displayTime.style.left = (screenWidth - (topPanelHeight * 1.5)) + "px";
    };


    
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
      } 
      else {
            // recursivelly find all empty cells connected to this one
            EmptyCell(cell, "");
      }

      SetCellClicked(cell);

    };
    window.CellClick = CellClick;
    
    const CellClickDown = (cell, event) => {
        //console.info('CellClickDown');
        if(event.button == 0) {
            timeBtnStartPressed = Date.now();
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        return false;
    };
    window.CellClickDown = CellClickDown;

    const CellClickUp = (cell, event) => {
        //console.info('CellClickUp');
        if(event.button == 0) {
            let timeBtnPressed = new Date(Date.now() - timeBtnStartPressed);
            console.info(timeBtnPressed.getMilliseconds());
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        return false;
    };
    window.CellClickUp = CellClickUp;

    const SetCellClicked = (cell) => {

        if(!gameStarted) {
            gameStarted = true;
            gameTimeStart = Date.now();
        }

        cell.classList.remove('unclicked');
        cell.classList.add('empty');
  
        // Set width and height based on screen width
        cell.style.width = cellClickedWidth + "px";
        cell.style.height = cellClickedWidth + "px";

        let line = parseInt(cell.getAttribute('data-line'));
        let col = parseInt(cell.getAttribute('data-col'));
        let currentMatrixPos = matrix[line][col];
        currentMatrixPos.isClicked = true;

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
        }
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
            if(currentMatrixPos.hasBomb || currentMatrixPos.isClicked) {
                return;
            }
            if ((currentMatrixPos.neighborhood > 0)) {
                SetCellClicked(cell);
                return;
            }
            
            //cell.click();
            
            SetCellClicked(cell);
            
            if (line > 0 && direction != "down")            EmptyCell(matrix[line - 1][col].cell, "up");
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

    screen.orientation.lock("portrait");

    window.addEventListener('resize', function(event) {
        // console.info('window resize');//[debug]

        window.setTimeout(ResizePlayfield, 100);
    }, false);

    window.onbeforeunload = function() {
        return "";
    }

    screen.orientation.addEventListener("change", (event) => {
        // console.info('screen.orientation change');//[debug]

        // const type = event.target.type;
        // const angle = event.target.angle;
        // console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);

        window.setTimeout(ResizePlayfield, 100);
    });

    StartGame();

});
