class Player {
    constructor() {
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
        
        this.newBulletTimer = 0;
        this.superShotTimer = 1;
        this.superCounter = 200;
        this.shootCounter = 18;

        this.inCollision = false;
        this.inCollisionWithEnemy = false;
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

    move() {
        let canMoveLeft = true;
        let canMoveRight = true;
        //If is in the end of the level, then game over
        if(level.speedAcumulator >= 8500 && currentGame.hasEnded === false) {
            currentGame.hasEnded = true;
        }
        //normal collision
        for(let i = 0; i < level.enemies.length; i++) {
            this.collisionCheck(level.enemies[i]);

            if(this.inCollision) {
                if(this.inCollisionWithEnemy) {
                    this.inCollisionWithEnemy = false;
                    this.receiveDmg(1);
                    if(this.x > 100) {
                        this.x -= 100;
                    }
                    break;
                }

                //this.inCollision = false;
                // if(this.collidingTop) {
                //     if (this.jumping) {
                //         this.jumping = false;
                //         this.melee = false;
                //         this.shoot = false;
                //         this.idle();
                //     }
                //     this.yVelocity = 0;
                // }

                // else {
                //     this.onPlatform = false;
                //     if(this.y < level.groundY) {
                //         this.idle();
                //     }
                // }

                // if(this.collidingRight || this.collidingLeft) {
                //     if(this.sliding) {
                //         this.sliding = false;
                //         this.canSlide = false;
                //         this.xVelocity = 0;
                //         this.dashSpeed = 0;
                //     }
                // }

                // if(this.collidingRight && this.xVelocity > 0) {
                //     this.xVelocity = 0;
                // }

                // if(this.collidingLeft && this.xVelocity < 0) {
                //     this.xVelocity = 0;
                // }
            }
        }

        //platform collision
        for (let i = 0; i < level.platforms.length; i++) {
            this.collisionCheck(level.platforms[i]);
            if(this.inCollision) {
                if(this.collidingTop) {
                    if (this.jumping) {
                        this.jumpHeight = 0;
                        this.jumping = false;
                        this.melee = false;
                        this.shooting = false;
                        this.idle();
                    }

                    if(this.y >= level.groundY && this.collidingLeft === false && this.collidingRight === false) {
                        if(this.lookingRight) {
                            this.dashSpeed += 304;
                        } else {
                            this.dashSpeed -= 304;
                        }

                        this.collidingRight = false;
                        this.collidingLeft = false;

                        if(this.sliding === false) {
                            this.sliding = true;
                        }
                    } else {
                        this.dashSpeed = 0;
                        this.sliding = false;
                    }
                    this.yVelocity = 0;
                }

                if(this.collidingBottom) {
                    this.onPlatform = true;
                    this.collidingLeft = false;
                    this.collidingRight = false;
                    this.collidingTop = false;
                } else {
                    this.onPlatform = false;
                    if(this.y < level.groundY && this.onGround === false && this.jumping === false) {
                        this.idle();
                    }
                }

                if(this.collidingRight || this.collidingLeft && this.collidingTop === false && this.onPlatform === false) {
                    if(this.sliding) {
                        this.sliding = false;
                        this.canSlide = false;
                        this.xVelocity = 0;
                        this.dashSpeed = 0;
                        this.idle();
                    }
                }

                if(this.collidingRight && this.xVelocity > 0) {
                    this.xVelocity = 0;
                }

                if(this.collidingLeft && this.xVelocity < 0) {
                    this.xVelocity = 0;
                }
           } else {
                this.onPlatform = false;
           }
        }

        //attacking collision
        if(this.melee && this.canMeleeDamage) {
            let takeHit = false;
            for (let i = 0; i < level.enemies.length; i++) {
                if (this.lookingRight) {
                    if(this.right() + this.meleeRange >= level.enemies[i].left() && level.enemies[i].left() > this.right()) {
                        takeHit = true;
                        this.canMeleeDamage = false;
                        level.enemies[i].x += 100;
                    }
                } else {
                    if(this.left() + this.meleeRange <= level.enemies[i].right() && level.enemies[i].right() < this.left()) {
                        takeHit = true;
                        this.canMeleeDamage = false;
                        level.enemies[i].x -= 100;
                    }
                }
                if(takeHit) {
                    level.enemies[i].receiveDmg(this.meleeDamage);
                    level.enemies[i].updateEnemy();
                    if(level.enemies[i].health <= 0) {
                        level.enemies.splice(i, 1);
                     }
                }
            }
        }

        //super shot
        if(this.superShotTimer % this.superCounter === 0) {
            this.superShot = true;
        }

        //when shooting
        if(this.shooting) {
            this.superShotTimer = 1;
            this.updateSuperShot();
            if(this.superShot === true) {
                superShotSound.play();
                this.bullets.push(new Bullet(true)); //true stands for super bullet
                this.superShot = false;
            }

            if(this.newBulletTimer % this.shootCounter === 0) {
                shootSound.play();
                this.bullets.push(new Bullet());
                this.newBulletTimer = 0;
            }
            this.newBulletTimer++;
        } else {
            shootSound.stop();
            this.newBulletTimer = 9;
            if(this.superShotTimer < this.superCounter) {
                this.superShotTimer++;
            }
        }

        //updating and removing out of sight bullets
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].updateBullet();

            if(this.bullets[i].x > canvas.width || this.bullets[i] < 0 || this.bullets[i].hitEnemy()) {
                this.bullets.splice(i, 1);
            }
        }

