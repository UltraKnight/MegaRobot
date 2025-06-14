class Boss {
  constructor(type) {
    let enemyType = type;

    this.x = 1800; // its correct, its the level x axis that must be changed
    this.y = 200;
    this.health = 60;
    this.width = 400;
    this.height = 460;
    //this.walkAnimation = new ObjAnimation(12, `./images/enemies/Robot0${enemyType}/walk/walk1_478_629.png`, 877, 1187);
    this.walkAnimation = new ObjAnimation(12, `./images/enemies/Robot0${enemyType}/walk1_478_629.png`, 478, 629);
    this.attack1Animation = new ObjAnimation(8, `./images/enemies/Robot0${enemyType}/attack1_478_411.png`, 478, 411);
    this.deathAnimation = new ObjAnimation(15, `./images/enemies/Robot0${enemyType}/death1_320_237.png`, 320, 237);
    this.attacking = false;
    this.lookingRight = false; // enemies walk to left
    this.currentAnimation = 'walking'; //used in animation changing - not implemented yet
    this.animations = ['walking', 'attack1']; //used to change animation when its time - not implemented yet
    this.isEnemy = true;
    this.animating = false; //start animation from the beginning if it is set to false
    this.speed = 200;
    this.hasDied = false; //used to his death cry
    this.bombDamage = enemyType > 1 ? 2 : 1;
    
    this.changeActionCooldown = 800; // ms
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

        let randomX = Math.floor(Math.random() * (151 - 100) + 100); // 100 to 150
        let randomDistance = Math.floor(Math.random() * (201 - 50) + 50); //value between 50 and 200

        if (this.lookingRight) {
          level.bombs.push(
            new Bomb(this.x - randomDistance, this.y + this.height / 2 + randomX, 700, true, this.bombDamage),
          );
          level.bombs.push(new Bomb(this.x, this.y + this.height / 2 + randomX, 700, true, this.bombDamage));
          level.bombs.push(
            new Bomb(this.x + randomDistance, this.y + this.height / 2 + randomX, 700, true, this.bombDamage),
          );
        } else {
          level.bombs.push(
            new Bomb(this.x - randomDistance, this.y + this.height / 2 + randomX, -700, false, this.bombDamage),
          );
          level.bombs.push(new Bomb(this.x, this.y + this.height / 2 + randomX, -700, false, this.bombDamage));
          level.bombs.push(
            new Bomb(this.x + randomDistance, this.y + this.height / 2 + randomX, -700, false, this.bombDamage),
          );
        }

        this.currentAnimation = 'walking';
      }
    } else if (this.currentAnimation === 'dying') {
      if (this.deathAnimation.currentFrame === this.deathAnimation.totalFrames) {
        this.animating = false;
      } else {
        this.deathAnimation.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height, 4);
        if (this.hasDied === false) {
          this.hasDied = true;
          //play sound here
          bossDeathSound.play();
        }
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
      this.animating = false;
    }

    if (this.currentAnimation === 'walking') {
      this.x -= (this.speed * deltaSeconds) + level.speed;
    } else if (this.currentAnimation === 'attack1') {
      this.x -= level.speed;
    } else {
      this.x -= level.speed;
    }
  }

  updateEnemy(deltaTime) {
    this.move(deltaTime);
    this.draw(deltaTime);
  }
}
