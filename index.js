document.addEventListener("DOMContentLoaded", function() {

    const appDiv = document.getElementById('app');

    const BOMBS_NUMBER = 2; //10;
    const COLUMNS = 12;
    const LINES = 22;
    
    let gameOver;
    let matrix = [];
    let cellClickedWidth;
    let bombsLeft;
    let gameStarted;
    let gameTimeStart;
    let timeBtnStartPressed;
    let btnFlagClicked;
    let playerWon;
    let showDialog;
    let showDialog_Return;

    // DOM / window Objects
    let timer;
    let displayBombsLeft;
    let displayTime;

    const ShowDialog = (text) => {
        //if(showDialog) return;

        // Dialog box
        let dialog = document.getElementById("dialog");
        dialog.style.display = 'block';

        //if(showDialog) {
        // }
        // else {
        //     dialog.style.display = 'none';
        // }

        let dialogText = document.getElementById("dialogText");
        dialogText.innerHTML = text;

        showDialog = true;
    }

    const CloseDialog = () => {
        let dialog = document.getElementById("dialog");
        dialog.style.display = 'none';
        showDialog = false;
    }
    window.CloseDialog = CloseDialog;

    const StartGame = () => {

        if(gameStarted) {
            if(!window.confirm("New game?")) return;
            // ShowDialog("New game?");

            // if(!showDialog_Return) return;
        }

        gameStarted = false;
        gameOver = false;
        playerWon = false;
        showDialog = false;
        showDialog_Return = false;

        timer = window.setInterval(UpdateScore, 100);
        bombsLeft = BOMBS_NUMBER;
        
        // Initialize playfield matrix
        matrix = [];
        for (let line = 0; line < LINES; line++) {
            matrix[line] = [];
            for (let col = 0; col < COLUMNS; col++) {
                matrix[line][col] = {
                hasBomb: false,
                isClicked: false,
                isFlagged: false,
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
            
                    // check 3 cells on line above
                    if (line > 0) {
                        if (col > 0) {
                            if (matrix[line - 1][col - 1].hasBomb) bombs++;
                        }

                        if (matrix[line - 1][col].hasBomb) bombs++;

                        if (col < COLUMNS - 1) {
                            if (matrix[line - 1][col + 1].hasBomb) bombs++;
                        }
                    }

                    // check cells left and right
                    if (col > 0) {
                        if (matrix[line][col - 1].hasBomb) bombs++;
                    }
                    if (col < COLUMNS - 1) {
                        if (matrix[line][col + 1].hasBomb) bombs++;
                    }
                    
                    // check 3 cells on line below
                    if (line < LINES - 1) {
                        if (col > 0) {
                            if (matrix[line + 1][col - 1].hasBomb) bombs++;
                        }
                        
                        if (matrix[line + 1][col].hasBomb) bombs++;
                        
                        if (col < COLUMNS - 1) {
                            if (matrix[line + 1][col + 1].hasBomb) bombs++;
                        }
                    }
            
                    matrix[line][col].neighborhood = bombs;
                }
            }
        }



        DrawPlayfield();
        UpdateScore();


        let btnNewGame = document.getElementById("btnNewGame");
        
        btnNewGame.innerHTML = ":)"
        btnNewGame.classList.remove("button_red");
        btnNewGame.classList.remove("button_green");

        SetBtnFlagUnclicked();
    };

    const UpdateScore = () => {
        if(gameOver) return;

        displayBombsLeft.innerText = bombsLeft;
        
        if(gameStarted) {
            let gameTime = new Date(Date.now() - gameTimeStart)

            if(gameTime.getMinutes() > 9) {
                // Time's up
                gameOver = true;
            }
            else {
                let seconds = (gameTime.getSeconds() < 10) ? "0" + gameTime.getSeconds() : gameTime.getSeconds();
                displayTime.innerText = gameTime.getMinutes() + ":" + seconds;
            }
        }
        else {
            displayTime.innerText = "0:00";
        }
    };

    const DrawPlayfield = () => {
        
        let playfieldHTML = '';

        // Draw top panel
        playfieldHTML += "<button id='btnNewGame'></button>";
        playfieldHTML += "<button id='btnFlag'></button>";
        playfieldHTML += "<div id='displayBombsLeft' class='display'></div>";
        playfieldHTML += "<div id='displayTime' class='display'></div>";

        // Draw playfield
        for (let line = 0; line < LINES; line++) {
            for (let col = 0; col < COLUMNS; col++) {
                playfieldHTML += `<div id='cell_${line}_${col}' class='cell unclicked' data-line='${line}' data-col='${col}' `
                    + ` onclick='window.CellClick(this);' onmousedown='window.CellClickDown(this, event);' onmouseup='window.CellClickUp(this, event);'></div>`;
            }
        }

        // Dialog box
        playfieldHTML += "<div id='dialog'><div id='dialogText'></div><button id='dialogOK' onclick='window.CloseDialog();'>OK</button></div>";

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
    
        // console.info(screenWidth);//[debug]

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

        let btnFlag = document.getElementById("btnFlag");
        btnFlag.style.width = (topPanelHeight * 0.75) + "px";
        btnFlag.style.height = (topPanelHeight * 0.75) + "px";
        btnFlag.style.top = (topPanelHeight * 0.12) + "px";
        btnFlag.style.left = ((screenWidth/2) - (topPanelHeight/2) - (((screenWidth/2) - (topPanelHeight/2))/2) + topPanelHeight*0.37) + "px";
        btnFlag.addEventListener("click", BtnFlagClick);

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
      
        if(gameOver) return;

        counter = 0;

        let line = parseInt(cell.getAttribute('data-line'));
        let col = parseInt(cell.getAttribute('data-col'));
        let currentMatrixPos = matrix[line][col];

        if(!btnFlagClicked && currentMatrixPos.isFlagged) return;

        if(btnFlagClicked && bombsLeft <= 0 && !currentMatrixPos.isFlagged) return;
        
        // Set flag logic
        if(btnFlagClicked && !currentMatrixPos.isClicked) {
            if(!gameStarted) {
                gameStarted = true;
                gameTimeStart = Date.now();
            }
    
            if(!currentMatrixPos.isFlagged) {
                currentMatrixPos.isFlagged = true;
                cell.classList.add('flag');
                bombsLeft--;
                CheckIfGameEnded();
                return;
            }
            else {
                currentMatrixPos.isFlagged = false;
                cell.classList.remove('flag');
                bombsLeft++;
                CheckIfGameEnded();
                return;
            }

        }
        
        if (currentMatrixPos.hasBomb) {

            // ----------- Game over

            gameOver = true;
            
            cell.classList.remove('flag');
            cell.classList.add('bomb');
            cell.classList.add('red');



            //loop through all playfield to show all other bombs
            for (let lineLoop = 0; lineLoop < LINES; lineLoop++) {
                for (let colLoop = 0; colLoop < COLUMNS; colLoop++) {
                    if(!(line == lineLoop && col == colLoop)) {
                        let matrixPosLoop = matrix[lineLoop][colLoop];
                        //console.info(matrixPosLoop.hasBomb);//[debug]
                        if(matrixPosLoop.hasBomb) {
                            let cellLoop = matrix[lineLoop][colLoop].cell;
                            cellLoop.classList.add('bomb');
                            //cellLoop.classList.add('gray');
                            cellLoop.classList.remove('unclicked');
                            cellLoop.classList.add('empty');

                            cellLoop.style.width = cellClickedWidth + "px";
                            cellLoop.style.height = cellClickedWidth + "px";
                        }
                    }
                }
            }

            // Set cell width and height based on screen width
            cell.style.width = cellClickedWidth + "px";
            cell.style.height = cellClickedWidth + "px";


            let btnNewGame = document.getElementById("btnNewGame");
            btnNewGame.innerHTML = ":P"
            btnNewGame.classList.add("button_red");
            btnNewGame.classList.remove("button_green");
        } 
        else {
            // recursivelly find all empty cells connected to this one
            EmptyCell(cell, "");
        }

        SetCellClicked(cell);

        CheckIfGameEnded();

    };
    window.CellClick = CellClick;
    
    const CellClickDown = (cell, event) => {

        if(gameOver) return;

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

        if(gameOver) return;

        //console.info('CellClickUp');
        if(event.button == 0) {
            let timeBtnPressed = new Date(Date.now() - timeBtnStartPressed);
            //console.info(timeBtnPressed.getMilliseconds()); //[debug]
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

        cell.classList.remove('flag');
        
        cell.classList.remove('unclicked');
        cell.classList.add('empty');
  
        // Set width and height based on screen width
        cell.style.width = cellClickedWidth + "px";
        cell.style.height = cellClickedWidth + "px";

        let line = parseInt(cell.getAttribute('data-line'));
        let col = parseInt(cell.getAttribute('data-col'));
        let currentMatrixPos = matrix[line][col];
        currentMatrixPos.isClicked = true;
        
        if(currentMatrixPos.isFlagged) {
            currentMatrixPos.isFlagged = false;
            bombsLeft++;
        }

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
            //console.info(error); //[debug]
            //console.info(line + ', ' + col);
        }
    
    };
    
    const BtnFlagClick = () => {
        if(btnFlagClicked) {
            SetBtnFlagUnclicked();
        }
        else {
            SetBtnFlagClicked();
        }
    }

    const SetBtnFlagUnclicked = () => {
        btnFlagClicked = false;

        let btnFlag = document.getElementById("btnFlag");
        btnFlag.classList.remove("clicked");
        btnFlag.classList.add("unclicked");
    }

    const SetBtnFlagClicked = () => {
        btnFlagClicked = true;
        btnFlag.classList.remove("unclicked");
        btnFlag.classList.add("clicked");
    }

    // Show all cells
    // const collection = document.getElementsByClassName('cell');
    // for (let i = 0; i < collection.length; i++) {
    //   collection[i].click();
    // }

    const CheckIfGameEnded = () => {
        let hasSomeCellUnclicked = false;
        for (let line = 0; (line < LINES) && !hasSomeCellUnclicked; line++) {
            for (let col = 0; (col < COLUMNS) && !hasSomeCellUnclicked; col++) {
                let cell = matrix[line][col].cell;
                if(!matrix[line][col].isClicked && !matrix[line][col].isFlagged) {
                    hasSomeCellUnclicked = true;
                }
            }
        }

        if(!hasSomeCellUnclicked) { 
            gameOver = true;
            playerWon = true;

            let btnNewGame = document.getElementById("btnNewGame");
            
            btnNewGame.innerHTML = ":D"
            btnNewGame.classList.remove("button_red");
            btnNewGame.classList.add("button_green");
    
            //alert("You win");
            ShowDialog("You win");
        }
    }
    
    window.addEventListener('contextmenu', (event) => event.preventDefault());

    screen.orientation
        .lock("portrait")
        .then(() => {
        })
        .catch((error) => {
            //console.error(error); //[debug]
        });

    window.addEventListener('resize', (event) => {
        // console.info('window resize');//[debug]

        window.setTimeout(ResizePlayfield, 100);
    }, false);

    window.addEventListener("beforeunload", null);
    
    screen.orientation.addEventListener("change", (event) => {
        // console.info('screen.orientation change');//[debug]

        // const type = event.target.type;
        // const angle = event.target.angle;
        // console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`); //[debug]

        window.setTimeout(ResizePlayfield, 100);
    });

    StartGame();

});
