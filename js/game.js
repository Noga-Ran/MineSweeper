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
    
    clearGame()

    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    gGame.isOn=true
}

function gameOver() {
    gGame.isOn=false
    console.log('Game Over');
    initGame()
}

function cellClicked(cellHtml,i,j) {
    if(gGame.isOn && !gBoard[i][j].isMarked) {

        if(!gIsTimeStarted) {
            gStartTime = Date.now()
            gIsTimeStarted = true
            openTimer()
        }
        var cellId = [i,j]
        var value;
        gBoard[i][j].isShown = true
        
        if(gBoard[i][j].isMime) {
            value = MINE
            var elGamer= document.querySelector(`.gamer`)
            elGamer.innerHTML = DEAD
            gGame.isOn = false
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
        gameOver();
    }
}

function openTimer (){
    gInterval = setInterval(startTimer,10)
}

function setDifficulty(difficulty='easy') {
   
    switch (difficulty) {
        case 'easy':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 'hard':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case 'extreme':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;
    }

    initGame()
}

function clearGame(){ //reset all vars
    clearInterval(gInterval)
    gStartTime = Date.now()
    gCellsShown = 0 
    gIsTimeStarted=false
    var elGamer = document.querySelector(`.gamer`)
    elGamer.innerHTML = ALIVE
}

function addFlag(i,j) {
    //console.log(FLAG);
    if(gBoard[i][j].isMarked) {
        removeFlag(i,j)
    } else {
        gBoard[i][j].isMarked = true
        renderCell({i,j},FLAG)
    }
}

function removeFlag(i,j) {
    gBoard[i][j].isMarked = false
    renderCell({i,j},'')
}