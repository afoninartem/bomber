//game field generation
const gameHeight = 8;
const gameWidth = 8;
const game = document.querySelector('.game');

for (let i = 0; i < gameHeight; i += 1) {
  const gameRow = document.createElement('div');
  gameRow.classList.add('game__row');
  game.appendChild(gameRow);
  for (let j = 0; j < gameWidth; j += 1) {
    const gameCell = document.createElement('div');
    gameCell.classList.add('game__cell');
    gameCell.dataset.row = i;
    gameCell.dataset.col = j;
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
    coloring(el);
  })
  
}

//first click 
game.addEventListener(click);

//demining 
cells.forEach(cell => {
  cell.addEventListener('click', function () {
    if (!event.target.classList.contains('flag') && !event.target.classList.contains('bomb')) {
      event.target.classList.add('opened');
      //coloring 
      coloring(event.target);
    }
    if (!event.target.classList.contains('flag') && event.target.classList.contains('bomb')) {
      const bombCells = document.querySelectorAll('.bomb');
      bombCells.forEach(cell => cell.classList.add('bombed'));
    }
    if (!event.target.classList.contains('flag') && event.target.classList.contains('empty')) {
      expansion(event.target);
    }
  });
});


//first tryouts

//index of element 
// const getIndex = (x) => {
//   let index = 0;
//   temp = x;
//   while (temp !== x.parentElement.firstElementChild) {
//     temp = temp.previousSibling;
//     index += 1;
//   }
//   return index;
// }

//tips generation
 //in the loop:
  // let index = getIndex(cell);
  // if (!cell.classList.contains('bomb')) {
  //   let tip = 0;
  //   if (cell.previousSibling !== null && cell.previousSibling.classList.contains('bomb')) tip++;
  //   if (cell.nextSibling !== null && cell.nextSibling.classList.contains('bomb')) tip++
  //   if (cell.parentElement !== game.firstElementChild) {
  //     if (cell.parentElement.previousSibling.children[index] !== undefined && cell.parentElement.previousSibling.children[index].classList.contains('bomb')) tip++;
  //     if (cell.parentElement.previousSibling.children[index - 1] !== undefined && cell.parentElement.previousSibling.children[index - 1].classList.contains('bomb')) tip++;
  //     if (cell.parentElement.previousSibling.children[index + 1] !== undefined && cell.parentElement.previousSibling.children[index + 1].classList.contains('bomb')) tip++;
  //   }
  //   if (cell.parentElement !== game.lastElementChild) {
  //     if (cell.parentElement.nextSibling.children[index] !== undefined && cell.parentElement.nextSibling.children[index].classList.contains('bomb')) tip++;
  //     if (cell.parentElement.nextSibling.children[index - 1] !== undefined && cell.parentElement.nextSibling.children[index - 1].classList.contains('bomb')) tip++;
  //     if (cell.parentElement.nextSibling.children[index + 1] !== undefined && cell.parentElement.nextSibling.children[index + 1].classList.contains('bomb')) tip++;
  //   }
  //   if (tip > 0) cell.textContent = tip;
  //   else cell.classList.add('empty');
  // }