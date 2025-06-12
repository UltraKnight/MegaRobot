class Bullet {
  constructor(superBullet = false, blueShot = false) {
    if (currentGame.player.lookingRight) {
      this.x = currentGame.player.right();
      this.speed = 1500;
      this.goRight = true;
    } else {
      this.x = currentGame.player.left();
      this.speed = -1500;
      this.goRight = false;
    }

    this.y = currentGame.player.y + currentGame.player.height / 2;

    this.animation = blueShot
      ? new ObjAnimation(5, `./images/player/bullet/blue-shot.png`, 170, 139)
      : new ObjAnimation(5, `./images/player/bullet/bullet.png`, 170, 139);
    if (superBullet) {
      this.width = 80;
      this.height = 60;
      this.damageValue = 3;
      this.y -= 15;
    } else {
      this.width = 30;
      this.height = 20;
      this.damageValue = blueShot ? 2 : 1;
    }
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  draw(deltaTime) {
    this.animation.animate(true, deltaTime, this.goRight, this.x, this.y, this.width, this.height, 5);
  }

  move(deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    this.x += (this.speed * deltaSeconds) - levelLastSpeed;
  }

  updateBullet(deltaTime) {
    //bullet stands for its position in the player array
    this.move(deltaTime);
    this.draw(deltaTime);
    //this.hitEnemy();
  }
}
