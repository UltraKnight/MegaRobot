const canvas = document.getElementById('game-stage');
const ctx = canvas.getContext('2d');

let currentGame = new Game();
currentGame.player = new Player();
let request;
let gravity = 0.70;
let gravitySpeed = 0;
let levelLastSpeed = 0;

function loop() {
    level.updateLevel();

    if(controller.k) {
        if (currentGame.player.onGround) {
            if(! (currentGame.player.jumping || currentGame.player.sliding)) {
                currentGame.player.jumping = true;
                currentGame.player.jumpHeight = 300;
                jumpSound.play();
            }
        }
    }

    if (controller.s) {
        if (currentGame.player.onGround && currentGame.player.canSlide) {
            if (! (currentGame.player.jumping || currentGame.player.sliding)) {
                if (currentGame.player.lookingRight) {
                    currentGame.player.dashSpeed = 304;
                } else {
                    currentGame.player.dashSpeed = -304;
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
                saberSound.play();
            }
        }
    }

    if(controller.j) {
        if(!(currentGame.player.melee)) {
            currentGame.player.shooting = true;
            if(controller.left === false && controller.right === false && currentGame.player.jumping === false && currentGame.player.sliding === false) {
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
    currentGame.showLife();
    currentGame.player.updateSuperShot();

    if(currentGame.player.jumping) {
        currentGame.player.jump();
    }
    
    if(currentGame.player.sliding) {
        currentGame.player.dash();
    }
    
    if(currentGame.player.melee && currentGame.player.jumping === false) {
        currentGame.player.meleeAtk();
    } 
    
    if(currentGame.player.animating === false && currentGame.player.collidingTop === false) {
        currentGame.player.idle();
    }

    if (level.layers[1] !== '') {
        level.drawFront();
    }
    
    if(currentGame.hasEnded) {
        document.getElementById('btn-play-again').disabled = false;
        cancelAnimationFrame(request);
        currentGame.gameOver();
        return;
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
    document.getElementById('btn-play-again').onclick = () => { currentGame.startGame(); };
    document.getElementById('btn-finish').onclick = () => { currentGame.finishGame(); };

    let reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        currentGame.startGame();
    }
};