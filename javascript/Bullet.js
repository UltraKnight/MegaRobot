class Bullet {
    constructor(superBullet = false, blueShot = false) {
        if(currentGame.player.lookingRight) {
            this.x = currentGame.player.right();
            this.speed = 15;
            this.goRight = true;
        } else {
            this.x = currentGame.player.left();
            this.speed = -15;
            this.goRight = false;
        }

        this.y = currentGame.player.y + currentGame.player.height / 2;
        
        this.animation = blueShot ? new ObjAnimation(5, `./images/player/bullet/blue-shot.png`, 170, 139) :
            new ObjAnimation(5, `./images/player/bullet/bullet.png`, 170, 139);
        if(superBullet) {
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

    left() { return this.x; }
    right() { return this.x + this.width; }
    top() { return this.y; }
    bottom() { return this.y + this.height; }

    draw() {
        this.animation.animate(true, this.goRight, this.x, this.y, this.width, this.height, 5);
    }

    move() {
        this.x += this.speed - levelLastSpeed;
        // if (this.x >= canvas.width || this.x < 0) {
        //     currentGame.player.bullets.splice(bullet, 1);
        // }
    }

    // hitEnemyOld(bullet) {
    //     console.log(bullet);
    //     let colliding = false;
    //     for (let i = 0; i < level.enemies.length; i++) {
    //         colliding = ! (this.bottom() < level.enemies[i].top() ||
    //         this.top() > level.enemies[i].bottom() ||
    //         this.right() < level.enemies[i].left() ||
    //         this.left() > level.enemies[i].right());

    //         if(colliding) {
    //             level.enemies[i].receiveDmg(this.damageValue);
    //             level.enemies[i].updateEnemy();
    //             if(level.enemies[i].health <= 0 && level.enemies[i].currentAnimation !== 'dying') {
    //                 level.enemies[i].currentAnimation = 'dying';
    //                 level.enemiesToRemove.push(i); //must be removed after a while because the animation of dying
    //                 //return false; //if colliding the bullet will be removed in the player move()
    //             } else {
    //                 currentGame.player.bullets.splice(bullet, 1);
    //             }
    //         }
    //     }
    // }

    // hitEnemy(enemy) {
    //     let colliding = false;
    //     colliding = ! (this.bottom() < enemy.top() ||
    //         this.top() > enemy.bottom() ||
    //         this.right() < enemy.left() ||
    //         this.left() > enemy.right());

    //     if (colliding) {
    //         if (enemy.health > 0 && enemy.health > this.damageValue) {
    //             enemy.receiveDmg(this.damageValue);
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    // }

    updateBullet() { //bullet stands for its position int he player array       
        this.move();
        this.draw();
        //this.hitEnemy();
    }
}