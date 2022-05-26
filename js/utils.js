'use strict'

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell-' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function buildBoard(boardSize) {
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

  addMine(board)

  setMinesNegsCount(board)
    
  return board;
}

function addMine(board) {
  for(var i=0; i<gLevel.MINES; i++) {
    var index = getRandomCellIndex(board)
    board[index.i][index.j].isMime = true
  }
}

function setMinesNegsCount(board) {

  var mimesLoaction = findMimes(board)
  
  for(var k=0; k<mimesLoaction.length ; k++) {
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

function findMimes(board) {

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
            strHTML += `<td onclick="cellClicked(this,${i} ,${j})" oncontextmenu="addFlag(${i} ,${j})" id="${classId}" ></td>`;
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

function playSound(sound) {
  var sound = new Audio(`sounds/${sound}.mp3`)
  sound.play()
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomCellIndex(board) {
  
  var emptyCells = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
        var cell = board[i][j]
        if(!cell.isMime) {
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
  elTimer.innerText = secondsPast.toFixed(3)
}