        //if is falling - the char is not on the ground (groundY)
        if(this.y < level.groundY && this.onPlatform === false) {
            this.onGround = false;
            if(this.jumping === false) {
                this.idle();
            }
        } else {
            this.onGround = true;
        }

        //keep falling if in the air
        if (!this.onGround) {   
          gravitySpeed += gravity;
            this.y += gravitySpeed;
        } else {
            gravitySpeed = 0;
        }

        if(this.jumping && this.jumpHeight > 0) {
            //this.y -= 16;
            this.y -= 14;
            this.jumpHeight -= 14;
            this.onPlatform = false;
        } else if(this.jumping && this.jumpHeight <= 0) {
            this.idle();
            this.jumping = false;
            this.melee = false;
            //this.animating = false;
        }

        //just for test - should verify if the player can move
        if(this.xVelocity > 0 && this.x >= this.maxRight) {
            level.speed += this.xVelocity; //level.speed = positive
            this.xVelocity = 0;
        }

        if(this.xVelocity < 0 && this.x <= this.maxRight) {
            if(level.x < 0) {
                level.speed += this.xVelocity; //level.speed = negative
                this.xVelocity = 0;
            }
        }

        if(this.x <= 0) {
            canMoveLeft = false;
            if(this.xVelocity < 0) {
                this.xVelocity = 0;
            }
        }

        if(this.x >= this.maxRight) {
            canMoveRight = false;
            if(this.xVelocity > 0) {
                this.xVelocity = 0;
            }
        }

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        //dash movement - moves the char or the screen depending on the char position inside the canvas
        if(this.sliding && this.onGround) {
            //this.shooting = false;
            if(this.dashSpeed > 0) {
                if(canMoveRight) {
                    this.x += 8;
                    this.dashSpeed -= 8;
                } 
                if(! canMoveRight) {
                    level.speed += 8;
                    this.dashSpeed -= 8;
                }
            } else if(this.dashSpeed < 0) {
                if(canMoveLeft && level.x >= 0) {
                    this.x -= 8;
                    this.dashSpeed += 8;
                }     
                if(canMoveLeft && this.dashSpeed < 0 && this.x <= this.maxRight) {
                    level.speed -= 8;
                    this.dashSpeed -= 8;
                }
            } else if(this.dashSpeed === 0) {
                //this.idle();
                this.sliding = false;
            } else {
                this.sliding = false;
                this.dashSpeed = 0;
            }
        }
        
        this.xVelocity = 0;
        this.yVelocity = 0;

        if(this.y < level.groundY && this.onGround === true) {
            gravitySpeed = 0;
        }
        
