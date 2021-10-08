const TIME_DELAY = 0.5; //DELAY_COMP  thoi gian de may tinh choi moi luot 
    const START_NEW = 2; //DELAY_END thoi gian de choi ban moi 
    const FPS = 40; // frames per second
    let GRID_SIZE = 6; // so cot va hang co the dung de tang size
    let HEIGHT = 550; // pixels

    // derived dimensions
    let WIDTH = HEIGHT * 0.9;
    let CELL = WIDTH / (GRID_SIZE + 2); // margin o hai ben trai phai
    let STROKE = CELL / 12; // border chieu rong 
    let DOT = STROKE; // dot radius
    let MARGIN_TOP = HEIGHT - (GRID_SIZE + 1) * CELL; //MARGIN margin-top 

    // colours
    let COLOR_BOARD = "#444";//COLOR_BOARD
    let COLOR_BORDER = "wheat";
    let COLOR_COMP = "crimson";
    let COLOR_COMP_LIT = "lightpink";
    let COLOR_DOT = "#29F3F3";
    let COLOR_PLAY = "royalblue";
    let COLOR_PLAY_LIT = "lightsteelblue";
    let COLOR_TIE = "black";

    // text
    const TEXT_COMP = "A.I";
    const TEXT_COMP_SML = "A.I";
    const TEXT_PLAY = "Người chơi";
    const TEXT_PLAY_SML = "Play";
    const TEXT_SIZE_CELL = CELL / 3;
    const TEXT_SIZE_TOP = MARGIN_TOP / 6;
    const TEXT_TIE = "Hòa!";
    const TEXT_WIN = "Thắng!";

        // definitions
        const Side = {
            BOT: 0,
            LEFT: 1,
            RIGHT: 2,
            TOP: 3
        }





 //  slide show function   
 var slideIndex =0;
    let dot = document.querySelectorAll(".dot");
    let slides = document.getElementsByClassName("mySlides");
    showSlides(slideIndex);
    
    function showSlides(n){
        var i;
        
        
        if(n >=slides.length){
            slideIndex = 0;
        }
        if(n < 0){
            slideIndex = slides.length-1;
        }
        for( i=0 ; i<slides.length ; i++){
            slides[i].style.display = "none";
            dot[i].classList.remove("active");
        }
        slides[slideIndex].style.display = "block";
        dot[slideIndex].classList.add("active");
    }
    document.querySelector(".arrow-prev").addEventListener("click",()=>{
        showSlides(slideIndex -=1);
    });
    document.querySelector(".arrow-next").addEventListener("click",()=>{
        showSlides(slideIndex+=1);
    });
    function currentSlide(n){
        showSlides(slideIndex =n);
    }
    
    
    

    





        // set up the game canvas
        var body = document.getElementsByTagName("BODY")[0];
        body.style.height ="700px";

       
        
        var canv = document.getElementById("canva");
        canv.style.boxShadow ="0.25em 0.25em 1em rgba(0, 0, 0, 0.788),  0.125em 0.125em 1em rgba(0, 0, 0, 0.904)";
        
        canv.style.marginTop ="10px";
        canv.style.borderRadius ="10px";
        canv.style.background = 'transparent';
        canv.style.opacity = '0.9';
        
        canv.height = 550;
        canv.width = WIDTH;
        container.appendChild(canv);
        var canvRect = canv.getBoundingClientRect();

        // set up the context
        var ctx = canv.getContext("2d");
        ctx.lineWidth = STROKE;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // game variables
        var currentCells, playersTurn, squares;
        var scoreComp, scorePlay;
        var timeComp, timeEnd;

        // start a new game
        newGame();

        // event handlers
        canv.addEventListener("mousemove", highlightGrid);
        canv.addEventListener("click", click);

        // set up the game loop
        setInterval(loop, 1000 / FPS);

        function loop() {
            drawBoard();
            drawSquares();
            drawGrid();
            drawScores();
            goComputer(); // run computer turn
        }

        function click(/** @type {MouseEvent} */ ev) {
            if ( !playersTurn || timeEnd > 0) {
                return;
            }
            selectSide();
        }

        function highlightGrid(/** @type {MouseEvent} */ ev) {
            if ( !playersTurn || timeEnd > 0) {
                return;
        }

            // lấy vị trí của chuột trên canvas
            let x = ev.clientX - canvRect.left;
            let y = ev.clientY - canvRect.top;

            // highlight the square's side
            highlightSide(x, y);
        }

        function drawBoard() {
            ctx.fillStyle = COLOR_BOARD;
            ctx.strokeStyle = COLOR_BORDER;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.strokeRect(STROKE / 2, STROKE / 2, WIDTH - STROKE, HEIGHT - STROKE);
        }

        function drawDot(x, y) {
            ctx.fillStyle = COLOR_DOT;
            ctx.beginPath();
            ctx.arc(x, y, DOT, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawGrid() {
            for (let i = 0; i < GRID_SIZE + 1; i++) {
                for (let j = 0; j < GRID_SIZE + 1; j++) {
                    drawDot(getGridX(j), getGridY(i));
                }
            }
        }

        function drawLine(x0, y0, x1, y1, color) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }

        function drawScores() {
            let colComp = playersTurn ? COLOR_COMP_LIT : COLOR_COMP;
            let colPlay = playersTurn ? COLOR_PLAY : COLOR_PLAY_LIT;
            drawText(TEXT_PLAY, WIDTH * 0.25, MARGIN_TOP * 0.25, colPlay, TEXT_SIZE_TOP);
            drawText(scorePlay, WIDTH * 0.25, MARGIN_TOP * 0.6, colPlay, TEXT_SIZE_TOP * 2);
            drawText(TEXT_COMP, WIDTH * 0.75, MARGIN_TOP * 0.25, colComp, TEXT_SIZE_TOP);
            drawText(scoreComp, WIDTH * 0.75, MARGIN_TOP * 0.6, colComp, TEXT_SIZE_TOP * 2);

            // game over text
            if (timeEnd > 0) {
                timeEnd--;

                // handle a tie
                if (scoreComp == scorePlay) {
                    drawText(TEXT_TIE, WIDTH * 0.5, MARGIN_TOP * 0.6, COLOR_TIE, TEXT_SIZE_TOP);
                } else {
                    let playerWins = scorePlay > scoreComp;
                    let color = playerWins ? COLOR_PLAY : COLOR_COMP;
                    let text = playerWins ? TEXT_PLAY : TEXT_COMP;
                    drawText(text, WIDTH * 0.5, MARGIN_TOP * 0.5, color, TEXT_SIZE_TOP);
                    drawText(TEXT_WIN, WIDTH * 0.5, MARGIN_TOP * 0.7, color, TEXT_SIZE_TOP);
                }

                // new game
                if (timeEnd == 0) {
                    newGame();
                }
            }
        }

        function drawSquares() {
            for (let row of squares) {
                for (let square of row) {
                    square.drawSides();
                    square.drawFill();
                }
            }
        }

        function drawText(text, x, y, color, size) {
            ctx.fillStyle = color;
            ctx.font = size + "px dejavu sans mono";
            ctx.fillText(text, x, y);
        }

        function getColor(player, light) {
            if (player) {
                return light ? COLOR_PLAY_LIT : COLOR_PLAY;
            } else {
                return light ? COLOR_COMP_LIT : COLOR_COMP;
            }
        }

        function getText(player, small) {
            if (player) {
                return small ? TEXT_PLAY_SML : TEXT_PLAY;
            } else {
                return small ? TEXT_COMP_SML : TEXT_COMP;
            }
        }

        function getGridX(col) {
            return CELL * (col + 1);
        }

        function getGridY(row) {
            return MARGIN_TOP + CELL * row;
        }

        

        function highlightSide(x, y) {

            // clear previous highlighting
            for (let row of squares) {
                for (let square of row) {
                    square.highlight = null;
                }
            }

            // check each cell
            let rows = squares.length;
            let cols = squares[0].length;
            currentCells = [];
            OUTER: for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (squares[i][j].contains(x, y)) {

                        // highlight current
                        let side = squares[i][j].highlightSide(x, y);
                        if (side != null) {
                            currentCells.push({row: i, col: j});
                        }

                        // determine neighbour
                        let row = i, col = j, highlight, neighbour = true;
                        if (side == Side.LEFT && j > 0) {
                            col = j - 1;
                            highlight = Side.RIGHT;
                        } else if (side == Side.RIGHT && j < cols - 1) {
                            col = j + 1;
                            highlight = Side.LEFT;
                        } else if (side == Side.TOP && i > 0) {
                            row = i - 1;
                            highlight = Side.BOT;
                        } else if (side == Side.BOT && i < rows - 1) {
                            row = i + 1;
                            highlight = Side.TOP;
                        } else {
                            neighbour = false;
                        }

                        // highlight neighbour
                        if (neighbour) {
                            squares[row][col].highlight = highlight;
                            currentCells.push({row: row, col: col});
                        }

                        // no need to continue
                        break OUTER;
                    }
                }
            }
        }

        function newGame() {
            currentCells = [];
            playersTurn = Math.random() >= 0.5;
            scoreComp = 0;
            scorePlay = 0;
            timeEnd = 0;

            // set up the squares
            squares = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                squares[i] = [];
                for (let j = 0; j < GRID_SIZE; j++) {
                    squares[i][j] = new Square(getGridX(j), getGridY(i), CELL, CELL);
                }
            }
        }



