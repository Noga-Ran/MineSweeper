'use strict'

const MINE = '💣'
const FLAG = '🚩'
const ALIVE = '😄'
const DEAD = '☠️'
const VICTORIOUS = '🥳'

var gIsTimeStarted=false
var gBoard; 
var gStartTime;
var gInterval;
var gCellsShown = 0;
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    
    clearInterval(gInterval)
    gStartTime = Date.now()
    gGame.isOn=true
    gCellsShown = 0 
    gIsTimeStarted=false

    gBoard = buildBoard(4)
    renderBoard(gBoard)
    var elGamer= document.querySelector(`.gamer`)
    elGamer.innerHTML = ALIVE
}

function gameOver() {
    clearInterval(gInterval)
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 0

    console.log('Game Over');
}

function cellClicked(cellHtml,i,j) {
    if(!gIsTimeStarted) {
        gStartTime = Date.now()
        gIsTimeStarted = true
        openTimer()
    }
    var cellId = [i,j]
    var value;
    gBoard[i][j].isShown = true
    
    if(gGame.isOn) {
        if(gBoard[i][j].isMime) {
            value= MINE
            var elGamer= document.querySelector(`.gamer`)
            elGamer.innerHTML = DEAD
            gGame.isOn= false
            gameOver();
        } else if(gBoard[i][j].mimesAroundCount===0){
            value=''
            gCellsShown++
        } else {
            value=gBoard[i][j].mimesAroundCount
            gCellsShown++
        }
        isWon()
        renderCell({i, j}, value)
    }
}


function isWon(){
    if(gCellsShown===(gLevel.SIZE**2-gLevel.MINES)) {
        var elGamer= document.querySelector(`.gamer`)
        elGamer.innerHTML = VICTORIOUS
        gameOver()
    }
}

function openTimer (){
    gInterval = setInterval(startTimer,10)
}