// TODO
// Make dynamic grid wrapper
// resize cells automatically depending on grid size 

function init() {




  // ! ELEMENTS
  // start button
  const startButton = document.querySelector('#start-button')
  // reset
  const resetButton = document.querySelector('#reset-button')
  // grid
  const grid = document.querySelector('.grid')

  // grid cells
  const cells = []
  // lives display span
  // score display span

  // ! VARIABLES 
  // score
  // lives
  // ? Game variables
  let gameTimer
  let projectileTimer


  // ? Grid variables
  // width of grid
  const gridWidth = 10
  const gridHeight = 10
  const cellCount = gridWidth * gridHeight
  grid.style.offsetHeight = '50px'
  grid.style.offsetWidth = '50px'
  grid.style.border = '1px solid black'


  // ? player variables
  // Starting position
  let playerCurrentPos
  // Current position 

  // ? Enemy variables 
  // Starting position 

  // Current position 
  let enemyCurrentPos = []
  let enemyNextPos = []
  let enemyDirection = 'right'

  // Next position 
  // Position of neighbour/s

  // ? Projectile variables
  let projectileCurrentPos
  let projectileNextPos
  let projectileOnGrid = false

  // ! FUNCTIONS
  // ? Create game grid 
  function createGameGrid() {
    for (let i = 0; i < cellCount; i++) {
      // Create element dynamically using createElement
      const cell = document.createElement('div')
      // Display index of grid element
      cell.innerHTML = i
      // Add the index as a data-id
      cell.id = i
      // Append the new cell to the grid 
      grid.appendChild(cell)
      //push cell into array 
      cells.push(cell)
    }
  }
  // on page load dynamically create game grid 
  createGameGrid()

  // ? Start game function 

  function startGame() {
    console.log('game started')
    //create game grid should be here
    //spawn enemies at starting position
    spawnEnemies()
    //spawn player at starting position
    spawnPlayer(94)
  }

  // ? TIMERS
  function mainGameTimer() {
    if (!gameTimer) {
      gameTimer = setInterval(() => {
        console.log(enemyCurrentPos)
        updateEnemyPos()
      }, 1000)
      startGame()
    }
  }


  // ? Reset game function 
  function reset() {
    clearInterval(gameTimer)
    window.location.reload()
  }

  // ! MOVEMENT 
  //Update enemy position in grid 
  function updateEnemyPos() {
    //If last item in array = width of the grid - 1 and the direction is right, increment currentPos by 1 
    if (enemyCurrentPos[enemyCurrentPos.length - 1] % gridWidth !== gridWidth - 1 && enemyDirection === 'right') {
      enemyNextPos = enemyCurrentPos.map(cell => {
        cell++
        return cell
      })
    } else if (enemyCurrentPos[enemyCurrentPos.length - 1] % gridWidth === gridWidth - 1 && enemyDirection === 'right') {
      enemyNextPos = enemyCurrentPos.map(cell => {
        cell += 10
        enemyDirection = 'left'
        return cell
      })
    } else if (enemyCurrentPos[0] % gridWidth !== 0 && enemyDirection === 'left') {
      enemyNextPos = enemyCurrentPos.map(cell => {
        cell--
        return cell
      })
    } else {
      enemyNextPos = enemyCurrentPos.map(cell => {
        cell += 10
        enemyDirection = 'right'
        return cell
      })
    }
    enemyCurrentPos.forEach(cell => {
      cells[cell].classList.remove('enemy')
    })
    enemyNextPos.forEach(cell => {
      cells[cell].classList.add('enemy')
    })
    enemyCurrentPos = enemyNextPos.map(cell => {
      return cell
    })
  }

  // Handle projectile movement 
  function updateProjectilePos() {
    projectileTimer = setInterval(() => {
      // remove previous projectile
      cells[projectileCurrentPos].classList.remove('projectile')

      // If projectile is  not at top of grid and cell doesn't contain an enemy or another projectile, move projectile forward away from player 
      if (projectileCurrentPos >= gridHeight && cells[projectileCurrentPos].classList.contains('enemy') !== true && cells[projectileCurrentPos].classList.contains('projectile') !== true) {
        projectileNextPos = projectileCurrentPos - 10
        cells[projectileNextPos].classList.add('projectile')
        projectileCurrentPos = projectileNextPos

        // If projectile is  not at top of grid and cell contains an enemy or another projectile, move projectile forward away from player 
      } else if (projectileCurrentPos >= gridHeight && cells[projectileCurrentPos].classList.contains('enemy') === true) {
        enemyCurrentPos.splice(enemyCurrentPos, 1)
        cells[projectileCurrentPos].classList.remove('enemy', 'projectile')
        projectileOnGrid = false
        clearInterval(projectileTimer)

      } else {
        cells[projectileCurrentPos].classList.remove('enemy', 'projectile')
        projectileOnGrid = false
        clearInterval(projectileTimer)
      }
    }, 100)
  }

  // Function to handle player movement from user input 
  function handlePlayerMovement(event) {
    const key = event.keyCode
    const left = 37
    const right = 39
    const space = 32
    cells[playerCurrentPos].classList.remove('player')
    if (key === right && playerCurrentPos % gridWidth !== gridWidth - 1) {
      playerCurrentPos++
    } else if (key === left && playerCurrentPos % gridWidth !== 0) {
      playerCurrentPos--
    } else if (key === space) {
      spawnProjectile(playerCurrentPos)
    }
    cells[playerCurrentPos].classList.add('player')
  }

  // ? SPAWN FUNCTIONS
  //Player
  function spawnPlayer(position) {
    playerCurrentPos = position
    cells[playerCurrentPos].classList.add('player')
  }

  // Enemy
  function spawnEnemies() {
    //dynamically create array here
    enemyCurrentPos.push(1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16)
    enemyCurrentPos.forEach(cell => {
      cells[cell].classList.add('enemy')
    })
  }
  // Projectiles
  function spawnProjectile(position) {
    if (projectileOnGrid === false) {
      projectileCurrentPos = position - 10
      cells[projectileCurrentPos].classList.add('projectile')
      updateProjectilePos()
      projectileOnGrid = true
    }
  }


  // ? End game screen 

  // ! EVENTS
  // Start button
  startButton.addEventListener('click', mainGameTimer)
  // Reset button
  resetButton.addEventListener('click', reset)
  // Keyboard input 
  document.addEventListener('keydown', handlePlayerMovement)
  //      - Arrow keys to move
  //      - Space to fire





}

window.addEventListener('DOMContentLoaded', init)

