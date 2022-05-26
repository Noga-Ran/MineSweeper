'use strict'

const MINE = '💣'
const FLAG = '🚩'
const ALIVE = '😄'
const DEAD = '☠️'
const VICTORIOUS = '🥳'
const THINKING = '🤔'

var gIsTimeStarted=false
var gBoard; 
var gStartTime;
var gInterval;
var gLives;
var gFlags;

var gLevel = {
    SIZE: 4,
    MINES: 2,
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

    var elLives = document.querySelector('.lives')
    gLives = (!gLives) ? 1 : gLives
    elLives.innerHTML= (!gLives) ? `lives: 1` :`lives:${gLives}`

    var elFlags = document.querySelector('.flags')
    gFlags = (!gFlags) ? 2 : gFlags
    elFlags.innerHTML= (!gFlags) ? `lives: 1` :`Flags:${gFlags}`

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
        
        var value;
        
        if(!gBoard[i][j].isShown) {

            
            if(gBoard[i][j].isMime) {
                value = MINE
                gLives--

                if(gLives<0) {
                    revealAllMines()
                    renderCell({i, j}, value)
                    var elGamer= document.querySelector(`.gamer`)
                    elGamer.innerHTML = DEAD
                    gGame.isOn = false
                    playSound('lose')
                    gameOver();
                }
                if(gLives>=0) {
               var elLives = document.querySelector('.lives')
                elLives.innerHTML=`lives:${gLives}` }
                
            } else if(gBoard[i][j].mimesAroundCount===0){
                value=''
                revealNeigh(i,j)
            } else {
                value=gBoard[i][j].mimesAroundCount
                gGame.shownCount++
            }
            gBoard[i][j].isShown = true

            renderCell({i, j}, value)
            isWon()
        }
        
    }
}

function isWon(){
    if(gGame.shownCount===(gLevel.SIZE**2-gLevel.MINES)) {
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
            gLives = 1;
            gFlags=2;
            break;
        case 'hard':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            gLives = 3;
            gFlags = 12;
            break;
        case 'extreme':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            gLives = 3;
            gFlags = 30;
            break;
    }

    initGame()
}

function clearGame(){ //reset all vars
    clearInterval(gInterval)
    //gStartTime = Date.now()
    gGame.markedCount = 0
    gGame.shownCount = 0
    //var elLives = document.querySelector('.lives')
    //elLives.innerHTML=`lives:${gLives}`
    gIsTimeStarted=false
    var elHints = document.querySelector('.hints')
    elHints.innerHTML='Hints:💡💡💡'
}

function addFlag(i,j) {
    if(!gIsTimeStarted) {
        openTimer()
    }

    if(gBoard[i][j].isMarked) {
        removeFlag(i,j)
        gGame.markedCount--
        var elFlags = document.querySelector('.flags')
        gFlags++
        elFlags.innerHTML= `Flags:${gFlags}`

    } else if(gGame.markedCount<gLevel.MINES) {
        gBoard[i][j].isMarked = true
        renderCell({i,j},FLAG)
        gGame.markedCount++
        var elFlags = document.querySelector('.flags')
        gFlags--
        elFlags.innerHTML= `Flags:${gFlags}`
    }
}

function removeFlag(i,j) {
    renderCell({i,j},'')
    gBoard[i][j].isMarked = false
    gBoard[i][j].isShown=false
}

function revealNeigh(i,j) {
    var cellI = i
    var cellJ = j

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        //   if (i === cellI && j === cellJ) continue;
          
          if (j < 0 || j >= gBoard[i].length) continue;

          if(!gBoard[i][j].isMime && !gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
              gBoard[i][j].isShown = true
              var value = (gBoard[i][j].mimesAroundCount===0) ? '' : gBoard[i][j].mimesAroundCount
              renderCell({i,j}, value)
              gGame.shownCount++
          }
        }
    }
}

function revealAllMines() {
    var minesLocations = findMimes(gBoard)

    for(var k=0; k<minesLocations.length; k++) {
        var currentMineLocation = minesLocations[k]
        renderCell(currentMineLocation, MINE)
    }
}

function giveHint(hintHtml) {
    if(!gGame.isOn) return
    
    if(hintHtml!=='Hints:') {
        var elGamer = document.querySelector(`.gamer`)
        elGamer.innerHTML = THINKING
        revealAllMines()

        setTimeout(unRevealMines,500)
    }

    var elHints = document.querySelector('.hints')
    var newHTML = elHints.innerHTML.replace('💡', '')
    elHints.innerHTML = newHTML

}

function unRevealMines() {
    var minesLocations = findMimes(gBoard)
    for(var k=0; k<minesLocations.length; k++) {
        var currentMineLocation = minesLocations[k]
        if(gBoard[currentMineLocation.i][currentMineLocation.j].isShown) continue;
        renderCell(currentMineLocation, '')
    }

    var elGamer = document.querySelector(`.gamer`)
    elGamer.innerHTML = ALIVE
}