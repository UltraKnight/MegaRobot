class Robot {
    constructor() {
        let enemyType = Math.floor(Math.random() * (4 - 1) + 1); //random from 1 to 3
        
        this.x = Math.floor(Math.random() * (8500 - currentGame.player.x - 900) + currentGame.player.x + 900);
        //this.x = canvas.width; // for testing
        this.y = level.groundY;
        this.health = enemyType + 2;
        this.width = 180;
        this.height = 190;
        //this.walkAnimation = new ObjAnimation(12, `./images/enemies/Robot0${enemyType}/walk/walk.png`, 877, 1187);
        this.walkAnimation = new ObjAnimation(12, `./images/enemies/Robot0${enemyType}/walk/walk.png`, 478, 629);
        this.attack1Animation = new ObjAnimation(8, `./images/enemies/Robot0${enemyType}/attack/attack1.png`, 478, 411);
        this.attackRange = 10;
        this.attacking = false;
        this.lookingRight = false; // enemies walk to left
        this.currentAnimation = 'walking'; //used in animation changing - not implemented yet
        this.animations = ['walking', 'attack1']; //used to change animation when its time - not implemented yet
        this.isEnemy = true;
        this.animating = false; //start animation from the beginning if it is set to false
        this.speed = 3 + enemyType;
        this.changeAnimationAfter = 0; //change animation after count to - not implemented yet
    }

    left() { return this.x + 50; }
    right() { return this.x + this.width - 50; }
    top() { return this.y + 10; }
    bottom() { return this.y + this.height - 10; }

    receiveDmg(damageValue) {
        if(this.health > 0) {
            this.health -= damageValue;
        }
    }

    draw() {
        if(this.currentAnimation === 'walking') {
            this.walkAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height, 4);

            this.animating = true; //will be false when the animation changes - not implemented
        } else if(this.currentAnimation === 'attack1') {
            this.attack1Animation.animate(this.animating, this.lookingRight, this.x, this.y - 30, this.width + 50, this.height + 50, 4);
            
            this.animating = true;
            if(this.attack1Animation.currentFrame === this.attack1Animation.totalFrames) {
                this.animating = true;

                if(this.lookingRight) {
                    level.bombs.push(new Bomb(this.x,  this.y + this.height / 2, 6, true));
                } else {
                    level.bombs.push(new Bomb(this.x,  this.y + this.height / 2, -6, false));
                }

                this.currentAnimation = 'walking';
                this.changeAnimationAfter = 1;
            }
            this.changeAnimationAfter = 1;
        }
    }

    move() {
        if(this.changeAnimationAfter % 100 === 0) {
            this.currentAnimation = this.animations[Math.floor(Math.random() * this.animations.length)];
            this.changeAnimationAfter = 0;
            this.animating = false;
        }

        if(this.currentAnimation === 'walking') {
            this.x -= this.speed + levelLastSpeed;
        }
        else if(this.currentAnimation === 'attack1') {
            this.x -= level.speed;
        }

        this.changeAnimationAfter++;
    }

    updateEnemy() {
        this.move();
        this.draw();
    }
}