class Player {
  constructor() {
    this.godMode = false;

    this.x = 100;
    this.y = 500;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.width = 160;
    this.height = 150;

    this.health = 5;
    this.meleeRange = 50;
    this.meleeDamage = 2;
    this.bullets = [];
    this.superShot = false;
    this.hasBlueShot = false;

    this.imgSource = './images/player/idle_10_567-556.png';
    this.jumping = false;
    this.onGround = true;
    this.onPlatform = false;
    this.animating = false;
    this.melee = false;
    this.sliding = false;
    this.shooting = false;
    this.lookingRight = true;
    this.increaseFall = 0;

    this.canSlide = true;
    this.canMelee = true;
    this.canMeleeDamage = true;

    this.inCollision = false;
    this.inCollisionWithEnemy = false;
    this.inCollisionWithPlatform = false;
    this.collidingTop = false;
    this.collidingLeft = false;
    this.collidingRight = false;
    this.collidingBottom = false;

    this.jumpHeight = 0;
    this.dashSpeed = 0;
    this.maxRight = canvas.width / 2 - 200;

    this.dieAnimation = new ObjAnimation(10, './images/player/die_10_562-519.png', 562, 519);
    this.idleAnimation = new ObjAnimation(10, './images/player/idle_10_567-556.png');
    this.jumpAnimation = new ObjAnimation(10, './images/player/jump_10_567-556.png');
    this.jumpMeleeAnimation = new ObjAnimation(8, './images/player/jumpmelee_8_567-556.png');
    this.jumpShootAnimation = new ObjAnimation(5, './images/player/jumpshoot_5_567-556.png');
    this.meleeAnimation = new ObjAnimation(8, './images/player/melee_8_567-556.png');
    this.runAnimation = new ObjAnimation(8, './images/player/run_8_567-556.png');
    this.runShootAnimation = new ObjAnimation(9, './images/player/runshoot_9_567-556.png');
    this.shootAnimation = new ObjAnimation(4, './images/player/shoot_4_567-556.png');
    this.slideAnimation = new ObjAnimation(8, './images/player/slide_10_567-556.png');

    this.shootCooldown = 300; // ms
    this.superShotCooldown = 2000; // 2s
    this.shootTimer = 0;
    this.superShotTimer = 0;
  }

