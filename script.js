const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-btn");
const newBtn = document.getElementById("new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.getElementById("msg");
const status = document.getElementById("status");

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

    msg.innerHTML = `
🏆 Congratulations!<br>
Player <span style="color:#00E5FF;">${player}</span> Wins`;

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

boxes.forEach(box=>{

    box.addEventListener("click",()=>{

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

        turnO=!turnO;

        updateTurn();

    });

});

resetBtn.addEventListener("click",resetGame);

newBtn.addEventListener("click",resetGame);
updateTurn();
