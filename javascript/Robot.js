//death is managed in player move()
class Robot {
  constructor() {
    let enemyType = Math.floor(Math.random() * (4 - 1) + 1); // random from 1 to 3
    let possiblePosition = [-100, canvas.width + 1000]; // enemies either spawn at the most left or most right of the stage
    let definitivePositionIndex = 0;

    definitivePositionIndex = Math.floor(Math.random() * possiblePosition.length); //0 or 1
    this.x = possiblePosition[definitivePositionIndex];

    if (this.x > 0) {
      this.lookingRight = false; // enemies walk to left
      this.speed = -(200 + enemyType);
      this.health = enemyType + 2;
    } else {
      this.lookingRight = true; // enemies walk to right
      this.speed = 200 + enemyType;
      this.health = enemyType + 2;
    }

    //this.x = canvas.width; // for testing
    this.y = level.groundY;
    this.width = 180;
    this.height = 190;
    //this.walkAnimation = new ObjAnimation(12, `./images/enemies/Robot0${enemyType}/walk/walk1_478_629.png`, 877, 1187);
    this.walkAnimation = new ObjAnimation(12, `./images/enemies/Robot0${enemyType}/walk1_478_629.png`, 478, 629);
    this.attack1Animation = new ObjAnimation(8, `./images/enemies/Robot0${enemyType}/attack1_478_411.png`, 478, 411);
    this.deathAnimation = new ObjAnimation(15, `./images/enemies/Robot0${enemyType}/death1_320_237.png`, 320, 237);
    this.attacking = false;
    this.currentAnimation = 'walking'; //used in animation changing - not implemented yet
    this.animations = ['walking', 'attack1']; //used to change animation when its time - not implemented yet
    this.isEnemy = true;
    this.animating = false; //start animation from the beginning if it is set to false
    this.bombDamage = enemyType > 1 ? 2 : 1; //bomb damage based on enemy type

    this.changeActionCooldown = 1000; // ms
    this.changeActionTimer = 0;
  }

  left() {
    return this.x + 50;
  }
  right() {
    return this.x + this.width - 50;
  }
  top() {
    return this.y + 10;
  }
  bottom() {
    return this.y + this.height - 10;
  }

  receiveDmg(damageValue) {
    if (this.health > 0) {
      this.health -= damageValue;
    }
  }

  draw(deltaTime) {
    if (this.currentAnimation === 'walking') {
      this.walkAnimation.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height, 4);

      this.animating = true; //will be false when the animation changes - not implemented
    } else if (this.currentAnimation === 'attack1') {
      this.attack1Animation.animate(
        this.animating,
        deltaTime,
        this.lookingRight,
        this.x,
        this.y - 30,
        this.width + 50,
        this.height + 50,
        4,
      );

      this.animating = true;
      //generate the bomb at the right moment of the animation
      if (this.attack1Animation.currentFrame === this.attack1Animation.totalFrames - 3) {
        this.animating = true;

        if (this.lookingRight) {
          level.bombs.push(new Bomb(this.x, this.y + this.height / 2, 900, true, this.bombDamage));
        } else {
          level.bombs.push(new Bomb(this.x, this.y + this.height / 2, -900, false, this.bombDamage));
        }

        this.currentAnimation = 'walking';
        this.changeAnimationAfter = 1;
      }
      this.changeAnimationAfter = 1;
    } else if (this.currentAnimation === 'dying') {
      if (this.deathAnimation.currentFrame === this.deathAnimation.totalFrames) {
        this.animating = false;
      } else {
        this.deathAnimation.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height, 4);
        this.animating = true;
      }
    }
  }

  move(deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    this.changeActionTimer += deltaTime;

    if (this.changeActionTimer >= this.changeActionCooldown && this.currentAnimation !== 'dying') {
      this.changeActionTimer = 0;
      this.currentAnimation = this.animations[Math.floor(Math.random() * this.animations.length)];
      this.changeAnimationAfter = 0;
      this.animating = false;
    }

    if (this.currentAnimation === 'walking') {
      this.x += (this.speed * deltaSeconds) - level.speed;
    } else if (this.currentAnimation === 'attack1') {
      this.x -= level.speed
    } else {
      this.x -= level.speed;
    }
  }

  updateEnemy(deltaTime) {
    this.move(deltaTime);
    this.draw(deltaTime);
  }
}
