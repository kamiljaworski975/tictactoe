console.log("hello")
let originBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombs = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const cells = document.querySelectorAll(".cell");
const endGame = document.querySelector('.endgame');

startGame();

function startGame() {
    endGame.style.display = "none"
    originBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", turnClick, false)
        cells[i].innerHTML = "";
        cells[i].style.removeProperty("background-color");
    }
    
}

function turnClick(event) {
    if (typeof originBoard[event.target.id] == 'number') {
        turn(event.target.id, huPlayer)
        if(!checkTie() && !checkWin(originBoard, huPlayer)){
            setTimeout(() => turn(bestSpot(), aiPlayer), 500)
        } 
    }
    
}

function turn(squareId, player) {
    originBoard[squareId] = player
    cells[squareId].innerHTML = player
    let gameWon = checkWin(originBoard, player)
    if (gameWon) gameOver(gameWon)
    
}


function checkWin(board, player) {
    let plays = board.reduce((a,e,i) => 
        (e === player) ? a.concat(i) : a, []
    );
    let gameWon = null;
    for (let [index,win] of winCombs.entries()) {
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
        
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombs[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer? "blue" : "red"
    }

    for (let i = 0; i <cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner(gameWon.player == huPlayer ? "You won" : "You loose")
}

function declareWinner(who) {
    endGame.style.display = 'block';
    document.querySelector(".endgame .text").innerHTML = who
}

function emptySquares() {
    return originBoard.filter(s => typeof(s) == 'number')
}

function bestSpot() {
   return minimax(originBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0 && !checkWin(originBoard, huPlayer)) {
        for (let i = 0; i< cells.length; i++) {
            cells[i].style.backgroundColor ="green"
            cells[i].removeEventListener('click', turnClick, false)
        }
        declareWinner("Tie Game!")
        return true
    }
    return false
}


function minimax(newBoard, player) {
    let availSpots = emptySquares(newBoard);
    if (checkWin(newBoard, huPlayer)) {
        return {score: -1}
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 1}
    } else if (availSpots.length === 0) {
        return {score: 0}
    }

    let moves = []
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player

        if (player == aiPlayer) {
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score
        }
        newBoard[availSpots[i]] = move.index;
        moves.push(move)
    }
    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}