//game field
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
    gameRow.appendChild(gameCell)
  }
}

const cells = document.querySelectorAll('.game__cell');
cells.forEach(cell => {
  cell.addEventListener('contextmenu', function() {
    console.log(11)
  })
});