  //for collision test purpose
  drawLines(item) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(item.left(), item.top());
    ctx.lineTo(item.right(), item.top());
    ctx.lineTo(item.right(), item.bottom());
    ctx.lineTo(item.left(), item.bottom());
    ctx.lineTo(item.left(), item.top());
    ctx.stroke();
  }

  move(deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    // do it here, so first shot has no delay
    this.shootTimer += deltaTime;

    let canMoveLeft = true;
    let canMoveRight = true;
    //If is in the end of the level, then game over
    if (level.speedAcumulator >= 8500 && currentGame.hasEnded === false) {
      currentGame.hasEnded = true;
    }
    //normal collision
    for (const enemy of level.enemies) {
      this.collisionCheck(enemy);

      if (this.inCollision && this.inCollisionWithEnemy) {
        this.inCollisionWithEnemy = false;
        //avoid collision with dead enemies (enemies die with 0 life, player dies with less than 0)
        if (enemy.health > 0) {
          this.receiveDmg(1);
          if (this.x > 100 && enemy.lookingRight) {
            enemy.x -= 200; // teleport the enemy to avoid multiple collisions and instant death
          } else if (this.x > 100 && enemy.lookingRight === false) {
            enemy.x -= 200; // teleport the enemy to avoid multiple collisions and instant death
          }
        }
      }
    }

    //platform collision
    for (const platform of level.platforms) {
      this.collisionCheck(platform);
      if (this.inCollision && this.inCollisionWithPlatform) {
        if (this.collidingTop) {
          if (this.jumping) {
            this.jumpHeight = 0;
            this.jumping = false;
            this.melee = false;
            this.shooting = false;
            this.idle();
          }

          if (this.y >= level.groundY && !this.collidingLeft && !this.collidingRight) {
            this.collidingRight = false;
            this.collidingLeft = false;

            if (this.sliding === false) {
              this.sliding = true;
            }
          } else {
            this.dashSpeed = 0;
            this.sliding = false;
          }
          this.yVelocity = 0;
        }

        if (this.collidingBottom) {
          this.onPlatform = true;
          this.collidingLeft = false;
          this.collidingRight = false;
          this.collidingTop = false;
        } else {
          this.onPlatform = false;
          if (this.y < level.groundY && this.onGround === false && this.jumping === false) {
            this.idle();
          }
        }

        if ((this.collidingRight || this.collidingLeft) && !this.collidingTop && !this.onPlatform) {
          if (this.sliding) {
            this.sliding = false;
            this.canSlide = false;
            this.xVelocity = 0;
            this.dashSpeed = 0;
            this.idle();
          }
        }

        if (this.collidingRight && this.xVelocity > 0) {
          this.xVelocity = 0;
        }

        if (this.collidingLeft && this.xVelocity < 0) {
          this.xVelocity = 0;
        }
      } else {
        this.onPlatform = false;
      }
    }

    //attacking collision
    if (this.melee && this.canMeleeDamage) {
      let takeHit = false;
      for (let i = 0; i < level.enemies.length; i++) {
        if (this.lookingRight) {
          if (this.right() + this.meleeRange >= level.enemies[i].left() && level.enemies[i].left() > this.right()) {
            takeHit = true;
            this.canMeleeDamage = false;
            level.enemies[i].x += 100;
          }
        } else if (
          this.left() + this.meleeRange <= level.enemies[i].right() &&
          level.enemies[i].right() < this.left()
        ) {
          takeHit = true;
          this.canMeleeDamage = false;
          level.enemies[i].x -= 100 * deltaSeconds;
        }

        if (takeHit) {
          level.enemies[i].receiveDmg(this.meleeDamage);
          //level.enemies[i].updateEnemy();
          //if their dead or out of the spawn area they'll be removed
          if (level.enemies[i].health <= 0) {
            level.enemies[i].currentAnimation = 'dying';
            //must be removed after a while because the animation of dying has to execute
            level.enemiesToRemove.push(level.enemies[i]);
            level.enemies.splice(i, 1); //the array receives this enemy position to remove later
          }
        }
      }
    }

    //super shot
    if (this.superShotTimer >= this.superShotCooldown) {
      this.superShot = true;
    }

    // when shooting
    if (this.shooting) {
      if (this.shootTimer >= this.shootCooldown) {
        this.shootTimer = 0;
        this.superShotTimer = 0;
        this.updateSuperShot(deltaTime); // reset super shot when shooting
        if (this.superShot) {
          superShotSound.play();
          this.bullets.push(new Bullet(true, this.hasBlueShot)); //true stands for super bullet
          this.superShot = false;
          // dont shoot normal bullets if super shot is ready
        } else {
          shootSound.play();
          this.bullets.push(new Bullet(false, this.hasBlueShot));
        }
      }
    } else {
      this.updateSuperShot(deltaTime);
      shootSound.stop();
    }

    //updating and removing out of sight bullets
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].updateBullet(deltaTime);
      for (let j = 0; j < level.enemies.length; j++) {
        let goToNext = false;
        //if(this.bullets[i].hitEnemy(level.enemies[j])) { //return true if enemy is alive
        if (this.bullets[i]) {
          if (this.bullets[i].x > canvas.width || this.bullets[i].x < 15) {
            this.bullets.splice(i, 1);
            break;
          }

          let colliding = false;
          colliding = !(
            this.bullets[i].bottom() < level.enemies[j].top() ||
            this.bullets[i].top() > level.enemies[j].bottom() ||
            this.bullets[i].right() < level.enemies[j].left() ||
            this.bullets[i].left() > level.enemies[j].right()
          );

          if (colliding) {
            if (level.enemies[j].health > 0 && level.enemies[j].health > this.bullets[i].damageValue) {
              level.enemies[j].receiveDmg(this.bullets[i].damageValue);
              this.bullets.splice(i, 1);
            } else {
              level.enemies[j].currentAnimation = 'dying';
              level.enemiesToRemove.push(level.enemies[j]);
              level.enemies.splice(j, 1);
            }
          }
          // }
          if (goToNext) break;
        }
      }
    }

    //if is falling - the char is not on the ground (groundY)
    if (this.y < level.groundY && !this.onPlatform) {
      this.onGround = false;
      if (!this.jumping) {
        this.idle();
      }
    } else {
      if (this.y > 500) this.y = 500; // Clamp to ground level
      this.onGround = true;
    }

    //keep falling if in the air
    if (!this.onGround) {
      gravitySpeed += gravity * deltaSeconds * 2.0;
      // limit the gravitySpeed to terminalVelocity
      gravitySpeed = Math.min(gravitySpeed, terminalVelocity);
      this.yVelocity += gravitySpeed;
    }

    if (this.jumping && this.jumpHeight > 0) {
      // jumpHeight is set in the loop (index.js)
      //this.y -= 16;
      const jumpForce = 450;
      this.yVelocity -= (jumpForce + gravitySpeed) * deltaSeconds * 136;
      // jumpHeight has no influence on the player
      // it is used to know when it reaches the max jump height
      this.jumpHeight -= (360 + gravitySpeed) * deltaSeconds;
      this.onPlatform = false;
    } else if (this.jumping && this.jumpHeight <= 0) {
      this.idle();
      this.jumping = false;
      this.melee = false;
      //this.animating = false;
    }

    //just for test - should verify if the player can move
    if (this.xVelocity > 0 && this.x >= this.maxRight) {
      level.speed += this.xVelocity * deltaSeconds; //level.speed = positive
      this.xVelocity = 0;
    }

    if (this.xVelocity < 0 && this.x <= this.maxRight) {
      if (level.x < 0) {
        level.speed += this.xVelocity * deltaSeconds; //level.speed = negative
        this.xVelocity = 0;
      }
    }

    if (this.x <= 0) {
      canMoveLeft = false;
      if (this.xVelocity < 0) {
        this.xVelocity = 0;
      }
    }

    if (this.x >= this.maxRight) {
      canMoveRight = false;
      if (this.xVelocity > 0) {
        this.xVelocity = 0;
      }
    }

    this.x += this.xVelocity * deltaSeconds;
    this.y += this.yVelocity * deltaSeconds;

    //dash movement - moves the char or the screen depending on the char position inside the canvas
    if (this.sliding && this.onGround) {
      //this.shooting = false;
      if (dashSound.sound.paused) {
        dashSound.play();
      }

      if (this.dashSpeed > 0) {
        if (canMoveRight) {
          this.x += 800 * deltaSeconds;
          this.dashSpeed -= 300 * deltaSeconds;
        }
        if (!canMoveRight) {
          level.speed += 800 * deltaSeconds;
          this.dashSpeed -= 300 * deltaSeconds;
        }
      } else if (this.dashSpeed < 0) {
        if (canMoveLeft && level.x >= 0) {
          this.x -= 800 * deltaSeconds;
          this.dashSpeed += 300 * deltaSeconds;
        }
        if (canMoveLeft && this.dashSpeed < 0 && this.x <= this.maxRight) {
          level.speed -= 800 * deltaSeconds;
          this.dashSpeed += 300 * deltaSeconds;
        }
        // keep sliding if colliding top
      } else if (this.dashSpeed === 0 && !this.collidingTop) {
        //this.idle();
        this.sliding = false;
        this.animating = false;
      } else if (!this.collidingTop) {
        this.sliding = false;
        this.dashSpeed = 0;
        this.animating = false;
      }
    }

    this.xVelocity = 0;
    this.yVelocity = 0;

    if (this.y < level.groundY && this.onGround === true) {
      gravitySpeed = 0;
    }

    this.inCollision = false;
    this.collidingRight = false;
    this.collidingLeft = false;
    this.collidingTop = false;
    this.collidingBottom = false;
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
    return this.y + this.height - 8;
  }

  collisionCheck(obstacle) {
    let right = this.right();
    let left = this.left();
    let top = this.top();

    if (this.sliding) {
      top = this.top() + 40;
      right -= 15;
      left += 15;
    }

    let colliding = !(
      this.bottom() < obstacle.top() ||
      top > obstacle.bottom() ||
      right < obstacle.left() ||
      left - 5 > obstacle.right()
    );

    if (colliding) {
      this.inCollision = true;
      if (obstacle.isEnemy === true) {
        this.inCollisionWithEnemy = true;
        this.inCollisionWithPlatform = false;
      } else {
        this.inCollisionWithEnemy = false;
        this.inCollisionWithPlatform = true;
      }
      //check type of collision - top, left, right

      this.collidingBottom =
        this.bottom() - 25 < obstacle.y &&
        this.top() < obstacle.top() &&
        right + 20 > obstacle.left() &&
        left - 20 < obstacle.right();
      //if(!this.collidingBottom) {
      this.collidingLeft =
        this.lookingRight === false &&
        left - 5 <= obstacle.right() &&
        right > obstacle.right() &&
        !(this.bottom() <= obstacle.top() && top >= obstacle.bottom());
      this.collidingRight =
        this.lookingRight &&
        right >= obstacle.left() &&
        left < obstacle.left() &&
        !(this.bottom() <= obstacle.top() && top >= obstacle.bottom());
      //this.collidingTop = top <= obstacle.bottom() && this.bottom() > obstacle.bottom() && right + 10 > obstacle.left() && left < obstacle.right();
      this.collidingTop =
        top + 5 <= obstacle.bottom() &&
        this.bottom() > obstacle.bottom() + 40 &&
        right - 10 > obstacle.left() &&
        left + 10 < obstacle.right(); //r -20 / l 25
      //}
      //this.collidingBottom = xMiddle >= obstacle.top() && xMiddle >= obstacle.top() && xMiddle <= obstacle.top() + obstacle.width;
      //this.collidingBottom = obstacle.top() <= x || obstacle.y > x && obstacle.top() + obstacle.width < x;
      //this.collidingBottom = this.top() > obstacleBottom && this.left() < obstacle.right() && this.left() > obstacle.left() && this.top()  < obstacle.top();
      //this.collidingBottom = charCenterY > obstacleBottom && charCenterX > obstacle.x && charCenterX < obstacle.x + obstacle.width && charCenterY < obstacle.y;
    } else {
      this.onPlatform = false;
    }
    return colliding;
  }

  receiveDmg(damageValue) {
    if (this.godMode) return;

    if (this.health > 0 && damageValue <= this.health) {
      this.health -= damageValue;
    } else if (currentGame.hasEnded === false) {
      this.health = -1;
      currentGame.hasEnded = true;
    }
  }

  die(deltaTime) {
    this.animating = true;
    this.dieAnimation.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height);
    this.animating = true;
  }

  run(deltaTime) {
    if (this.shooting) {
      this.runShootAnimation.animate(
        this.animating,
        deltaTime,
        this.lookingRight,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    } else {
      this.runAnimation.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height);
    }

    this.animating = true;
  }

  jump(deltaTime) {
    let jumpType = this.jumpAnimation;

    if (this.melee) {
      //if start attack after jump but reach the ground, stop the attack
      jumpType = this.jumpMeleeAnimation;
    }

    if (this.shooting) {
      jumpType = this.jumpShootAnimation;
    }

    if (this.jumping) {
      this.animating = true; //doesn't reset the animation if is still jumping
      if (jumpType.currentFrame < jumpType.totalFrames) {
        this.animating = true;
      } else {
        this.animating = false;
      }
    }
    jumpType.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height);
  }

  dash(deltaTime) {
    if (this.sliding && this.onGround) {
      //doesn't dash if in the air
      this.animating = true; //doesn't reset the animation if is still sliding
      if (this.slideAnimation.currentFrame === this.slideAnimation.totalFrames) {
        this.animating = false;
        this.sliding = false;
      }
    } else {
      this.animating = false;
      this.sliding = false;
    }

    this.slideAnimation.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height);
  }

  turn() {
    this.lookingRight = !this.lookingRight;
  }

  shoot(deltaTime) {
    this.shootAnimation.animate(
      this.animating,
      deltaTime,
      this.lookingRight,
      this.x,
      this.y,
      this.width,
      this.height,
      2,
    );
    this.animating = true;
  }

  meleeAtk(deltaTime) {
    if (this.melee) {
      this.animating = true; //doesn't reset the animation if is still attacking
      if (this.meleeAnimation.currentFrame === this.meleeAnimation.totalFrames) {
        this.melee = false; //finish attacking
        this.animating = false;
      }
    }
    if (!this.jumping) {
      this.meleeAnimation.animate(
        this.animating,
        deltaTime,
        this.lookingRight,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }
  }

  idle(deltaTime) {
    this.animating = true;
    this.idleAnimation.animate(this.animating, deltaTime, this.lookingRight, this.x, this.y, this.width, this.height);
    this.animating = false;
  }

  //always draw a static image of the main char in situations where the image sources will change
  drawStatic() {
    let image = new Image();
    image.src = `./images/player/static.png`;
    let x = this.x;
    let y = this.y;
    let w = this.width;
    let h = this.height;
    ctx.drawImage(image, x, y, w, h);
  }

  updateSuperShot(deltaTime) {
    this.superShotTimer += deltaTime;

    // TODO: improve this - faster superShot is hardcoded and defined as 1000ms
    const hasPowerUp = this.superShotCooldown === 1000;
    let fillRatio = Math.min(this.superShotTimer / this.superShotCooldown, 1);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'gold';

    if (hasPowerUp) {
      ctx.fillRect(50, 100, 200 * fillRatio, 50); // fill it in half of the defaultTime (2000ms)
      ctx.fillStyle = 'green';
      ctx.fillText(`FASTER SHOT`, 80, 132);
    } else {
      ctx.fillRect(50, 100, 200 * fillRatio, 50);
      ctx.fillStyle = 'red';
      ctx.fillText(`SUPER SHOT`, 80, 132);
    }
    ctx.strokeRect(50, 100, 200, 50);
  }
}
