class Robot {
    constructor() {
        let enemyType = Math.floor(Math.random() * (4 - 1) + 1); //random from 1 to 3
        
        this.x = Math.floor(Math.random() * (8500 - currentGame.player.x - 500) + currentGame.player.x + 500);
        //this.x = canvas.width; // for testing
        this.y = level.groundY;
        this.health = enemyType + 5;
        this.width = 160;
        this.height = 150;
        this.walkAnimation = new ObjAnimation(12, `./images/enemies/Robot0${enemyType}/walk/walk.png`, 877, 1187);
        this.attackRange = 10;
        this.attacking = false;
        this.lookingRight = false; // enemies walk to left
        this.currentAnimation = 'walking'; //used in animation changing - not implemented yet
        this.animations = ['walking']; //used to change animation when its time - not implemented yet
        this.isEnemy = true;
        this.animating = true; //start animation from the beginning if it is set to false
        this.speed = 3;
        this.changeAnimationAfter = 500; //change animation after count to - not implemented yet
    }

    left() { return this.x + 50; }
    right() { return this.x + this.width - 50; }
    top() { return this.y + 10; }
    bottom() { return this.y + this.height - 10; }

    receiveDmg() {
        if(this.health > 0) {
            this.health--;
            console.log(this.health);
        }
    }

    draw() {
        if(this.currentAnimation === 'walking') {
            this.walkAnimation.animate(this.animating, this.lookingRight, this.x, this.y, this.width, this.height, 4);
            this.animating = true; //will be false when the animation changes - not implemented
        }
    }

    move() {
        if(this.currentAnimation === 'walking') {
            this.x -= this.speed + level.speed;
        }
    }

    updateEnemy() {
        this.move();
        this.draw();
    }
}