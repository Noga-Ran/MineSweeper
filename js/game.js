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
    var elGamer = document.querySelector(`.gamer`)
    elGamer.innerHTML = ALIVE

    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    gGame.isOn=true
}

function gameOver() {
    gGame.isOn=false
    console.log('Game Over');
    clearGame()
}

function cellClicked(cellHtml,i,j) {

    if(!gIsTimeStarted && gBoard[i][j].isMime) {
        initGame()
    }
    if(gGame.isOn && !gBoard[i][j].isMarked) {

        if(!gIsTimeStarted) {
            openTimer()
        }
        var cellId = [i,j]
        var value;
        
        if(!gBoard[i][j].isShown) {

            if(gBoard[i][j].isMime) {
                value = MINE
                var elGamer= document.querySelector(`.gamer`)
                elGamer.innerHTML = DEAD
                gGame.isOn = false
                playSound('lose')
                gameOver();
    
            } else if(gBoard[i][j].mimesAroundCount===0){
                value=''
                revealNeigh(i,j)
            } else {
                value=gBoard[i][j].mimesAroundCount
                gCellsShown++
            }
            isWon()
            renderCell({i, j}, value)
            gBoard[i][j].isShown = true
        }

    }
}

function isWon(){
    if(gCellsShown===(gLevel.SIZE**2-gLevel.MINES)) {
        var elGamer= document.querySelector(`.gamer`)
        elGamer.innerHTML = VICTORIOUS
        playSound('win')
        gameOver();
    }
}

function openTimer (){
    //gStartTime = Date.now()
    gIsTimeStarted = true
    gStartTime = Date.now()
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
    //gStartTime = Date.now()
    gCellsShown = 0 
    gIsTimeStarted=false
}

function addFlag(i,j) {
    if(!gIsTimeStarted) {
        openTimer()
    }

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

function revealNeigh(i,j) {
    var cellI = i
    var cellJ = j

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        //   if (i === cellI && j === cellJ) continue;
          
          if (j < 0 || j >= gBoard[i].length) continue;

          if(!gBoard[i][j].isMime && !gBoard[i][j].isShown) {
              var value = (gBoard[i][j].mimesAroundCount===0) ? '' : gBoard[i][j].mimesAroundCount
              renderCell({i,j}, value)
              gCellsShown++
          }
        }
    }
}
