class Player {
    constructor() {
        this.x = 650;
        this.y = 1;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.width = 160;
        this.height = 150;

        this.health = 5;
        this.meleeRange = 50;

        this.imgSource = './images/player/idle_10_567-556.png';
        this.jumping = false;
        this.onGround = true;
        this.onPlatform = false;
        this.animating = false;
        this.melee = false;
        this.sliding = false;
        this.shooting = false;
        this.lookingRight = true;

        this.canSlide = true;
        this.canMelee = true;
        this.canMeleeDamage = true;

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

    move() {
        let canMoveLeft = true;
        let canMoveRight = true;
        
        //If is in the end of the level, then game over
        if(this.x >= 8500) {
            currentGame.hasEnded = true;
        }

        //normal collision
        for(let i = 0; i < level.enemies.length; i++) {
            this.collisionCheck(level.enemies[i]);

            if(this.inCollision) {
                if(this.inCollisionWithEnemy) {
                    this.inCollisionWithEnemy = false;
                    this.receiveDmg();
                    this.x -= 100;
                    break;
                }

                //this.inCollision = false;
                if(this.collidingTop) {
                    if (this.jumping) {
                        this.jumping = false;
                        this.melee = false;
                        this.shoot = false;
                        this.idle();
                    }
                    this.yVelocity = 0;
                }

                if(this.collidingBottom) {
                    this.onPlatform = true;
                } 
                // else {
                //     this.onPlatform = false;
                //     if(this.y < level.groundY) {
                //         this.idle();
                //     }
                // }

                if(this.collidingRight || this.collidingLeft) {
                    if(this.sliding) {
                        this.sliding = false;
                        this.canSlide = false;
                        this.xVelocity = 0;
                        this.dashSpeed = 0;
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
                    if(this.right() + this.meleeRange >= level.enemies[i].left()) {
                        takeHit = true;
                        this.canMeleeDamage = false;
                        level.enemies[i].x += 120;
                    }
                } else {
                    if(level.enemies[i].right() >= this.left()) {
                        takeHit = true;
                        this.canMeleeDamage = false;
                        level.enemies[i].x -= 120;
                    }
                }
                if(takeHit) {
                    level.enemies[i].receiveDmg();
                    level.enemies[i].updateEnemy();
                    if(level.enemies[i].health <= 0) {
                        level.enemies.splice(i, 1);
                     }
                }
            }
        }


        if(this.y < level.groundY && this.onPlatform === false) {
            this.onGround = false;
        } else {
            this.onGround = true;
        }

        if (! (this.onGround)) {
            gravitySpeed += gravity;
            this.y += Number(gravitySpeed.toFixed(2));
        } else {
            gravitySpeed = 0;
        }

        if(this.jumping && this.jumpHeight > 0) {
            //this.y -= 16;
            this.y -= 12;
            this.jumpHeight -= 12;
        } else if(this.jumping && this.jumpHeight <= 0 && this.melee === false) {
            this.idle();
            this.jumping = false;
            this.melee = false;
            this.animating = false;
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

        if(this.sliding) {
            if(this.dashSpeed > 0) {
                if(canMoveRight) {
                    this.x += 5;
                    this.dashSpeed -= 5;
                } 
                if(! canMoveRight) {
                    level.speed += 5;
                    this.dashSpeed -= 5;
                }
            } else if(this.dashSpeed < 0) {
                if(canMoveLeft && level.x >= 0) {
                    this.x -= 5;
                    this.dashSpeed += 5;
                }     
                if(canMoveLeft && this.dashSpeed < 0 && this.x <= this.maxRight) {
                    level.speed -= 5;
                    this.dashSpeed -= 5;
                }
            } else if(this.dashSpeed === 0) {
                this.idle();
                this.sliding = false;
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

    left() { return this.x + 50; }
    right() { return this.x + this.width - 50; }
    top() { return this.y + 10; }
    bottom() { return this.y + this.height - 10; }

    collisionCheck(obstacle, attackRange) { //attack range used when in battle
        let right = this.right();
        let left = this.left();
        if (this.lookingRight && attackRange > 0) {
            right += attackRange;
        } else if(attackRange > 0){
            left += attackRange;
        }

        let colliding = ! (this.bottom() < obstacle.top() ||
        this.top() > obstacle.bottom() ||
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
            
            this.collidingBottom = this.bottom() > obstacle.top() && (right > obstacle.left() && left < obstacle.right());
            
            if(!this.collidingBottom) {
            this.collidingLeft = left <= obstacle.right() && right > obstacle.right() && (!(this.bottom() <= obstacle.top() && this.top() >= obstacle.bottom()));
            this.collidingRight = right >= obstacle.left() && left < obstacle.left() && (!(this.bottom() <= obstacle.top() && this.top() >= obstacle.bottom()));
            this.collidingTop = this.top() <= obstacle.bottom() && this.bottom() < obstacle.top() && right > obstacle.left() && left < obstacle.right();
            }
            //this.collidingBottom = xMiddle >= obstacle.top() && xMiddle >= obstacle.top() && xMiddle <= obstacle.top() + obstacle.width;
            //this.collidingBottom = obstacle.top() <= x || obstacle.y > x && obstacle.top() + obstacle.width < x;
            //this.collidingBottom = this.top() > obstacleBottom && this.left() < obstacle.right() && this.left() > obstacle.left() && this.top()  < obstacle.top();
            //this.collidingBottom = charCenterY > obstacleBottom && charCenterX > obstacle.x && charCenterX < obstacle.x + obstacle.width && charCenterY < obstacle.y;
        } else {
            this.onPlatform = false;
        }
        return colliding;
    }

    receiveDmg() {
        if(this.health > 0) {
            this.health--;
        } else {
            currentGame.hasEnded = true;
        }
    }

    die() {
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
            //if(jumpType.currentFrame === jumpType.totalFrames) {
            //     this.jumping = false; //finish jumping
            //     this.melee = false;
            //     this.animating = false;
            //}
            if(this.y >= 500 || this.onGround) {
                //this.jumping = false;
                //this.animating = false;
                this.melee = false;
                this.shooting = false;
                console.log('entrou');
            }
        }
        jumpType.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height);
    }

    dash() {
        if(this.sliding) {
            this.animating = true;  //doesn't reset the animation if is still sliding
            if(this.slideAnimation.currentFrame === this.slideAnimation.totalFrames) {
                this.animating = false;
                this.sliding = false;
            }
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
}