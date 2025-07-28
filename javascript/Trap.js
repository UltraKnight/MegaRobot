class Trap {
  constructor(source, x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.animation = new ObjAnimation(3, source, 356, 361);
    this.damageValue = 3;
    this.canDamage = true;
    this.speed = 100;
    this.maxY = y + this.speed;
    this.minY = y - this.speed;
    this.movingUp = false;
  }

  left() {
    return this.x + 15;
  }
  right() {
    return this.x + this.width - 15;
  }
  top() {
    return this.y + 10;
  }
  bottom() {
    return this.y + this.height - 10;
  }

  draw(deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    this.x = this.x - level.speed;
    // Switch direction if limits are reached
    if (this.y >= this.maxY) {
      this.movingUp = true;
    } else if (this.y <= this.minY) {
      this.movingUp = false;
    }

    // Apply movement
    if (this.movingUp) {
      this.y -= this.speed * deltaSeconds;
    } else {
      this.y += this.speed * deltaSeconds;
    }

    this.animation.animate(true, deltaTime, false, this.x, this.y, this.width, this.height, 3); //cols
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
      boomSound.play();
      currentGame.player.receiveDmg(this.damageValue);
      currentGame.player.x -= 200;
      if (currentGame.player.health < 0) {
        currentGame.hasEnded = true;
      }
      return colliding; //if colliding the bullet will be removed in the player move()
    }
  }
}
