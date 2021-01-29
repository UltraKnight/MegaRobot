class Collector {
    constructor(source, x, y, type, animW, animH, cols) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.animation = new ObjAnimation(2, source, animW, animH);
        this.damageValue = 3;
        this.canDamage = true;
        this.type = type;
        this.cols = cols;
    }

    left() { return this.x; }
    right() { return this.x + this.width - 5; }
    top() { return this.y; }
    bottom() { return this.y + this.height - 5; }

    draw() {
        this.x = this.x - level.speed;
        if(this.x < canvas.width - 300 && this.y > - 60) {
            this.y -= 1;
        }
        this.animation.animate(true, true, this.x, this.y, this.width, this.height, this.cols); //cols
    }

    updateCollector() {
        this.draw();
    }

    hitPlayer() {
        let colliding = false;
        colliding = ! (this.bottom() < currentGame.player.top() ||
        this.top() > currentGame.player.bottom() ||
        this.right() < currentGame.player.left() ||
        this.left() > currentGame.player.right());

        if(colliding && this.canDamage) {
            this.canDamage = false;
            currentGame.player.idle();
            switch (this.type) {
                case 'hp':
                    if (currentLevel === 1) {
                        currentGame.message('HP + 1');
                    }
                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2 - 250, canvas.height / 2 - 225);
                    ctx.lineTo(80, canvas.height / 2 - 290);
                    ctx.stroke();

                    currentGame.player.health++;
                    break;
            
                case 'super-shot':
                    currentGame.player.superCounter = 100;
                    currentGame.player.superShotTimer = 100;

                    if (currentLevel === 1) {
                        currentGame.message('Your Super is faster, you\'ve got a new cannon.');
                    }
                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2 - 250, canvas.height / 2 - 225);
                    ctx.lineTo(100, canvas.height / 2 - 225);
                    ctx.stroke();

                    //NEW CANNON
                    currentGame.player.dieAnimation = new ObjAnimation(10, './images/player/super/die_10_562-519.png', 562, 519);
                    currentGame.player.idleAnimation = new ObjAnimation(10, './images/player/super/idle_10_567-556.png');
                    currentGame.player.jumpAnimation = new ObjAnimation(10, './images/player/super/jump_10_567-556.png');
                    currentGame.player.jumpMeleeAnimation = new ObjAnimation(8, './images/player/super/jumpmelee_8_567-556.png');
                    currentGame.player.jumpShootAnimation = new ObjAnimation(5, './images/player/super/jumpshoot_5_567-556.png');
                    currentGame.player.meleeAnimation = new ObjAnimation(8, './images/player/super/melee_8_567-556.png');
                    currentGame.player.runAnimation = new ObjAnimation(8, './images/player/super/run_8_567-556.png');
                    currentGame.player.runShootAnimation = new ObjAnimation(9, './images/player/super/runshoot_9_567-556.png');
                    currentGame.player.shootAnimation = new ObjAnimation(4, './images/player/super/shoot_4_567-556.png');
                    currentGame.player.slideAnimation = new ObjAnimation(8, './images/player/super/slide_10_567-556.png');

                    //if you dont understand what you have collected after that, then....
                    // currentGame.player.shooting = true;
                    // currentGame.player.move();
                    // currentGame.player.shooting = false;
                    break;
                case 'rapid-s':
                    if (currentLevel === 1) {
                        setTimeout(() => {
                            currentGame.message('Shoot shoot shoot...');
                        }, 800);
                    }
                    currentGame.player.shootCounter = 14;
                    break;
            }
            return colliding; //if colliding the bullet will be removed in the player move()
        }
    }
}