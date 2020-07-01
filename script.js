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

//tips generation

//demining 
cells.forEach(cell => {
  cell.addEventListener('click', function () {
    if (!event.target.classList.contains('flag')) event.target.classList.add('opened');
    if (event.target.classList.contains('bomb')) {
      event.target.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bomb" class="svg-inline--fa fa-bomb fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M440.5 88.5l-52 52L415 167c9.4 9.4 9.4 24.6 0 33.9l-17.4 17.4c11.8 26.1 18.4 55.1 18.4 85.6 0 114.9-93.1 208-208 208S0 418.9 0 304 93.1 96 208 96c30.5 0 59.5 6.6 85.6 18.4L311 97c9.4-9.4 24.6-9.4 33.9 0l26.5 26.5 52-52 17.1 17zM500 60h-24c-6.6 0-12 5.4-12 12s5.4 12 12 12h24c6.6 0 12-5.4 12-12s-5.4-12-12-12zM440 0c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12s12-5.4 12-12V12c0-6.6-5.4-12-12-12zm33.9 55l17-17c4.7-4.7 4.7-12.3 0-17-4.7-4.7-12.3-4.7-17 0l-17 17c-4.7 4.7-4.7 12.3 0 17 4.8 4.7 12.4 4.7 17 0zm-67.8 0c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17zm67.8 34c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17zM112 272c0-35.3 28.7-64 64-64 8.8 0 16-7.2 16-16s-7.2-16-16-16c-52.9 0-96 43.1-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16z"></path></svg>`;
      document.querySelector('.game-over').style.display = 'block';
      document.querySelector('.game').style.display = 'none';
    }
    let index = 0;
    temp = event.target;
    while (temp !== event.target.parentElement.firstElementChild) {
      temp = temp.previousSibling;
      index += 1;
    }
    if (!event.target.classList.contains('bomb')) {
      let tip = 0;
      if (event.target.previousSibling !== null && event.target.previousSibling.classList.contains('bomb')) tip++;
      if (event.target.nextSibling !== null && event.target.nextSibling.classList.contains('bomb')) tip++
      if (event.target.parentElement !== game.firstElementChild) {
        if (event.target.parentElement.previousSibling.children[index] !== undefined && event.target.parentElement.previousSibling.children[index].classList.contains('bomb')) tip++;
        if (event.target.parentElement.previousSibling.children[index - 1] !== undefined && event.target.parentElement.previousSibling.children[index - 1].classList.contains('bomb')) tip++;
        if (event.target.parentElement.previousSibling.children[index + 1] !== undefined && event.target.parentElement.previousSibling.children[index + 1].classList.contains('bomb')) tip++;
      }
      if (event.target.parentElement !== game.lastElementChild) {
        if (event.target.parentElement.nextSibling.children[index] !== undefined && event.target.parentElement.nextSibling.children[index].classList.contains('bomb')) tip++;
        if (event.target.parentElement.nextSibling.children[index - 1] !== undefined && event.target.parentElement.nextSibling.children[index - 1].classList.contains('bomb')) tip++;
        if (event.target.parentElement.nextSibling.children[index + 1] !== undefined && event.target.parentElement.nextSibling.children[index + 1].classList.contains('bomb')) tip++;
      }
      event.target.textContent = tip;
      //coloring 
      cells.forEach(cell => {
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
      });
    }
  });
});

