class Bullet {
    constructor(superBullet = false) {
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
        
        this.animation = new ObjAnimation(5, `./images/player/bullet/bullet.png`, 170, 139);
        if(superBullet) {
            this.width = 80;
            this.height = 50;
            this.damageValue = 3;
            this.y -= 15;
        } else {
            this.width = 30;
            this.height = 20;
            this.damageValue = 1;
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
    }

    hitEnemy() {
        let colliding = false;
        for (let i = 0; i < level.enemies.length; i++) {
            colliding = ! (this.bottom() < level.enemies[i].top() ||
            this.top() > level.enemies[i].bottom() ||
            this.right() < level.enemies[i].left() ||
            this.left() > level.enemies[i].right());

            if(colliding) {
                level.enemies[i].receiveDmg(this.damageValue);
                level.enemies[i].updateEnemy();
                if(level.enemies[i].health <= 0) {
                    level.enemies.splice(i, 1);
                }
                return colliding; //if colliding the bullet will be removed in the player move()
            }
        }
    }

    updateBullet() {
        this.move();
        this.draw();
    }
}