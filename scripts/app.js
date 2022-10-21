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
  //lives span
  const livesSpan = document.querySelector('#lives-span')

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

  // ? player variables
  // Starting position
  let playerCurrentPos
  let lives = 3
  let totalScore = 0


  class Player {
    constructor(lives, startingPos) {
      this.lives = 3
      this.currentPos = startingPos
    }
  }

  // ? Enemy variables 
  // Starting position
  const enemyArray = []
  const enemyCurrentPos = []
  let enemyDirection = 1
  let enemyMovedDown = false



  // ? Enemy Class 
  class Enemy {
    constructor(id, startingPos) {
      this.id = id
      this.currentPos = startingPos
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
    addClass() {
      cells[this.currentPos].classList.add(this.cssClass)
    }
    canShoot() {
      if (!cells[this.currentPos + gridWidth].classList.contains('enemy')) {
        return true
      } else {
        return false
      }
    }
  }

  function handleAlienShot() {
    //pick random alien with no alien in front of it
    //spawn projectile in front of alien
    //move projectile forward until it hits bottom of grid or player 
    enemyArray.forEach(enemy => {
      if (enemy.canShoot()) {
        spawnProjectile('enemy', enemy.currentPos)
      }
    })
  }


  // function to handle enemy movement
  function updateEnemyPosition() {
    enemyArray.forEach(enemy => {
      cells[enemy.currentPos].classList.remove('enemy')
    })
    const atEdge = enemyArray.some(enemy => enemy.isAtEdge())
    //console.log(atEdge)

    enemyArray.forEach(enemy => {
      if (atEdge && !enemyMovedDown) {
        // reverse enemy direction by using 1 and - 1
        enemy.currentPos = enemy.currentPos + gridWidth
        //console.log('moving down')
      } else if (enemyDirection === 1) {
        enemy.currentPos = enemy.currentPos + 1
        //console.log('moving right')

      } else if (enemyDirection === -1) {
        enemy.currentPos = enemy.currentPos - 1
        //console.log('moving left')

      }
    })
    // this creates crazy movement bug 
    if (atEdge && !enemyMovedDown) {
      enemyMovedDown = true
      enemyDirection = enemyDirection * -1
      //console.log('moved down true')
    } else if (atEdge && enemyMovedDown) {
      enemyMovedDown = false
      //console.log('moved down false')
    }
    enemyArray.forEach(enemy => {
      if (enemy.isHit !== true) {
        cells[enemy.currentPos].classList.add('enemy')
      }
    })
  }

  // ? Projectile variables
  let projectileCurrentPos
  let projectileNextPos
  //let projectileOnGrid = false
  let enemyProjectile
  let playerProjectile
  let playerProjectileOnGrid

  class Projectile {
    constructor(origin, currentPos) {
      this.origin = origin
      this.currentPos = currentPos
      this.isOnGrid = false
      this.addProjectileClass()
    }
    addProjectileClass() {
      if (this.origin === 'enemy') {
        cells[this.currentPos].classList.add('enemyProjectile')
      } else {
        cells[this.currentPos].classList.add('playerProjectile')
      }
    }
    removeProjectileClass() {
      if (this.origin === 'enemy') {
        cells[this.currentPos].classList.remove('enemyProjectile')
      } else {
        cells[this.currentPos].classList.remove('playerProjectile')
      }
    }

  }

  // ! FUNCTIONS
  // ? Create game grid 
  function createGameGrid() {
    for (let i = 0; i < cellCount; i++) {
      // Create element dynamically using createElement
      const cell = document.createElement('div')
      // Display index of grid element
      //cell.innerHTML = i
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
        updateEnemyPosition()
        //handleAlienShot()
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
      console.log(playerProjectile.isOnGrid)
      playerProjectile.removeProjectileClass()
      if (playerProjectile.currentPos >= gridWidth && cells[playerProjectile.currentPos].classList.contains('enemy') !== true) {
        playerProjectile.currentPos = playerProjectile.currentPos - gridWidth
        playerProjectile.addProjectileClass()
      } else if (cells[playerProjectile.currentPos].classList.contains('enemy')) {
        //refactor, this is insane
        const enemyHitLocation = parseInt(cells[playerProjectile.currentPos].id)
        const enemyId = enemyArray.findIndex(enemy => enemy.currentPos === enemyHitLocation)
        enemyArray[enemyId].handleHit()
        playerProjectile.isOnGrid = false
        playerProjectile.removeProjectileClass()
        clearInterval(projectileTimer)
      } else {
        playerProjectile.removeProjectileClass()
        playerProjectile.isOnGrid = false
        clearInterval(projectileTimer)
      }
      // } else if (enemyProjectile.isOnGrid) {
      //   enemyProjectile.removeProjectileClass()
      // }
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
      spawnProjectile('player', playerCurrentPos)
    }
    cells[playerCurrentPos].classList.add('player')
  }

  // ! SPAWN FUNCTIONS
  //Player
  function spawnPlayer(position) {
    const player = new Player(position)
    playerCurrentPos = position
    cells[playerCurrentPos].classList.add('player')
  }

  // Enemy
  function spawnEnemies() {
    //dynamically create array here
    for (let i = 1; i < 10; i++) {
      enemyCurrentPos.push(i)
    }
    for (let i = 15; i < 24; i++) {
      enemyCurrentPos.push(i)
    }
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
    })
  }
  // Projectiles
  function spawnProjectile(origin, position) {
    if (origin === 'enemy' && !enemyProjectile) {
      console.log('enemy fired')
      enemyProjectile = new Projectile(origin, position + gridWidth)
      enemyProjectile.addProjectileClass()
      enemyProjectile.isOnGrid = true
    } else if (origin === 'player') {
      console.log(`player fired at ${position}`)
      playerProjectile = new Projectile(origin, position - gridWidth)
      playerProjectile.addProjectileClass()
      playerProjectile.isOnGrid = true
    } 
    updateProjectilePos()
  }

  // if (projectileOnGrid === false) {
  //   projectileCurrentPos = position - gridWidth
  //   cells[projectileCurrentPos].classList.add('projectile')
  //   updateProjectilePos()
  //   projectileOnGrid = true
  // }


  // ? End game screen s

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

