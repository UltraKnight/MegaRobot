class Bomb {
  constructor(x, y, speed, rightOrLeft, damageValue) {
    this.x = x;
    this.speed = speed;
    this.y = y;

    //this.animation = new ObjAnimation(5, `./images/player/bullet/bullet.png`, 170, 139);
    this.animation = new ObjAnimation(2, `./images/enemies/bomb/bomb_250_326.png`, 250, 326);
    this.exploding = new ObjAnimation(8, `./images/enemies/bomb/exploding_298_298.png`, 298, 298);
    this.width = 50;
    this.height = 50;
    this.damageValue = damageValue;
    this.goUp = 100;
    this.rightOrLeft = rightOrLeft; //based on the enemy that is lauching it
    this.canDamage = true;
  }

  left() {
    return this.x + 5;
  }
  right() {
    return this.x + this.width - 5;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height - 5;
  }

  draw(deltaTime) {
    if (this.goUp === 10) {
      // === to play the sound just once
      boomSound.play();
    }
    if (this.goUp <= 1) {
      this.exploding.animate(true, deltaTime, this.rightOrLeft, this.x, this.y, this.width, this.height, 3);
    } else {
      this.animation.animate(true, deltaTime, this.rightOrLeft, this.x, this.y, this.width, this.height, 1); //cols ??
    }
  }

  move(deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    this.x += (this.speed * deltaSeconds) - level.speed;
    // if(this.goUp > 60) {
    //     this.y -= 4;
    // } else if(this.goUp > 40) {
    //     this.y -= 2;
    // } else {
    //     this.y += 3;
    // }
    if (this.goUp > 50) {
      this.y -= 200 * deltaSeconds;
    } else if (this.goUp > 40) {
      this.y -= 150 * deltaSeconds;
    } else {
      this.y += 180 * deltaSeconds;
    }

    if (this.goUp > 0) {
      this.goUp = Math.max(this.goUp - deltaTime / 16.67, 0);
    }
  }

  hitPlayer() {
    let colliding = false;
    colliding = !(
      this.bottom() < currentGame.player.top() ||
      this.top() > currentGame.player.bottom() ||
      this.right() < currentGame.player.left() ||
      this.left() > currentGame.player.right()
    );

    if (colliding) {
      if (this.canDamage) {
        currentGame.player.receiveDmg(this.damageValue);
        boomSound.play();
        this.canDamage = false;
      }
      if (currentGame.player.health < 0) {
        currentGame.hasEnded = true;
      }
      return colliding; // if colliding the bullet will be removed in the player move()
    }
  }

  updateBomb(deltaTime) {
    this.move(deltaTime);
    this.draw(deltaTime);
  }
}
