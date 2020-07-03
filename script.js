//game field generation
const gameHeight = 8;
const gameWidth = 8;
const game = document.querySelector('.game');

for (let i = 0; i < gameHeight; i += 1) {
  const gameRow = document.createElement('div');
  gameRow.classList.add('game__row');
  gameRow.dataset.testValue = i;
  game.appendChild(gameRow);
  for (let j = 0; j < gameWidth; j += 1) {
    const gameCell = document.createElement('div');
    gameCell.classList.add('game__cell');
    gameCell.dataset.testValue = j;
    gameRow.appendChild(gameCell);
  }
}

//flags 
document.oncontextmenu = function () {
  return false;
}
const cells = document.querySelectorAll('.game__cell');
cells.forEach(cell => {
  cell.addEventListener('contextmenu', function () {
    if (!event.target.classList.contains('opened')) event.target.classList.toggle('flag');
  });
});

//bombs generation
const bombs = Math.floor(gameHeight * gameWidth / 4);
for (let i = 0; i < bombs; i += 1) {
  let bombed = Math.floor(Math.random() * cells.length);
  cells[bombed].classList.add('bomb');
}
//index of element 
const getIndex = (x) => {
  let index = 0;
  temp = x;
  while (temp !== x.parentElement.firstElementChild) {
    temp = temp.previousSibling;
    index += 1;
  }
  return index;
}

const surroundCells = (cell) => {
  let x = cell.dataset.testValue;
  let y = cell.parentElement.dataset.testValue;
  const arr = [];
  for (let i = y - 1; i < 3; i += 1) {
    for (let j = x - 1; j < 3; i += 1) {
      arr.push(); //разобраться с доступом к атрибуту датасет
    }
  }
}
//tips generation
cells.forEach(cell => {
  let index = getIndex(cell);
  if (!cell.classList.contains('bomb')) {
    let tip = 0;
    if (cell.previousSibling !== null && cell.previousSibling.classList.contains('bomb')) tip++;
    if (cell.nextSibling !== null && cell.nextSibling.classList.contains('bomb')) tip++
    if (cell.parentElement !== game.firstElementChild) {
      if (cell.parentElement.previousSibling.children[index] !== undefined && cell.parentElement.previousSibling.children[index].classList.contains('bomb')) tip++;
      if (cell.parentElement.previousSibling.children[index - 1] !== undefined && cell.parentElement.previousSibling.children[index - 1].classList.contains('bomb')) tip++;
      if (cell.parentElement.previousSibling.children[index + 1] !== undefined && cell.parentElement.previousSibling.children[index + 1].classList.contains('bomb')) tip++;
    }
    if (cell.parentElement !== game.lastElementChild) {
      if (cell.parentElement.nextSibling.children[index] !== undefined && cell.parentElement.nextSibling.children[index].classList.contains('bomb')) tip++;
      if (cell.parentElement.nextSibling.children[index - 1] !== undefined && cell.parentElement.nextSibling.children[index - 1].classList.contains('bomb')) tip++;
      if (cell.parentElement.nextSibling.children[index + 1] !== undefined && cell.parentElement.nextSibling.children[index + 1].classList.contains('bomb')) tip++;
    }
    if (tip > 0) cell.textContent = tip;
    else cell.classList.add('empty');
  }
});

//demining 
cells.forEach(cell => {
  cell.addEventListener('click', function () {
    if (!event.target.classList.contains('flag') && !event.target.classList.contains('bomb')) {
      event.target.classList.add('opened');
      //coloring 
      switch (event.target.textContent) {
        case '0':
          event.target.style.color = 'transparent';
          break;
        case '1':
          event.target.style.color = 'blue';
          break;
        case '2':
          event.target.style.color = 'green';
          break;
        case '3':
          event.target.style.color = 'red';
          break;
        case '4':
          event.target.style.color = 'darkblue';
          break;
        case '5':
          event.target.style.color = 'darkred';
          break;
      }
    }
    if (!event.target.classList.contains('flag') && event.target.classList.contains('bomb')) {
      const bombCells = document.querySelectorAll('.bomb');
      bombCells.forEach(cell => cell.classList.add('bombed'));
    }
  });
});