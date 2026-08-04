const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-btn");
const newBtn = document.getElementById("new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.getElementById("msg");
const status = document.getElementById("status");
const pvpBtn = document.getElementById("pvp-btn");
const aiBtn = document.getElementById("ai-btn");
let gameMode = "pvp";
let difficulty = "medium";
const difficultyDiv = document.getElementById("difficulty");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");
const computerSymbol = "X";
let turnO = true;
let moveCount = 0;
const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];
function updateTurn(){
    if(!status) return;

    status.innerHTML = turnO
        ? "Player <b>O</b>'s Turn"
        : "Player <b>X</b>'s Turn";
}
function enableBoxes(){

    boxes.forEach(box=>{

        box.disabled=false;
        box.innerText="";
        box.style.background = "";
        box.style.color = "";
        box.style.boxShadow = "";
        box.style.transform = "";

    });

}

function disableBoxes(){

    boxes.forEach(box=>{

        box.disabled=true;

    });

}
function resetGame(){

    turnO=true;
    moveCount=0;

    enableBoxes();

    msgContainer.classList.add("hide");

    updateTurn();

}
function drawGame(){

    msg.innerHTML="🤝 It's a Draw!";

    msgContainer.classList.remove("hide");

    disableBoxes();

}
function showWinner(player,pattern){

 if (gameMode === "computer") {

    if (player === "X") {

        msg.innerHTML = `
🤖 Computer Wins!<br>
Better luck next time.`;

    } else {

        msg.innerHTML = `
🎉 Congratulations!<br>
You Win!`;

    }

} else {

    msg.innerHTML = `
🏆 Congratulations!<br>
Player <span style="color:#00E5FF;">${player}</span> Wins`;

}
    pattern.forEach(index=>{

       boxes[index].style.background = "#00E676";
boxes[index].style.color = "#000";
boxes[index].style.boxShadow = "0 0 25px #00E676";
boxes[index].style.transform = "scale(1.08)";

    });

    msgContainer.classList.remove("hide");

    disableBoxes();
}
function checkWinner(){

    for(let pattern of winPatterns){

        const pos1=boxes[pattern[0]].innerText;
        const pos2=boxes[pattern[1]].innerText;
        const pos3=boxes[pattern[2]].innerText;

        if(pos1!=="" &&
           pos2!=="" &&
           pos3!==""){

            if(pos1===pos2 &&
               pos2===pos3){

                showWinner(pos1,pattern);

                return true;

            }

        }

    }

    return false;

}
function findWinningMove(symbol) {

    for (let pattern of winPatterns) {

        const [a, b, c] = pattern;

        const values = [
            boxes[a].innerText,
            boxes[b].innerText,
            boxes[c].innerText
        ];
        if (
            values.filter(v => v === symbol).length === 2 &&
            values.includes("")
        ) {

            if (boxes[a].innerText === "") return a;
            if (boxes[b].innerText === "") return b;
            if (boxes[c].innerText === "") return c;

        }

    }

    return -1;

}
function checkBoardWinner(board) {

    for (let pattern of winPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    return null;

}
function getEmptyCells(board) {

    let cells = [];

    board.forEach((cell, index) => {

        if (cell === "") {
            cells.push(index);
        }

    });

    return cells;

}
function minimax(board, isMaximizing) {

    const winner = checkBoardWinner(board);

    if (winner === "X") return 10;

    if (winner === "O") return -10;

    if (getEmptyCells(board).length === 0) return 0;

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let index of getEmptyCells(board)) {

            board[index] = "X";

            let score = minimax(board, false);

            board[index] = "";

            bestScore = Math.max(bestScore, score);

        }

        return bestScore;

    }

    else {

        let bestScore = Infinity;

        for (let index of getEmptyCells(board)) {

            board[index] = "O";

            let score = minimax(board, true);

            board[index] = "";

            bestScore = Math.min(bestScore, score);

        }

        return bestScore;

    }

}
function computerMove() {

    let move = -1;
    move = findWinningMove("X");
    if (move === -1) {
        move = findWinningMove("O");
    }
    if (move === -1 && boxes[4].innerText === "") {
        move = 4;
    }
    if (move === -1) {

        const corners = [0, 2, 6, 8];

        const availableCorners = corners.filter(index => boxes[index].innerText === "");

        if (availableCorners.length > 0) {

            move = availableCorners[
                Math.floor(Math.random() * availableCorners.length)
            ];

        }

    }
    if (move === -1) {

        const emptyBoxes = [];

        boxes.forEach((box, index) => {

            if (box.innerText === "") {
                emptyBoxes.push(index);
            }

        });

        if (emptyBoxes.length === 0) return;

        move = emptyBoxes[
            Math.floor(Math.random() * emptyBoxes.length)
        ];

    }
    boxes[move].innerText = "X";
    boxes[move].style.color = "#FF4081";
    boxes[move].disabled = true;

    moveCount++;

    const winner = checkWinner();

    if (winner) return;

    if (moveCount === 9) {

        drawGame();
        return;

    }

    turnO = true;

    updateTurn();

}
function computerMoveHard() {
    const board = [];

    boxes.forEach(box => {

        board.push(box.innerText);

    });

    let bestScore = -Infinity;
    let bestMove = -1;
    getEmptyCells(board).forEach(index => {

        board[index] = "X";

        let score = minimax(board, false);

        board[index] = "";

        if (score > bestScore) {

            bestScore = score;
            bestMove = index;

        }

    });
    boxes[bestMove].innerText = "X";
    boxes[bestMove].style.color = "#FF4081";
    boxes[bestMove].disabled = true;

    moveCount++;

    const winner = checkWinner();

    if (winner) return;

    if (moveCount === 9) {

        drawGame();
        return;

    }

    turnO = true;

    updateTurn();

}
boxes.forEach(box=>{

    box.addEventListener("click",()=>{
        if (gameMode === "computer" && !turnO) return;
        if(turnO){

            box.innerText="O";

            box.style.color="#00E5FF";
        }
        else{

            box.innerText="X";

            box.style.color="#FF4081";
        }
        box.disabled=true;

        moveCount++;

        const winner=checkWinner();

        if(winner){

            return;

        }

        if(moveCount===9){

            drawGame();

            return;

        }

        turnO = !turnO;

updateTurn();

if (gameMode === "computer" && !turnO) {

    setTimeout(() => {

        if (difficulty === "medium") {

            computerMove();

        } else {

            computerMoveHard();

        }

    }, 500);

}

    });

});
resetBtn.addEventListener("click",resetGame);

newBtn.addEventListener("click",resetGame);
pvpBtn.addEventListener("click", () => {

    gameMode = "pvp";

    pvpBtn.classList.add("active");
    aiBtn.classList.remove("active");
      difficultyDiv.classList.add("hide");
    resetGame();

});

aiBtn.addEventListener("click", () => {

    gameMode = "computer";

    aiBtn.classList.add("active");
    pvpBtn.classList.remove("active");
    difficultyDiv.classList.remove("hide");
 
    resetGame();

});
mediumBtn.addEventListener("click", () => {

    difficulty = "medium";

    mediumBtn.classList.add("active");
    hardBtn.classList.remove("active");

    resetGame();

});

hardBtn.addEventListener("click", () => {

    difficulty = "hard";

    hardBtn.classList.add("active");
    mediumBtn.classList.remove("active");

    resetGame();

});
updateTurn();
difficultyDiv.classList.add("hide")
