
# Space Invaders

This was the first project of the course and was developed using vanilla JavaScript. The task was to create a basic browser game using a grid rather than HTML canvas. I decided to create a version of the classic arcade game Space Invaders!  

![This is an image](https://res.cloudinary.com/dhjguxvm1/image/upload/v1673618280/Readme_Pics/Project1/space-invaders_swaw26.gif)
## Deployment

https://nickquirk.github.io/space-invaders/


Code can be accessed here: https://github.com/nickquirk/space-invaders


## Timeframe & Working Team
This was a solo project. We were given a week to complete the assignment. 
## Technologies Used

* JavaScript
* HTML 5
* CSS 3
* VSCode


## Brief
Build a basic browser game using JavaScript, HTML and CSS. 
* The player should be able to clear at least one wave of aliens
* The player's score should be displayed at the end of the game

## Planning
At the start of the project, I created some wireframes to give me an idea of the basic layout of the UI and the elements that I would be targeting in the DOM. This gave me something to work towards when creating the structural elements of the HTML and CSS. 

### Interface Wireframe

![This is an image](https://res.cloudinary.com/dhjguxvm1/image/upload/v1673618378/Readme_Pics/Project1/image2_sy6tht.png)

### Gamespace

![This is an image](https://res.cloudinary.com/dhjguxvm1/image/upload/v1673618378/Readme_Pics/Project1/image4_d6un5x.png)

### Notes
I created the main project plan using Bear Notes, making use of the checkbox list items to track my progress moving through the main project milestones. 

![This is an image](https://res.cloudinary.com/dhjguxvm1/image/upload/v1673618378/Readme_Pics/Project1/image5_dpfzvp.png)

### Minimum Viable Product
The very minimum that would be acceptable given the deliverables.
* Aliens which descend at constant speed 
* Player can move left or right and shoot
* Aliens can be destroyed 
* Aliens can shoot
* Player able to clear one wave of aliens
* Score displayed at end of game 

### Stretch Goals
Once I had the MVP mapped out, I defined some stretch goals that I would complete if there was time after the base game was created. These features would enhance the basic functionality and add to the overall aesthetic. 

**Goal 1 - Functional:**
The first goal will be to add the destructible ‘buildings’, that protect the player in the original game, as a selectable game option. 

**Goal 2 - Functional:**
The goal of this stretch will be to increase the speed of the aliens once they hit either side of the game space. There will also be a selectable ’speed’ game option


**Goal 3 - Aesthetic:**
The first goal will be to add the destructible ‘buildings’, that protect the player in the original game, as a selectable game option. 

**Goal 1 - Functional:**
Once the extra functional game elements are in place extra visual elements will be added.  These are non-essential but will improve the player experience and make the game more fun to play.

**Visual**
- Overall game theme
- Interface objects are themed
- Different Alien models - different points for each

**Audio**
- Sound FX  on interface item
- More audio events  - poss random variation 
- Menu music

### Main Game Functions
To help with the main structure of the project, I attempted to define the main functions of the game in the planning phases. I tried to break down the major functionality into code functions and thought about the methods I would use to build these functions. Would they be objects or classes? Would they need to be called once or at intervals? I tried to answer these types of questions here. 

![This is an image](https://res.cloudinary.com/dhjguxvm1/image/upload/v1673618378/Readme_Pics/Project1/image1_wjnfzc.png)

### Project Diary
To help me keep track of how the project was progressing I kept a daily development diary. The night before every project day I would make a checklist of the most important tasks to complete the following day. I found this really useful to keep me on track and helped me to plan my time. One thing that really helped was to identify the biggest most difficult task and tackle that first thing in the morning when I was fresh. 

This worked well for me and if I accomplished it, had a big positive effect on my day. If I couldn’t solve it, it meant I had to try a different approach or break the problem down into smaller chunks. 

![project diary](https://res.cloudinary.com/dhjguxvm1/image/upload/v1673618378/Readme_Pics/Project1/image3_a1senm.png)

## Build/Code Process
Because of the short time span of the project, I decided to try and build as much functionality as I could as quickly as possible and then, when I had a working prototype, work on the visual styling and User Interface features. This would give me maximum time for testing, fixing bugs and re-thinking key aspects of the project if necessary. I’ve detailed the main functions of my project below. 

**Start Game**

This is called when the player clicks the Start Game button. It creates the game grid, spawns the player and enemies in their starting positions and starts the enemy shot timer which shoots a projectile from a random enemy every 3000ms. 

**Game Grid**

This was called in the StartGame function and was dynamically created when the player clicks the start button. By creating the grid dynamically using a for loop it meant that changing the size or layout of the grid would be quick and straightforward without having to manually change multiple values. Each cell was given a zero indexed id value which could be referenced in order to create game functions. 

```
 // ? Create game grid

 function createGameGrid() {
   for (let i = 0; i < cellCount; i++) {

     // Create element dynamically using createElement
     const cell = document.createElement('div')

     // Display index of grid element

     // Add the index as a data-id
     cell.id = i

     // Append the new cell to the grid
     grid.appendChild(cell)

     //push cell into array
     cells.push(cell)
   }
 }
```
**Main Game Timer**

From studying the original game I decided that a ‘tick’ function that triggered the main game events periodically would be a good approach. This function would trigger enemy movement and call the enemy remaining function which returns the number of enemy objects remaining on the grid. 

**Player and Enemy Classes**

I decided to use classes to define the player and enemy characters within the game. It made sense to me that these should be discrete objects with internal properties that could be easily tracked and updated. The enemy formation ended up being an array of enemy objects that was manipulated to create movement and allow enemies to be taken off the grid. 

```
 
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
     console.log(`enemy ${this.id} is hit`

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
```

**Enemy movement**

This was updated on the game ‘tick’ (every 1000ms) and moved the enemy based on the following logic. The actual movement was implemented by adding and removing a CSS class that set the background image of the cell that the enemy occupied. 

* If enemy in furthest right location is not at the right edge of the grid and the direction is right, move enemy right

* If enemy in furthest right location is at the right edge of the grid and  directions right,  move enemy down a row and change direction to left

* If  enemy in furthest left location is not at the far left of the grid and the direction is, move enemy left

* Otherwise move enemies down a row and change direction to right. 

To restrain the enemy characters to the grid area and to stop them wrapping around each side I implemented various control logic to dictate the movement and also created an atEdge() function within the enemy class to give an awareness of when the enemies should move down and change direction. 

```
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
```

**Enemy shooting**

This was handled within the handleEnemyShot() function and was called every 3000ms from the enemy shot timer. This would pick a random enemy from the available enemies that could shoot (did not have an enemy in front of them) and then spawn a projectile in front of them. 

```
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
```

**Player movement**

Player movement was handled within a function called handlePlayerMovement(). This was called by an eventListener listening for ‘keydown’ events on the keyboard. Player movement is pretty limited in Space Invaders so I only needed to use the left and right keys and the spacebar to shoot. 

Within this function I also included some control logic, similar to the enemy movement function, to stop the player character from being able to move out of the grid area. 

```
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
```

**Projectiles and hits**
In the end, I made projectiles a class with an internal timer and functions that managed the collisions with player and enemy characters. When a projectile is spawned the spawnProjectile() function creates a new instance of the projectile class parsing in the origin and position and incrementing the playerProjectileCount if the origin was the player. I included this function so that the player can’t shoot too many projectiles at once, which would make the game too easy. 

The moveProjectle() function then starts a timer every 100ms which updates the position of the projectile on the game grid and removes it once it hits the target or the edge of the grid and decrements the playerProjectileCount. The player and enemy handleHit() functions remove the enemy from the grid (by removing the CSS class from the current position) and decrements the player.lives variable. The global points variable is also incremented by 100 whenever an enemy is removed. 

```
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
```
**End Game and Score Modal**

When a game ending condition is reached (all enemies are removed, player has run out of lives or aliens have reached the bottom of the grid) the endGame() function is called. This stops all the timers and displays a modal element with the player's final score. I decided that a modal was the neatest option here rather than creating an entire new page just to display the score. 


## Challenges

The main challenges of the project were:

* Enemy movement
* Collision detection 
* Moving enemies as one block 


Enemy movement represented the biggest challenge of the project and was the main game element so it was important to get right. I started by manipulating an array of numbers that represented the grid positions of the enemies. In these positions a CSS class with a background image was added to the cell at that position. I managed to get the movement implemented using this method but I felt like the control logic was convoluted and over-complicated. I also had problems trying to remove the aliens and keep the overall structure of the formation as in the original game. 

In the end I decided to completely rethink my approach and decided that enemies needed to be objects with discrete values that could be tracked and changed during the course of the game. It was a big challenge to rewrite my code and alter my approach halfway through a project but I’m really glad that I did. I achieved the desired functionality and also my code is cleaner and easier to read. 

Once the aliens were an array of objects rather than numbers the problems of collision detection and moving the enemies as a block were also relatively straightforward to solve. 


## Wins

I feel that my biggest wins were: 

* Visual styling
* Implementation of enemy movement 
* Enemy firing implementation 

**Visual styling**

It was important to me that the game not only played well but looked good. I put a lot of effort into finding game assets and then editing them using photoshop to create a consistent aesthetic. In the end I think I achieved this and I’m pleased with the outcome. 

**Enemy Movement**

I’ve already outlined that the enemy movement was one of the biggest challenges of the project and actually prompted me to rethink my entire approach to the project. Although this was a big risk half way into the project, I think the payoff was worth it resulting in a neater solution and much cleaner and easier to understand code. It also made solving problems in several other areas of the project much easier too. 

**Enemy Firing Implementation**

 I feel like my solution to handling enemy firing was quite neat and worked well. From the overall number of enemies present on the grid the number of enemies with a free shot is calculated (if there is no enemy in front of them). From this selection, every three seconds a random enemy is selected and a projectile is spawned in front of them. 


## Key Learnings/Takeaways
* Improved my understanding of Classes and Objects
* Had lots of practice refactoring code to make it cleaner and easier to understand
* Realised the importance of solving main problems properly in the planning phase rather than rewriting code half way through the project

## Bugs
* Occasionally enemy movement will wrap around the grid and will then not be aligned for the rest of the game 
* Sometimes player projectiles are not removed when they are shot off the grid resulting in the player exceeding the number of valid projectiles on the grid and not being able to shoot

## Future Improvements 

* Fix known bugs 
* Clean up code and move more functions within game classes 
* Add audio 
* Add destructible buildings
* Increase speed of aliens as they descend and add faster 
* Optimise for mobile 
