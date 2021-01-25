const canvas = document.getElementById('game-stage');
const ctx = canvas.getContext('2d');

let currentGame = new Game();
currentGame.player = new Player();
let request;
let gravity = 0.70;
let gravitySpeed = 0;

function loop() {  
    level.updateLevel();

    if(controller.k) {
        if (currentGame.player.onGround) {
            if(! (currentGame.player.jumping || currentGame.player.sliding)) {
                currentGame.player.jumping = true;
                currentGame.player.jumpHeight = 300;
            }
        }
    }

    if (controller.s) {
        if (currentGame.player.onGround && currentGame.player.canSlide) {
            if (! (currentGame.player.jumping || currentGame.player.sliding)) {
                if (currentGame.player.lookingRight) {
                    currentGame.player.dashSpeed = 200;
                } else {
                    currentGame.player.dashSpeed = -200;
                }
                currentGame.player.sliding = true;
                currentGame.player.canSlide = false;
            }
        }
    }

    if(controller.l) {
        if(currentGame.player.canMelee) {
            if(! (currentGame.player.melee || currentGame.player.sliding)) {
                currentGame.player.melee = true;
                currentGame.player.canMelee = false;
                currentGame.player.canMeleeDamage = true;
            }
        }
    }

    if(controller.j) {
        if(!(currentGame.player.melee || currentGame.player.sliding)) {
            currentGame.player.shooting = true;
            if(controller.left === false && controller.right === false && currentGame.player.jumping === false) {
                currentGame.player.shoot();
            }
        }
    }

    if(controller.right && controller.left === false) {
        if(!currentGame.player.lookingRight) {
            currentGame.player.turn();
        }
        if((! (currentGame.player.jumping || currentGame.player.melee || currentGame.player.sliding) && currentGame.player.onGround)) {
            currentGame.player.run();
        }
        if(! currentGame.player.sliding) {
            currentGame.player.xVelocity = 5;
        }
    }

    if(controller.left) { 
        if(currentGame.player.lookingRight) {
            currentGame.player.turn();
        }
        if((! (currentGame.player.jumping || currentGame.player.melee || currentGame.player.sliding) && currentGame.player.onGround)) {
            currentGame.player.run();
        }

        if(! currentGame.player.sliding) {
            currentGame.player.xVelocity = -5;
        }
    }

    // if(currentGame.player.collisionCheck(obstacleTest)) { 
    //     currentGame.player.inCollision = true;
    // }

    currentGame.player.move();

    if(currentGame.player.jumping) {
        currentGame.player.jump();
    }
    
    if(currentGame.player.sliding) {
        currentGame.player.dash();
    }
    
    if(currentGame.player.melee && currentGame.player.jumping === false) {
        currentGame.player.meleeAtk();
    } 
    
    if(! currentGame.player.animating) {
        currentGame.player.idle();
    }

    if (level.layers[1] !== '') {
        level.drawFront();
    }
    
    if(currentGame.hasEnded) {
        cancelAnimationFrame(request);
        currentGame.gameOver();
        return ;
    }

    if(controller.pause) {
        return;
    }

    request = requestAnimationFrame(loop);
}

window.onload = () => {
    document.addEventListener('keydown', controller.keyListener);
    document.addEventListener('keyup', controller.keyListener);
    document.getElementById('btn-play').onclick = () => { currentGame.startGame(); };
    document.getElementById('btn-finish').onclick = () => { currentGame.finishGame(); };
};