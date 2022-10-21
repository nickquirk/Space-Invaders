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
  // let playerProjectileTimer
  // let enemyProjectileTimer
  let enemyShotTimer


  // ? Grid variables
  // width of grid
  const gridWidth = 14
  const gridHeight = 12
  const cellCount = gridWidth * gridHeight

  // ? player variables
  // Starting position
  let player
  let playerCurrentPos
  let lives = 3
  let totalScore = 0


  class Player {
    constructor(lives, startingPos) {
      this.lives = 3
      this.currentPos = startingPos
    }
    handleHit() {
      console.log('player hit')
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
      if (!cells[this.currentPos + gridWidth].classList.contains('enemy') && this.isHit === false ) {
        return true
      } else {
        return false
      }
    }
  }

  function handleEnemyShot() {
    //pick random alien with no alien in front of it
    //spawn projectile in front of alien
    //move projectile forward until it hits bottom of grid or player 
    const enemiesThatCanShoot = []
    enemyArray.forEach(enemy => {
      if (enemiesThatCanShoot,enemy.canShoot()) {
        enemiesThatCanShoot.push(enemy.currentPos)
      }
    })
    const randomEnemy = enemiesThatCanShoot[Math.floor(Math.random() * enemiesThatCanShoot.length)]
    spawnProjectile('enemy', randomEnemy)
  }
  // function to handle enemy movement
  function updateEnemyPosition() {
    enemyArray.forEach(enemy => {
      cells[enemy.currentPos].classList.remove('enemy')
    })
    const atEdge = enemyArray.some(enemy => enemy.isAtEdge())
    enemyArray.forEach(enemy => {
      if (atEdge && !enemyMovedDown) {
        enemy.currentPos = enemy.currentPos + gridWidth
      } else if (enemyDirection === 1) {
        enemy.currentPos = enemy.currentPos + 1
      } else if (enemyDirection === -1) {
        enemy.currentPos = enemy.currentPos - 1
      }
    })
    // this creates crazy movement bug 
    if (atEdge && !enemyMovedDown) {
      enemyMovedDown = true
      enemyDirection = enemyDirection * -1
    } else if (atEdge && enemyMovedDown) {
      enemyMovedDown = false
    }
    enemyArray.forEach(enemy => {
      if (enemy.isHit !== true) {
        cells[enemy.currentPos].classList.add('enemy')
      }
    })
  }

  // ? Projectile variables
  let enemyProjectile
  let playerProjectile

  class Projectile {
    constructor(origin, currentPos, enemy, direction) {
      this.origin = origin
      this.enemy = enemy
      this.currentPos = currentPos
      this.direction = direction
      this.addProjectileCssClass()
      this.moveProjectile()
    }
    addProjectileCssClass() {
      cells[this.currentPos].classList.add(`${this.origin}-projectile`)
    }
    removeProjectileCssClass() {
      cells[this.currentPos].classList.remove('enemy-projectile', 'player-projectile')
    }
    moveProjectile() {
      this.timer = setInterval(() => {
        // remove previous projectile
        this.removeProjectileCssClass()
        if (this.currentPos >= gridWidth) {
          this.currentPos = this.currentPos + this.direction
          this.addProjectileCssClass()
          if (cells[this.currentPos].classList.contains(this.enemy)) {
            enemyArray.forEach(enemy => {
              if (enemy.currentPos === this.currentPos) {
                enemy.handleHit()
              }
            })
            this.removeProjectileCssClass()
            clearInterval(this.timer)
          }
        } else {
          this.removeProjectileCssClass()
          clearInterval(this.timer)
        }
      }, 100)
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
  //move to startGame()
  createGameGrid()

  // ? Start game function 
  function startGame() {
    console.log('game started')
    //create game grid should be here
    //spawn enemies at starting position
    spawnEnemies()
    //spawn player at starting position
    spawnPlayer(160)
    startEnemyShotTimer()
  }

  // ? TIMERS
  function mainGameTimer() {
    if (!gameTimer) {
      gameTimer = setInterval(() => {
        updateEnemyPosition()
      }, 1000)
      startGame()
    }
  }
  // ? Reset game function 
  function reset() {
    clearInterval(gameTimer)
    clearInterval(enemyShotTimer)
    window.location.reload()
  }

  function startEnemyShotTimer(){
    enemyShotTimer = setInterval(() => {
      handleEnemyShot()
    }, 3000)
  }


  //Alien shooting timer - every 3 seconds 
  //handleEnemyShot()


  // ! MOVEMENT

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
    player = new Player(position)
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
    if (origin === 'enemy') {
      console.log('enemy fired')
      enemyProjectile = new Projectile(origin, position + gridWidth, 'player', gridWidth)
    } else {
      console.log(`player fired at ${position}`)
      playerProjectile = new Projectile(origin, position - gridWidth, 'enemy', -gridWidth)
    }
  }

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