// đây là phần a.i 
function goComputer() { 
        // set up delay
        timeComp = Math.ceil(TIME_DELAY * FPS);
        if (playersTurn || timeEnd > 0) {
            return;
        }

        // count down till computer makes a selection
        if (timeComp > 0) {
            timeComp--;
            if (timeComp == 0) {
                selectSide();
            }
            return;
        }

        // set up the options array
        let options = [];
        options[0] = [];
        options[1] = [];
        options[2] = [];

        // first priority - select a square that has 3 sides completed
        // next priority - select a square that has 0 or 1 sides completed
        // final priority - select a square that has 2 sides completed
        for (let i = 0; i < squares.length; i++) {
            for (let j = 0; j < squares[0].length; j++) {
                switch (squares[i][j].numSelected) {
                    case 3: // first priority
                        options[0].push({square: squares[i][j], sides: []});
                        break;
                    case 0: // second priority
                    case 1:
                        let sides = getValidNeighbourSides(i, j);
                        let priority = sides.length > 0 ? 1 : 2;
                        options[priority].push({square: squares[i][j], sides: sides});
                        break;
                    case 2: // third priority
                        options[2].push({square: squares[i][j], sides: []});
                        break;
                }
            }
        }

        // randomly choose a square in priority order
        let option;
        if (options[0].length > 0) {
            option = options[0][Math.floor(Math.random() * options[0].length)];
        } else if (options[1].length > 0) {
            option = options[1][Math.floor(Math.random() * options[1].length)];
        } else if (options[2].length > 0) {
            option = options[2][Math.floor(Math.random() * options[2].length)];
        }

        // randomly choose a valid side
        let side = null;
        if (option.sides.length > 0) {
            side = option.sides[Math.floor(Math.random() * option.sides.length)];
        }

        // get the square's coordinates
        let coords = option.square.getFreeSideCoords(side);
        highlightSide(coords.x, coords.y);

       
    }

        function goComputer() {

        if (playersTurn || timeEnd > 0) {
            return;
        }

        // count down till computer makes a selection
        if (timeComp > 0) {
            timeComp--;
            if (timeComp == 0) {
                selectSide();
            }
            return;
        }

        // set up the options array
        let options = [];
        options[0] = [];
        options[1] = [];
        options[2] = [];

        // first priority - select a square that has 3 sides completed
        // next priority - select a square that has 0 or 1 sides completed
        // final priority - select a square that has 2 sides completed
        for (let i = 0; i < squares.length; i++) {
            for (let j = 0; j < squares[0].length; j++) {
                switch (squares[i][j].numSelected) {
                    case 3: // first priority
                        options[0].push({square: squares[i][j], sides: []});
                        break;
                    case 0: // second priority
                    case 1:
                        let sides = getValidNeighbourSides(i, j);
                        let priority = sides.length > 0 ? 1 : 2;
                        options[priority].push({square: squares[i][j], sides: sides});
                        break;
                    case 2: // third priority
                        options[2].push({square: squares[i][j], sides: []});
                        break;
                }
            }
        }

        // randomly choose a square in priority order
        let option;
        if (options[0].length > 0) {
            option = options[0][Math.floor(Math.random() * options[0].length)];
        } else if (options[1].length > 0) {
            option = options[1][Math.floor(Math.random() * options[1].length)];
        } else if (options[2].length > 0) {
            option = options[2][Math.floor(Math.random() * options[2].length)];
        }

        // randomly choose a valid side
        let side = null;
        if (option.sides.length > 0) {
            side = option.sides[Math.floor(Math.random() * option.sides.length)];
        }

        // get the square's coordinates
        let coords = option.square.getFreeSideCoords(side);
        highlightSide(coords.x, coords.y);

        // set up delay
        timeComp = Math.ceil(TIME_DELAY * FPS);
    }
        function selectSide() {
            if (currentCells == null || currentCells.length == 0) {
                return;
            }

            // select the side(s)
            let filledSquare = false;
            for (let cell of currentCells) {
                if (squares[cell.row][cell.col].selectSide()) {
                    filledSquare = true;
                }
            }
            currentCells = [];

            // check for winner
            if (filledSquare) {
                if (scorePlay + scoreComp == GRID_SIZE * GRID_SIZE) {
                    // game over
                    timeEnd = Math.ceil(START_NEW  * FPS);
                }
            } else {
                // next player's turn
                playersTurn = !playersTurn;
            }
        }
        function goComputer() {

        if (playersTurn || timeEnd > 0) {
            return;
        }

        // count down till computer makes a selection
        if (timeComp > 0) {
            timeComp--;
            if (timeComp == 0) {
                selectSide();
            }
            return;
        }

        // set up the options array
        let options = [];
        options[0] = [];
        options[1] = [];
        options[2] = [];

        // first priority - select a square that has 3 sides completed
        // next priority - select a square that has 0 or 1 sides completed
        // final priority - select a square that has 2 sides completed
        for (let i = 0; i < squares.length; i++) {
            for (let j = 0; j < squares[0].length; j++) {
                switch (squares[i][j].numSelected) {
                    case 3: // first priority
                        options[0].push({square: squares[i][j], sides: []});
                        break;
                    case 0: // second priority
                    case 1:
                        let sides = getValidNeighbourSides(i, j);
                        let priority = sides.length > 0 ? 1 : 2;
                        options[priority].push({square: squares[i][j], sides: sides});
                        break;
                    case 2: // third priority
                        options[2].push({square: squares[i][j], sides: []});
                        break;
                }
            }
        }

        // randomly choose a square in priority order
        let option;
        if (options[0].length > 0) {
            option = options[0][Math.floor(Math.random() * options[0].length)];
        } else if (options[1].length > 0) {
            option = options[1][Math.floor(Math.random() * options[1].length)];
        } else if (options[2].length > 0) {
            option = options[2][Math.floor(Math.random() * options[2].length)];
        }

        // randomly choose a valid side
        let side = null;
        if (option.sides.length > 0) {
            side = option.sides[Math.floor(Math.random() * option.sides.length)];
        }

        // get the square's coordinates
        let coords = option.square.getFreeSideCoords(side);
        highlightSide(coords.x, coords.y);

        // set up delay
        timeComp = Math.ceil(TIME_DELAY * FPS);
    }

    function getValidNeighbourSides(row, col) {
        let sides = [];
        let square = squares[row][col];

        // check left
        if (!square.sideLeft.selected) {
            if (col == 0 || squares[row][col - 1].numSelected < 2) {
                sides.push(Side.LEFT);
            }
        }

        // check right
        if (!square.sideRight.selected) {
            if (col == squares[0].length - 1 || squares[row][col + 1].numSelected < 2) {
                sides.push(Side.RIGHT);
            }
        }

        // check top
        if (!square.sideTop.selected) {
            if (row == 0 || squares[row - 1][col].numSelected < 2) {
                sides.push(Side.TOP);
            }
        }

        // check bottom
        if (!square.sideBot.selected) {
            if (row == squares.length - 1 || squares[row + 1][col].numSelected < 2) {
                sides.push(Side.BOT);
            }
        }

        return sides;
    }
        // create the Square object constructor
        function Square(x, y, w, h) {
        this.w = w;
        this.h = h;
        this.bot = y + h;
        this.left = x;
        this.right = x + w;
        this.top = y;
        this.highlight = null;
        this.numSelected = 0;
        this.owner = null;
        this.sideBot = {owner: null, selected: false};
        this.sideLeft = {owner: null, selected: false};
        this.sideRight = {owner: null, selected: false};
        this.sideTop = {owner: null, selected: false};

        this.contains = function(x, y) {
            return x >= this.left && x < this.right && y >= this.top && y < this.bot;
        }

        this.drawFill = function() {
            if (this.owner == null) {
                return;
            }

            // light background
            ctx.fillStyle = getColor(this.owner, true);
            ctx.fillRect(
                this.left + STROKE, this.top + STROKE,
                this.w - STROKE * 2, this.h - STROKE * 2
            );

            // owner text
            drawText(
                getText(this.owner, true),
                this.left + this.w / 2,
                this.top + this.h / 2,
                getColor(this.owner, false),
                TEXT_SIZE_CELL
            );
        }

        this.drawSide = function(side, color) {
            switch(side) {
                case Side.BOT:
                    drawLine(this.left, this.bot, this.right, this.bot, color);
                    break;
                case Side.LEFT:
                    drawLine(this.left, this.top, this.left, this.bot, color);
                    break;
                case Side.RIGHT:
                    drawLine(this.right, this.top, this.right, this.bot, color);
                    break;
                case Side.TOP:
                    drawLine(this.left, this.top, this.right, this.top, color);
                    break;
            }
        }

        this.drawSides = function() {

            // highlighting
            if (this.highlight != null) {
                this.drawSide(this.highlight, getColor(playersTurn, true));
            }

            // selected sides
            if (this.sideBot.selected) {
                this.drawSide(Side.BOT, getColor(this.sideBot.owner, false));
            }
            if (this.sideLeft.selected) {
                this.drawSide(Side.LEFT, getColor(this.sideLeft.owner, false));
            }
            if (this.sideRight.selected) {
                this.drawSide(Side.RIGHT, getColor(this.sideRight.owner, false));
            }
            if (this.sideTop.selected) {
                this.drawSide(Side.TOP, getColor(this.sideTop.owner, false));
            }
        }
        
        // return a random free side's coordinates
        this.getFreeSideCoords = function(side) {
            
            // valid coordinates of each side
            let coordsBot = {x: this.left + this.w / 2, y: this.bot - 1};
            let coordsLeft = {x: this.left, y: this.top + this.h / 2};
            let coordsRight = {x: this.right - 1, y: this.top + this.h / 2};
            let coordsTop = {x: this.left + this.w / 2, y: this.top};

            // get coordinates of given side
            let coords = null;
            switch (side) {
                case Side.BOT:
                    coords = coordsBot;
                    break;
                case Side.LEFT:
                    coords = coordsLeft;
                    break;
                case Side.RIGHT:
                    coords = coordsRight;
                    break;
                case Side.TOP:
                    coords = coordsTop;
                    break;
            }

            // return requested side's coordinates
            if (coords != null) {
                return coords;
            }

            // otherwise choose a random free side
            let freeCoords = [];
            if (!this.sideBot.selected) {
                freeCoords.push(coordsBot);
            }
            if (!this.sideLeft.selected) {
                freeCoords.push(coordsLeft);
            }
            if (!this.sideRight.selected) {
                freeCoords.push(coordsRight);
            }
            if (!this.sideTop.selected) {
                freeCoords.push(coordsTop);
            }
            return freeCoords[Math.floor(Math.random() * freeCoords.length)];
        }

        this.highlightSide = function(x, y) {

            // calculate the distances to each side
            let dBot = this.bot - y;
            let dLeft = x - this.left;
            let dRight = this.right - x;
            let dTop = y - this.top;

            // determine closest value
            let dClosest = Math.min(dBot, dLeft, dRight, dTop);

            // highlight the closest if not already selected
            if (dClosest == dBot && !this.sideBot.selected) {
                this.highlight = Side.BOT;
            } else if (dClosest == dLeft && !this.sideLeft.selected) {
                this.highlight = Side.LEFT;
            } else if (dClosest == dRight && !this.sideRight.selected) {
                this.highlight = Side.RIGHT;
            } else if (dClosest == dTop && !this.sideTop.selected) {
                this.highlight = Side.TOP;
            }

            // return the highlighted side
            return this.highlight;
        }

        this.selectSide = function() {
            if (this.highlight == null) {
                return;
            }

            // select the highlighted side
            switch (this.highlight) {
                case Side.BOT:
                    this.sideBot.owner = playersTurn;
                    this.sideBot.selected = true;
                    break;
                case Side.LEFT:
                    this.sideLeft.owner = playersTurn;
                    this.sideLeft.selected = true;
                    break;
                case Side.RIGHT:
                    this.sideRight.owner = playersTurn;
                    this.sideRight.selected = true;
                    break;
                case Side.TOP:
                    this.sideTop.owner = playersTurn;
                    this.sideTop.selected = true;
                    break;
            }
            this.highlight = null;

            // increase the number of selected
            this.numSelected++;
            if (this.numSelected == 4) {
                this.owner = playersTurn;

                // increment score
                if (playersTurn) {
                    scorePlay++;
                } else {
                    scoreComp++;
                }

                // filled
                return true;
            }

            // not filled
            return false;
        }
    }  


        document.getElementById("button").addEventListener('click',changeBoard);

        function changeBoard(e){
        e.preventDefault();
       

        let num = document.getElementById("number");
        let boardColor = document.getElementById("board-color");
        let borderColor = document.getElementById("border-color");
        let dotColor = document.getElementById("dot-color");
            
        // modify code
        GRID_SIZE = (num.value =="") ? 6 : parseInt(num.value);
        COLOR_BOARD =boardColor.options[boardColor.selectedIndex].value;//COLOR_BOARD
        COLOR_BORDER =borderColor.options[borderColor.selectedIndex].value;
        COLOR_COMP = "crimson";
        COLOR_COMP_LIT = "lightpink";
        COLOR_DOT = dotColor.options[dotColor.selectedIndex].value;
        COLOR_PLAY = "royalblue";
        COLOR_PLAY_LIT = "lightsteelblue";
        COLOR_TIE = "black";


        CELL = WIDTH / (GRID_SIZE + 2); // margin o hai ben trai phai
        STROKE = CELL / 12; // border chieu rong 
        DOT = STROKE; // dot radius
        MARGIN_TOP = HEIGHT - (GRID_SIZE + 1) * CELL; //MARGIN margin-top 
        drawBoard();
        drawSquares();
        drawGrid();
        drawScores();
        goComputer();
        newGame();
        num.value="";
        
        let image = slides[slideIndex].children[1];
        console.log(image.getAttribute("src"));
        document.body.style.background = "url("+image.getAttribute("src")+")";
        document.body.style.backgroundBlendMode ="multiply";
        document.body.style.backgroundColor = "rgb(189, 179, 179)";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundSize = "cover";
        }
    