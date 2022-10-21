// TODO
//favicon

function init() {
  // ! ELEMENTS
  // start button
  const startButton = document.querySelector('#start-button')
  // reset
  const resetButton = document.querySelector('#reset-button')
  // grid
  const grid = document.querySelector('.grid')
  //lives span
  const lives = document.querySelectorAll('.life')
  // score span
  const score = document.querySelector('#score-span')
  //grid cells
  const cells = []
  // modal 
  const modal = document.querySelector('#endgame-modal')
  const modalClose = document.querySelector('.close')
  const modalScore = document.querySelector('#modal-score')


  // ! VARIABLES 
  // score
  // lives
  // ? Game variables
  let gameTimer
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
  let totalScore = 0

  // ? Projectile variables
  let enemyProjectile
  let playerProjectile
  let playerProjectileCount = 0


  class Player {
    constructor(startingPos) {
      this.lives = 3
      this.currentPos = startingPos
    }
    handleHit() {
      this.lives = this.lives - 1
      if (this.lives > 0) {
        lives[this.lives].classList.remove('life')
      } else {
        lives[0].classList.remove('life')
        endGame()
      }
    }
  }

  // ? Enemy variables 
  // Starting position
  const enemyArray = []
  const enemyCurrentPos = []
  let enemyDirection = 1
  let enemyMovedDown = false
  let totalEnemy


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
      if (!cells[this.currentPos + gridWidth].classList.contains('enemy') && this.isHit === false) {
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
      if (enemiesThatCanShoot, enemy.canShoot()) {
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
      if (enemy.currentPos > gridWidth * (gridHeight - 1)) {
        endGame()
      }
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
        if (this.currentPos < 0) {
          clearInterval(this.timer)
          this.removeProjectileCssClass()
          return
        }
        this.removeProjectileCssClass()
        if (this.currentPos < cellCount - gridWidth) {
          this.currentPos = this.currentPos + this.direction
          this.addProjectileCssClass()
          if (cells[this.currentPos].classList.contains(this.enemy)) {
            if (this.enemy === 'enemy') {
              updatePlayerScore()
              enemyArray.forEach(enemy => {
                if (enemy.currentPos === this.currentPos) {
                  enemy.handleHit()
                  if (playerProjectileCount > 0) {
                    playerProjectileCount--
                  }
                  
                }
              })
            } else {
              player.handleHit()
            }
            this.removeProjectileCssClass()
            clearInterval(this.timer)
          }
        } else {
          this.removeProjectileCssClass()
          clearInterval(this.timer)
          if (playerProjectileCount > 0) {
            playerProjectileCount--
          }
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

  // ? Start game function 
  function startGame() {
    console.log('game started')
    //create game grid should be here
    createGameGrid()
    //spawn enemies at starting position
    spawnEnemies()
    //spawn player at starting position
    spawnPlayer(160)
    startEnemyShotTimer()
  }

  function endGame() {
    clearInterval(gameTimer)
    clearInterval(enemyShotTimer)
    modalScore.innerText = `${totalScore}`
    modal.style.display = 'block'
  }

  function closeModal() {
    modal.style.display = 'none'
  }

  function updatePlayerScore() {
    totalScore += 100
    score.innerText = `${totalScore}`
  }

  function enemyRemaining() {
    let enemyOnGrid = totalEnemy
    enemyArray.forEach((enemy) => {
      if (enemy.isHit) {
        enemyOnGrid--
      }
    })
    if (enemyOnGrid === 0) {
      endGame()
    }
  }

  // ? TIMERS
  function mainGameTimer() {
    if (!gameTimer) {
      gameTimer = setInterval(() => {
        updateEnemyPosition()
        enemyRemaining()
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

  function startEnemyShotTimer() {
    enemyShotTimer = setInterval(() => {
      handleEnemyShot()
    }, 3000)
  }


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
    for (let i = 29; i < 38; i++) {
      enemyCurrentPos.push(i)
    }
    for (let i = 43; i < 52; i++) {
      enemyCurrentPos.push(i)
    }
    enemyCurrentPos.forEach((cell, index) => {
      const enemy = new Enemy(index, cell)
      enemyArray.push(enemy)
      enemy.addClass()
      totalEnemy = enemyArray.length
    })
  }
  // Projectiles
  function spawnProjectile(origin, position) {
    if (origin === 'enemy') {
      enemyProjectile = new Projectile(origin, position + gridWidth, 'player', gridWidth)
    } else if (playerProjectileCount < 1){
      playerProjectile = new Projectile(origin, position - gridWidth, 'enemy', -gridWidth)
      playerProjectileCount++
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
  // Modal
  modalClose.addEventListener('click', closeModal)


}

window.addEventListener('DOMContentLoaded', init)

