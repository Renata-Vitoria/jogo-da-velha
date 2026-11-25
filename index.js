const boardRegions = document.querySelectorAll("#gameBoard button");
let vBoard = []
let turnPlayer = "";
let gameOver = false;

function updateTitle() {
    const playerInput = document.getElementById(turnPlayer);
    const symbol = turnPlayer === 'player1' ? 'X' : 'O';
    const playerName = playerInput.value.trim() || (turnPlayer === 'player1' ? 'Jogador 1' : 'Jogador 2');
    document.getElementById("turnPlayer").textContent = `Vez de ${playerName} (${symbol})`;
    document.querySelector('.player-x').classList.toggle('is-active', turnPlayer === 'player1');
    document.querySelector('.player-o').classList.toggle('is-active', turnPlayer === 'player2');
}

function initializeGame() {
    vBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    turnPlayer = 'player1';
    gameOver = false;
    document.getElementById('startLabel').textContent = 'Reiniciar partida';
    updateTitle();
    boardRegions.forEach(function (element) {
        element.classList.remove('win');
        element.textContent = '';
        element.disabled = false;
        updateRegionLabel(element, 'vazia');
        element.addEventListener('click', handleBoardClick);
    });
}

function updateRegionLabel(element, content) {
    const [row, column] = element.dataset.region.split('.');
    element.setAttribute('aria-label', `Linha ${Number(row) + 1}, coluna ${Number(column) + 1}, ${content}`);
}

function getWinRegions() {
  const winRegions = []
  if (vBoard[0][0] && vBoard[0][0] === vBoard[0][1] && vBoard[0][0] === vBoard[0][2])
    winRegions.push("0.0", "0.1", "0.2")
  if (vBoard[1][0] && vBoard[1][0] === vBoard[1][1] && vBoard[1][0] === vBoard[1][2])
    winRegions.push("1.0", "1.1", "1.2")
  if (vBoard[2][0] && vBoard[2][0] === vBoard[2][1] && vBoard[2][0] === vBoard[2][2])
    winRegions.push("2.0", "2.1", "2.2")
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][0] && vBoard[0][0] === vBoard[2][0])
    winRegions.push("0.0", "1.0", "2.0")
  if (vBoard[0][1] && vBoard[0][1] === vBoard[1][1] && vBoard[0][1] === vBoard[2][1])
    winRegions.push("0.1", "1.1", "2.1")
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][2] && vBoard[0][2] === vBoard[2][2])
    winRegions.push("0.2", "1.2", "2.2")
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][1] && vBoard[0][0] === vBoard[2][2])
    winRegions.push("0.0", "1.1", "2.2")
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][1] && vBoard[0][2] === vBoard[2][0])
    winRegions.push("0.2", "1.1", "2.0")
  return winRegions
}

function disableRegion(element) {
    element.disabled = true;
}

function handleWin(regions) {
    regions.forEach(function (region) {
        document.querySelector('[data-region="' + region + '"]').classList.add('win');
    })
    const input = document.getElementById(turnPlayer);
    const player = input.value.trim() || (turnPlayer === 'player1' ? 'Jogador 1' : 'Jogador 2');
    document.getElementById('turnPlayer').textContent = `${player} venceu!`;
    endGame();
}

function endGame() {
    gameOver = true;
    boardRegions.forEach(disableRegion);
}

function handleBoardClick(ev) {
    if (gameOver) return;

    const span = ev.currentTarget;
    const region = span.dataset.region; // N.N
    const rowColumnPair = region.split('.'); // ['N', 'N']
    const row = rowColumnPair[0];
    const column = rowColumnPair[1];
    if (turnPlayer === 'player1') {
        span.innerText = 'X';
        vBoard[row][column] = 'X';
    } else {
        span.innerText = 'O';
        vBoard[row][column] = 'O';
    }
    updateRegionLabel(span, `marcada com ${span.textContent}`);
    console.clear();
    console.table(vBoard);
    disableRegion(span);
    const winRegions = getWinRegions();
    if (winRegions.length > 0) {
        handleWin(winRegions);
    } else if (vBoard.flat().includes('')) {
        turnPlayer = turnPlayer === 'player1' ? 'player2' : 'player1';
        updateTitle();
    } else {
        document.getElementById('turnPlayer').textContent = 'Empate!';
        endGame();
    }
}

document.getElementById("start").addEventListener("click", initializeGame);
