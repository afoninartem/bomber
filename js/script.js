//check user settings
const settings = JSON.parse(localStorage.getItem('settings'));
if (settings !== null) {
  const recentSize = settings.size;
  const recentDiff = settings.diff;
  document.querySelector(`option[value="${recentSize}"]`).setAttribute('selected', '')
  document.querySelector(`option[value="${recentDiff}"]`).setAttribute('selected', '')
}

//set rating system in localStorage
const easy = JSON.parse(localStorage.getItem('easy'));
if (easy === null) localStorage.setItem('easy', JSON.stringify([]));
const normal = JSON.parse(localStorage.getItem('normal'));
if (normal === null) localStorage.setItem('normal', JSON.stringify([]));
const hard = JSON.parse(localStorage.getItem('hard'));
if (hard === null) localStorage.setItem('hard', JSON.stringify([]));

//game field generation
const start = () => {
  const gameSize = document.querySelector('#areaSize').value;
  const game = document.querySelector('.game');
  const cellSide = Math.floor(800 / gameSize);
  for (let i = 0; i < gameSize; i += 1) {
    const gameRow = document.createElement('div');
    gameRow.classList.add('game__row');
    game.appendChild(gameRow);
    for (let j = 0; j < gameSize; j += 1) {
      const gameCell = document.createElement('div');
      gameCell.classList.add('game__cell');
      gameCell.dataset.row = i;
      gameCell.dataset.col = j;
      gameCell.style.width = `${cellSide}px`;
      gameCell.style.height = `${cellSide}px`;
      gameCell.style.fontSize = `${cellSide}px`;
      gameRow.appendChild(gameCell);
    }
  }

  const cells = document.querySelectorAll('.game__cell');

  //difficulty
  const difficulty = {
    easy: 6,
    normal: 4,
    hard: 3
  };

  let userDiff = document.querySelector('#difficultySelect').value;
  // console.log(difficulty[userDiff])

  //save last settings to localStorage
  const recentUserSettings = {
    size: gameSize,
    diff: userDiff
  };
  localStorage.setItem('settings', JSON.stringify(recentUserSettings));

  //bombs generation
  const bombs = Math.floor(gameSize ** 2 / difficulty[userDiff]);
  for (let i = 0; i < bombs; i += 1) {
    let bombed = Math.floor(Math.random() * cells.length);
    cells[bombed].classList.add('bomb');
  }

  //site layout
  document.querySelector('.settings').style.display = 'none';
  document.querySelector('.game').style.display = 'flex';
  document.querySelector('.header__title').style.display = 'none';
  document.querySelector('.header__timer').style.display = 'flex';

  //flags 
  document.oncontextmenu = function () {
    return false;
  }
  cells.forEach(cell => {
    cell.addEventListener('contextmenu', function () {
      if (!event.target.classList.contains('opened')) event.target.classList.toggle('flag');
      // console.log(cell);
    });
  });

  //surround cells
  const surroundCells = cell => {
    let x = +cell.dataset.col;
    let y = +cell.dataset.row;
    let arr = [];
    for (let i = y - 1; i <= y + 1; i += 1) {
      for (let j = x - 1; j <= x + 1; j += 1) {
        arr.push(document.querySelector(`div[data-row='${i}'][data-col='${j}']`));
      }
    }
    arr.splice(4, 1);
    let result = arr.filter(el => el !== null);
    // console.log(result)
    return result;
  }

  //coloring function
  const coloring = (cell) => {
    switch (cell.textContent) {
      case '0':
        cell.style.color = 'transparent';
        break;
      case '1':
        cell.style.color = 'blue';
        break;
      case '2':
        cell.style.color = 'green';
        break;
      case '3':
        cell.style.color = 'red';
        break;
      case '4':
        cell.style.color = 'darkblue';
        break;
      case '5':
        cell.style.color = 'darkred';
        break;
    }
  }

  //counting bombs near the cell
  const bombsAround = cell => {
    let cellsAround = surroundCells(cell);
    let bombsAround = cellsAround.filter(el => el.classList.contains('bomb')).length;
    return bombsAround;
  }

  //tips generation
  cells.forEach(cell => {
    let tip = bombsAround(cell);
    if (tip > 0 && !cell.classList.contains('bomb')) cell.textContent = tip;
    else if (!cell.classList.contains('bomb')) cell.classList.add('empty');
  });

  //for imitation of clicks to open the whole empty area
  const clickCell = x => {
    if (!x.classList.contains('opened') && !x.classList.contains('flag')) {
      x.click();
    }
  }

  //empty cells expansion 
  const expansion = cell => {
    const emptySpace = surroundCells(cell);
    emptySpace.forEach(el => {
      clickCell(el);
      if (!el.classList.contains('flag')) coloring(el);
    })
  }

  //first click delete bomb?


  //timer
  const timer = document.querySelector('.header__timer');
  let time = 0;
  const tickTack = () => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    if (sec < 10) sec = '0' + sec;
    if (min < 10) min = '0' + min;
    timer.textContent = `${min}:${sec}`
    if (sec === 59) sec = 0;
    time++;
  }
  tickTack();
  const timerInit = setInterval(tickTack, 1000);

  //demining 
  cells.forEach(cell => {
    cell.addEventListener('click', function () {
      //opening tip cells
      if (!event.target.classList.contains('flag') && !event.target.classList.contains('bomb')) {
        event.target.classList.add('opened');
        //coloring
        coloring(event.target);
      }
      //opening bomb cells
      if (!event.target.classList.contains('flag') && event.target.classList.contains('bomb')) {
        const bombCells = document.querySelectorAll('.bomb');
        bombCells.forEach(cell => cell.classList.add('bombed'));
        //game over
        clearInterval(timerInit);
        document.querySelector('.game-over').style.display = 'flex';
        document.querySelector('.game').style.opacity = '0.5';
        document.querySelector('#onceMore').addEventListener('click', () => {
          window.location.reload();
        });
      }
      //opening empty cells
      if (!event.target.classList.contains('flag') && event.target.classList.contains('empty')) {
        expansion(event.target);
      }
    });
  });

  //victory
  const victory = () => {
    const bombCells = document.querySelectorAll('.bomb');
    const safeCells = Array.from(cells).filter(el => !el.classList.contains('bomb'));
    let term1 = Array.from(bombCells).every(el => el.classList.contains('flag'));
    let term2 = Array.from(safeCells).every(el => el.classList.contains('opened'));
    if (term1 === true && term2 === true) {
      clearInterval(timerInit);
      document.querySelector('.victory').style.display = 'flex';
      document.querySelector('.game').style.opacity = '0.5';
      document.querySelector('#fireworks-canvas').style.display = 'flex';
      document.querySelector('#submitResult').addEventListener('click', () => {
        let winnerName;
        document.querySelector('input').value.length > 0 ? winnerName = document.querySelector('input').value : winnerName = 'Anon';
        const thisDate = new Date();
        let month = thisDate.getMonth() + 1;
        if (month < 10) month = '0' + month;
        let sec = thisDate.getSeconds();
        if (sec < 10) sec = '0' + sec;
        let min = thisDate.getMinutes();
        if (min < 10) min = '0' + min;
        let hour = thisDate.getHours();
        if (hour < 10) hour = '0' + hour;
        let day = thisDate.getDate();
        if (day < 10) day = '0' + day;
        const timeAndDate = `${hour}:${min}:${sec} ${day}.${month}.${thisDate.getFullYear()}`;
        const currentResults = [gameSize, winnerName, time, timer.textContent, timeAndDate];
        const results = JSON.parse(localStorage.getItem(`${userDiff}`));
        if (!results.some(el => el[1] === currentResults[1])) {
          results.push(currentResults);
        } else {
          results.forEach((el, i) => {
            if (el[1] === currentResults[1]) {
              if (el[0] === currentResults[0]) {
                if (el[2] > currentResults[2]) {
                  results.splice(i, 1, currentResults);
                }
              }
            }
          });
        }
        localStorage.setItem(`${userDiff}`, JSON.stringify(results));
        const sameArea = results.filter(el => el[0] === gameSize);
        sameArea.sort((a, b) => a[2] - b[2]);
        const rating = document.querySelector('.rating__list');
        for (let i = 0; i < 10; i += 1) {
          const item = sameArea[i];
          const li = document.createElement('li');
          li.classList.add('rating__list__item');
          li.textContent = `${item[4]} ${item[1]} ${item[3]}`;
          rating.appendChild(li);
        }
        document.querySelector('.victory').style.display = 'none';
        document.querySelector('.rating').style.display = 'flex';
      })
    }
  }
  cells.forEach(cell => {
    cell.addEventListener('click', victory);
    cell.addEventListener('contextmenu', victory);
  });

}

