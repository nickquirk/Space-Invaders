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
  // enemies 
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
  const gridWidth = 14
  const gridHeight = 12
  const cellCount = gridWidth * gridHeight
  grid.style.offsetHeight = '50px'
  grid.style.offsetWidth = '50px'
  grid.style.border = '1px solid black'


  // ? player variables
  // Starting position
  let playerCurrentPos
  let lives = 3
  let totalScore = 0

  // ? Enemy variables 
  // Starting position
  const enemyArray = []
  const enemyCurrentPos = []
  let enemyDirection = 1
  let enemyMovedDown = false


  // ? Enemy Class 
  class Enemy {
    constructor(id, currentPos) {
      this.id = id
      this.currentPos = currentPos
      this.isHit = false
      this.atEdge
      this.cssClass = 'enemy'
    }
    handleHit() {
      this.isHit = true
      cells[this.currentPos].classList.remove(this.cssClass)
      console.log(`enemy ${this.id} is hit`)
    }
    getId() {
      return this.id
    }
    getLocation() {
      return this.currentPos
    }
    getHitStatus() {
      return this.isHit
    }
    isAtEdge() {
      if (!this.isHit) {
        if (this.currentPos % gridWidth === gridWidth - 1) {
          return true
        } else if (this.currentPos % gridWidth === 0) {
          return true
        } else {
          return false
        } 
      } else {
        return false
      }
    }
    moveRight() {

      this.currentPos = this.currentPos + 1
    }
    moveLeft() {
      this.currentPos = this.currentPos - 1
    }
    addClass () {
      cells[this.currentPos].classList.add(this.cssClass)
    }
  }

  // function to handle enemy movement
  function updateEnemyPosition() {
    enemyArray.forEach(enemy => {
      cells[enemy.currentPos].classList.remove('enemy')
    })
    const atEdge = enemyArray.some(enemy => enemy.isAtEdge())
    console.log(atEdge)

    enemyArray.forEach(enemy => {
      //if (cells[enemy.currentPos].classList.contains('enemy')) {
      if (atEdge && !enemyMovedDown) {
        // reverse enemy direction by using 1 and - 1
        enemy.currentPos = enemy.currentPos + gridWidth

        //console.log(enemyDirection)
        console.log('moving down')
      } else if (enemyDirection === 1) {
        enemy.currentPos = enemy.currentPos + 1
        console.log('moving right')

      } else if (enemyDirection === -1) {
        enemy.currentPos = enemy.currentPos - 1
        console.log('moving left')

      } 
    })
    if (atEdge && !enemyMovedDown) {
      enemyMovedDown = true
      enemyDirection = enemyDirection * -1
      console.log('moved down true')
    } else if (atEdge && enemyMovedDown) {
      enemyMovedDown = false
      console.log('moved down false')
    }
    enemyArray.forEach(enemy => {
      if (enemy.isHit !== true) {
        cells[enemy.currentPos].classList.add('enemy')
      }
    })
  }



  // Current position 


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
    spawnPlayer(160)

  }
  // ? TIMERS
  function mainGameTimer() {
    if (!gameTimer) {
      gameTimer = setInterval(() => {
        //console.log(enemyArray)
        //checkBoundary()
        updateEnemyPosition()
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
  // Handle projectile movement 
  function updateProjectilePos() {
    projectileTimer = setInterval(() => {
      // remove previous projectile
      cells[projectileCurrentPos].classList.remove('projectile')

      // If projectile is  not at top of grid and cell doesn't contain an enemy or another projectile, move projectile forward away from player 
      if (projectileCurrentPos >= gridHeight && cells[projectileCurrentPos].classList.contains('enemy') !== true && cells[projectileCurrentPos].classList.contains('projectile') !== true) {
        projectileNextPos = projectileCurrentPos - gridWidth
        cells[projectileNextPos].classList.add('projectile')
        projectileCurrentPos = projectileNextPos

        // If projectile is  not at top of grid and cell contains an enemy or another projectile, move projectile forward away from player 
      } else if (projectileCurrentPos >= gridHeight && cells[projectileCurrentPos].classList.contains('enemy') === true) {
        //get id of enemy object that is in cell id of projectile current pos 
        const enemyHitLocation = parseInt(cells[projectileCurrentPos].id)
        const enemyId = enemyArray.findIndex(enemy => enemy.currentPos === enemyHitLocation)
        enemyArray[enemyId].handleHit()

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

  // ! SPAWN FUNCTIONS
  //Player
  function spawnPlayer(position) {
    playerCurrentPos = position
    cells[playerCurrentPos].classList.add('player')
  }

  // Enemy
  function spawnEnemies() {
    //dynamically create array here
    for (let i = 1; i < 10; i++){
      enemyCurrentPos.push(i)
    }
    // for (let i = 15; i < 24; i++){
    //   enemyCurrentPos.push(i)
    // }
    // for (let i = 29; i < 38; i++){
    //   enemyCurrentPos.push(i)
    // }
    // for (let i = 43; i < 52; i++){
    //   enemyCurrentPos.push(i)
    // }
    enemyCurrentPos.forEach((cell, index) => {
      const enemy = new Enemy(index, cell)
      enemyArray.push(enemy)
      enemy.addClass()
      console.log(`enemy added at cell ${cell}`)
    })
  }
  // Projectiles
  function spawnProjectile(position) {
    if (projectileOnGrid === false) {
      projectileCurrentPos = position - gridWidth
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

