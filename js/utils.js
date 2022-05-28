'use strict'

function buildBoard(boardSize) { //build board with resae values
  var board = [];
    
  for (var i = 0; i < boardSize; i++) {
    board[i] = []
    for (var j = 0; j < boardSize; j++) {
        board[i][j] = {
          mimesAroundCount: 0,
          isShown: false,
          isMime: false,
          isMarked: false,
        }
      }
    }

  if(!gLevel.isMenually) { // add and count mines if user didn't choose 'Menually'
    addMines(board)
    setMinesNegsCount(board)
  }
    
  return board;
}

function addMines(board,loaction) {

  if(gLevel.isMenually) {
    board[loaction.i][loaction.j].isMime = true //if user choose 'menually', mines will added according to choosen location
    return
  }
  
  if(!gLevel.isSevenBoom) { //if level is not sevenBoom, mines will be enter randomly
    for(var i=0; i<gLevel.MINES; i++) {
      var index = getRandomCellIndex(board)
      board[index.i][index.j].isMime = true
    }
  }
  else { //every cell that have a number that divided by seven, will be mine
    for(var k=0; k<gLevel.MINES; k++) {
      for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if(!cell.isMime && !cell.isShown && (i%7===0&&i || j%7===0&&j)) {
              cell.isMime=true
            }
          }
      }
    }
  }
}

function setMinesNegsCount(board) {

  var mimesLoaction = findMimes(board)
  
  for(var k=0; k<mimesLoaction.length ; k++) {  //run on the neighbors of every mine and add one to their mine count
  var cellI = mimesLoaction[k].i
  var cellJ = mimesLoaction[k].j
    
  for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
          if (i === cellI && j === cellJ) continue;
          
          if (j < 0 || j >= board[i].length) continue;
  
          board[i][j].mimesAroundCount= board[i][j].mimesAroundCount+1
        }
      }
    }
}

function findMimes(board) { //find all the mines in the board

  var mimesLoaction = []

  for(var i=0; i<board.length; i++) {
    for(var j=0; j<board[i].length; j++) {
      if(board[i][j].isMime) {
        mimesLoaction.push({i,j})
      }

    }
  }
  return mimesLoaction
}

function renderBoard(board) {
  var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';

        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var classId = [i,j]
            strHTML += `<td onclick="cellClicked(${i} ,${j})" oncontextmenu="addFlag(${i} ,${j})" id="${classId}" ></td>`;
        }

        strHTML += '</tr>';
    }

    var elBoard = document.querySelector('body table');
    elBoard.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  
  var cellId = [location.i,location.j]
  var elCell = document.getElementById(`${cellId}`);
  elCell.innerHTML = value;

  if(gBoard[location.i][location.j].isMarked && value==='') { 
    elCell.style.backgroundColor='rgba(179, 176, 176, 0.765)'
    return;
  }

  if(gBoard[location.i][location.j].isMime && value==='') {
    elCell.style.backgroundColor='rgba(179, 176, 176, 0.765)'
    return;
  }

  elCell.style.backgroundColor = (value===FLAG) ? 'rgba(179, 176, 176, 0.765)' : 'lightblue'
  elCell.style.backgroundColor = (value===MINE) ? 'red' : 'lightblue'
}

function getRandomCellIndex(board) {
  
  var emptyCells = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
        var cell = board[i][j]
        if(!cell.isMime && !cell.isShown) {
          emptyCells.push({i,j})
        }
      }
  }

  var randomIndex = Math.floor(Math.random() * (emptyCells.length))
  var randomI = emptyCells[randomIndex].i
  var randomJ = emptyCells[randomIndex].j
  
  return {i:randomI ,j:randomJ}
}

function startTimer() {
  setTimeout(updateTime, 80)
}

function updateTime() {
  var now = Date.now()
  var diff = now - gStartTime
  var secondsPast = diff / 1000

  var elTimer = document.querySelector('.timer')
  elTimer.innerHTML = secondsPast.toFixed(3)
  gGame.secsPassed = elTimer.innerHTML;
}

function saveScore() {

  var level = gLevel.levelName;

  if (typeof(Storage) !== 'undefined') {

    if(localStorage.getItem(`fastest in level ${level}`)){ //if the item exist

      if(+(localStorage.getItem(`fastest in level ${level}`))>gGame.secsPassed) { //it the current time is faster then pervious one, enter

        localStorage.setItem(`fastest in level ${level}`, gGame.secsPassed);
        localStorage.removeItem(`fastest in level 4`)
      }
    } else {
      localStorage.setItem(`fastest in level ${level}`, gGame.secsPassed); //if it not define, create
    }
  document.getElementById("result").innerHTML = `the fastest in level '${level}' : `+localStorage.getItem(`fastest in level ${level}`);
  } else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
  }
  
}

function returnParameters(len,value) { 

  var values='';

  for(var i=0; i<len; i++) {
    values+=value
  }
  return values
}

function playSound(sound) { //this fuction gets name and play the file that have this name
  var sound = new Audio(`sounds/${sound}.mp3`)
  sound.play()
}