        this.inCollision = false;
        this.collidingRight = false;
        this.collidingLeft = false;
        this.collidingTop = false;
        this.collidingBottom = false;
}

    left() { return this.x + 45; }
    right() { return this.x + this.width - 45; }
    top() { return this.y + 10; }
    bottom() { return this.y + this.height - 8; }

    collisionCheck(obstacle) { //attack range used when in battle
        let right = this.right();
        let left = this.left();
        let top = this.top();

        if(this.sliding) { 
            top = this.top() + 40;
            right -= 15;
            left += 15;
        }

        let colliding = ! (this.bottom() < obstacle.top() ||
        top > obstacle.bottom() ||
        right < obstacle.left() ||
        left > obstacle.right());

        if(colliding) {
            this.inCollision = true;
            if(obstacle.isEnemy === true) {
                this.inCollisionWithEnemy = true;
            } else {
                this.inCollisionWithEnemy = false;
            }
            //check type of collision - top, left, right
            
            this.collidingBottom = this.bottom() - 20 < obstacle.y && this.top() < obstacle.top() && right + 20 > obstacle.left() && left - 20 < obstacle.right();
            //if(!this.collidingBottom) {
            this.collidingLeft = this.lookingRight === false && left <= obstacle.right() && right > obstacle.right() && (!(this.bottom() <= obstacle.top() && top >= obstacle.bottom()));
            this.collidingRight = this.lookingRight && right >= obstacle.left() && left < obstacle.left() && (!(this.bottom() <= obstacle.top() && top >= obstacle.bottom()));
            //this.collidingTop = top <= obstacle.bottom() && this.bottom() > obstacle.bottom() && right + 10 > obstacle.left() && left < obstacle.right();
            this.collidingTop = top <= obstacle.bottom() && this.bottom() > obstacle.bottom() + 40 && right - 15 > obstacle.left() && left + 15 < obstacle.right(); //r -20 / l 25
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
        if(this.health > 0 && damageValue <= this.health) {
            this.health -= damageValue;
        } else if(currentGame.hasEnded === false) {
            this.health = 0;
            currentGame.hasEnded = true;
        }
    }

    die() {
        this.animating = true;
        this.dieAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
        this.animating = true;
    }

    run() {
        if(this.shooting) {
            this.runShootAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
        } else {
            this.runAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
        }

        this.animating = true;
    }

    jump() {
        let jumpType = this.jumpAnimation;

        if(this.melee) { //if start attack after jump but reach the ground, stop the attack
            jumpType = this.jumpMeleeAnimation;
        }

        if(this.shooting) {
            jumpType = this.jumpShootAnimation;
        }

        if(this.jumping) {
            this.animating = true;  //doesn't reset the animation if is still jumping
            if(jumpType.currentFrame < jumpType.totalFrames) {
                this.animating = true;
            //     this.jumping = false; //finish jumping
            //     this.melee = false;
            //     this.animating = false;
            //}
            // if(this.y >= 500 || this.onGround) {
            //     //this.jumping = false;
            //     //this.animating = false;
                //  this.melee = false;
                //  this.shooting = false;
             } else {
                 this.animating = false;
             }
        }
        jumpType.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
    }

    dash() {
        if(this.sliding && this.onGround) { //doesn't dash if in the air
            this.animating = true;  //doesn't reset the animation if is still sliding
            if(this.slideAnimation.currentFrame === this.slideAnimation.totalFrames) {
                this.animating = false;
                this.sliding = false;
            }
        } else {
            this.animating = false;
            this.sliding = false;
        }

        this.slideAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
    }

    turn() {
        this.lookingRight = ! this.lookingRight;
    }

    shoot() {
        this.shootAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height, 2);
        this.animating = true;
    }

    meleeAtk() {
        if(this.melee) {
            this.animating = true;  //doesn't reset the animation if is still attacking
            if(this.meleeAnimation.currentFrame === this.meleeAnimation.totalFrames) {
                this.melee = false; //finish attacking
                this.animating = false;
            }
        }
        if(! this.jumping) {
            this.meleeAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
        }
    }

    idle() {
        this.animating = true;
        this.idleAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
        this.animating = false;
    }

    updateSuperShot() {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'gold';

        if(this.superCounter === 100) {
            ctx.fillRect(50, 100, this.superShotTimer * 2, 50);
            ctx.fillStyle = 'green';
            ctx.fillText(`FASTER SHOT`, 80, 132);
        } else {
            ctx.fillRect(50, 100, this.superShotTimer, 50);
            ctx.fillStyle = 'red';
            ctx.fillText(`SUPER SHOT`, 80, 132);
        }
        ctx.strokeRect(50, 100, 200, 50);
    }
}