'use strict'

const MINE = '💣'
const FLAG = '🚩'
const ALIVE = '😄'
const DEAD = '☠️'
const VICTORIOUS = '🥳'
const THINKING = '🤔'
const HEART = '💗'

var gIsTimeStarted=false
var gBoard; 
var gStartTime;
var gInterval;
var gLives;
var gFlags;
var gSafeClick;
var gMineCount=0;
var gRevals = [];
var gPressManually = 0

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIFE: 1,
    isSevenBoom: false,
    isMenually: false,
    levelName: 'easy',
}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

function initGame() { 
    
    clearGame() //make sure that the game is 'clear' from any pervious games (except storage values)
   
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    gGame.isOn=true
}

function cellClicked(i,j) {
    
    if(gLevel.isMenually) { 
        if(gBoard[i][j].isMime) return //if the cell already have mine, nothing happen
        
        var leftToAdd = gLevel.MINES-gMineCount-1 //will tell the user how left to add
        var elMenuallyBtn = document.getElementById("menuallyBtn")
        elMenuallyBtn.innerHTML = `${leftToAdd}`
        
        addMines(gBoard,{i,j})
        gMineCount++


        if(gMineCount>=gLevel.MINES){  //every cell the user click on will turn to mine while the number mines on the board is smaller then the number in Glevel.mines
            
            setMinesNegsCount(gBoard)
            gLevel.isMenually = false; //turn to false, so that game will start
            gPressManually = 1 
        }
        return
    }

    if(!gIsTimeStarted && gBoard[i][j].isMime &&!gPressManually) { //if first press is mine, the board will rebulit
        initGame()
    }
    
    var elGamer= document.querySelector(`.gamer`)
    
    if(elGamer.innerHTML===THINKING) { //when give hint was pressed
        
        revealNeigh(i,j)
        setTimeout(function(){unRevealNeigs(gRevals)},1000)
    }
    
    if(gGame.isOn && !gBoard[i][j].isMarked) {  //won't change cell if the gane is over/there is flag inside
        
        if(!gIsTimeStarted) {
            openTimer() //open timer in the first click
        }
        
        var value;
        
        if(!gBoard[i][j].isShown) { //don't chanage is cell is shown
            
            
            if(gBoard[i][j].isMime) { 
                
                value = MINE
                gLives-- //remove one from the life that have been left
                
                if(gLives<0) { //if step on mine and have zero life 
                    revealAllMines()
                    renderCell({i, j}, value)
                    gameOver();
                }
                
                if(gLives>=0) {
                    var elLives = document.querySelector('.lives')
                    var newHtml = returnParameters(gLives,HEART) //print to the user how many lives have benn left
                    
                    elLives.innerHTML=`lives:${newHtml}`
                }
                
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

function setDifficulty(difficulty='easy') {
    gLevel.levelName=difficulty;
    
    switch (difficulty) {
        case 'easy':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            gLevel.LIFE = 1;
            gLevel.isMenually = false
            gLives = 1;
            gFlags=2;
            break;
            
        case 'hard':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            gLevel.LIFE = 3;
            gLevel.isMenually = false
            gLives = 3;
            gFlags = 12;
            break;
                
        case 'extreme':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            gLevel.LIFE = 3;
            gLevel.isMenually = false
            gLives = 3;
            gFlags = 30;
            break;
            
        case 'menually':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            gLevel.LIFE = 3;
            gLevel.isMenually = true
            gLives = 3;
            gFlags = 12;
            break;
                
        case 'sevenBoom':
            gLevel.SIZE = 12;
            gLevel.MINES = 23;
            gLevel.LIFE = 3;
            gLevel.isMenually = false
            gLevel.isSevenBoom = true
            gLives = 3;
            gFlags = 23;
            break;
        }
                
    initGame()
}
            
function clearGame(){ //reset all vars

    //gLevel.isMenually= false
    //gStartTime = Date.now()
    
    gPressManually = 0
    var elGamer = document.querySelector(`.gamer`)
    elGamer.innerHTML = ALIVE
    var elHints = document.querySelector('.hints')
    elHints.innerHTML='Hints:💡💡💡'
    gRevals = []
    
    var elLives = document.querySelector('.lives')
    gLives = (!gLives) ? 1 : gLives
    var newHtml = returnParameters(gLives,HEART)
    elLives.innerHTML= (!gLives) ? `lives: 1` :`lives:${newHtml}`
    gLives = (gLives<0) ? (gLevel).LIFE : gLives
    newHtml = returnParameters(gLives,HEART)
    elLives.innerHTML= (!gLives) ? `lives: 1` :`lives:${newHtml}`
    
    var elFlags = document.querySelector('.flags')
    gFlags = (!gFlags) ? 2 : gFlags
                
    elFlags.innerHTML= (!gFlags) ? `lives: 1` :`Flags:${FLAG}(${gFlags})`
    
    clearInterval(gInterval)
    gGame.markedCount = 0
    gGame.shownCount = 0
    gMineCount = 0;
    
    gIsTimeStarted=false
    gSafeClick = 3
    var elSafeClick = document.querySelector('.safeClick')
    elSafeClick.innerHTML = `safe click:<br>${gSafeClick} available`
    var elTimer = document.querySelector('.timer')
    elTimer=0
    var elMenuallyBtn = document.getElementById("menuallyBtn")
    elMenuallyBtn.innerHTML = 'Menually'
}

function isWon(){ //checks winning. stop game if true.
    
    if(gGame.shownCount===(gLevel.SIZE**2-gLevel.MINES)) { //is won if cell shown number equal to the cells without mines number
        clearInterval(gInterval) 
        gGame.isOn=false
        
        // var elTimer = document.querySelector('.timer')
        // gGame.secsPassed = elTimer.innerHTML;
        
        saveScore()
        
        var elGamer= document.querySelector(`.gamer`)
        elGamer.innerHTML = VICTORIOUS
        
        playSound('win')
    }
}

function gameOver() { //stop game when games lost
    gGame.isOn=false
    var elGamer= document.querySelector(`.gamer`)
    elGamer.innerHTML = DEAD
    playSound('lose')
    clearInterval(gInterval) //stop timer
    console.log('Game Over'); //change later to a pop up window
}

function addFlag(i,j) {
    
    if(gBoard[i][j].isShown || !gGame.isOn || gLevel.isMenually) return
    
    if(!gIsTimeStarted) { //start timer is its the first click
        openTimer()
    }
    
    if(gBoard[i][j].isMarked) { //if there is already a flag, will call removeFlag function
        removeFlag(i,j)
        gGame.markedCount--
        var elFlags = document.querySelector('.flags')
        gFlags++ //add 1 to numbers of flags 
        elFlags.innerHTML= `Flags:${FLAG}(${gFlags})` //printing the number of flag
        
    } else if(gGame.markedCount<gLevel.MINES) { //check if there left flags in the counter
        gBoard[i][j].isMarked = true
        renderCell({i,j},FLAG) //print flag in the cell
        gGame.markedCount++
        var elFlags = document.querySelector('.flags')
        gFlags-- //remove 1 from numbers of flags 
        elFlags.innerHTML= `Flags:${FLAG}(${gFlags})` //printing the number of flag
    }
}

function removeFlag(i,j) { //gets location from addFlag function, and remove from there the flag
    renderCell({i,j},'')
    gBoard[i][j].isMarked = false
    gBoard[i][j].isShown=false
}

function revealNeigh(i,j) {
    var cellI = i
    var cellJ = j
    
    var elGamer = document.querySelector(`.gamer`)

    
    for (var i = cellI - 1; i <= cellI + 1; i++) { //run on the neighbors of the cell
        if (i < 0 || i >= gBoard.length) continue;
        
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            
            if (j < 0 || j >= gBoard[i].length) continue;
            
            if(elGamer.innerHTML===THINKING) { //enter when the user press 'hint' 
                
                if(gBoard[i][j].isMime) {
                    value=MINE
                } else if(gBoard[i][j].mimesAroundCount===0) {
                    value=''
                } else {
                    value = gBoard[i][j].mimesAroundCount
                }
                
                renderCell({i,j}, value)
                
                if(i===cellI&&j===cellJ) continue
        
                gRevals.push({i,j}) //push all of the cell negibors to arr (so they culd be unreveld later)
                continue
            }
            
            if(!gBoard[i][j].isMime && !gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true
                var value = (gBoard[i][j].mimesAroundCount===0) ? '' : gBoard[i][j].mimesAroundCount
                renderCell({i,j}, value)
                gGame.shownCount++
                
                if(!gBoard[i][j].mimesAroundCount && elGamer.innerHTML===ALIVE) { //recursion the function if the cell is empty and the user didn't asked for a hint
                    revealNeigh(i,j)
                }
            }
        }
    }
}

function unRevealNeigs(revals) { //gets the neighbors that was reavels when 'hint' was pressed
  
    for(var k=0; k<revals.length ;k++) {
      var cellI = revals[k].i
      var cellJ = revals[k].j
  
      if(!gBoard[cellI][cellJ].isShown) { //doesn't unreavel cell that was shown already when 'hint' as preesed
        if(gBoard[cellI][cellJ].isMarked) { 
            renderCell({i: cellI,j:cellJ}, FLAG)
            continue;
      }
      renderCell({i: cellI,j:cellJ}, '')
      var cellId = [cellI,cellJ]
      var elCell = document.getElementById(`${cellId}`);
      elCell.style.backgroundColor='rgba(179, 176, 176, 0.765)'
      }
    }

    var elGamer = document.querySelector(`.gamer`)
    elGamer.innerHTML = ALIVE
}

function giveHint(hintHtml) {
    
    if(!gGame.isOn || gLevel.isMenually) return
    
    if(hintHtml!=='Hints:') {
        var elGamer = document.querySelector(`.gamer`)
        elGamer.innerHTML = THINKING
    }
    
    var elHints = document.querySelector('.hints')
    var newHTML = elHints.innerHTML.replace('💡', '')
    elHints.innerHTML = newHTML
    
}

function safeClick() { //get random cell that is not a mine

    if(!gSafeClick || !gGame.isOn || gLevel.isMenually) return //if there not any safe click left/game is of/user placing mine = return
  
    var randomSafeIndex = getRandomCellIndex(gBoard)
  
    var id = [randomSafeIndex.i,randomSafeIndex.j] 
    var elSafeIndex = document.getElementById(`${id}`) 
    
    elSafeIndex.style.borderColor = 'purple'; 
    elSafeIndex.style.backgroundColor = 'violet';
  
    setTimeout(function(){
      elSafeIndex.style.borderColor = 'black';
      elSafeIndex.style.backgroundColor = 'rgba(179, 176, 176, 0.765)';
    },1000)
    
  
    gSafeClick--
    var elSafeClick = document.querySelector('.safeClick')
    elSafeClick.innerHTML = `safe click:<br>${gSafeClick} available`
  
}

function revealAllMines() { //when game is over (lost), all mines reveal
 
    var minesLocations = findMimes(gBoard) //find all the mines
    
    for(var k=0; k<minesLocations.length; k++) { //reveal them
        var currentMineLocation = minesLocations[k]
        renderCell(currentMineLocation, MINE)
    }
}

function openTimer (){
    gIsTimeStarted = true
    gStartTime = Date.now()
    gInterval = setInterval(updateTime,1)
}