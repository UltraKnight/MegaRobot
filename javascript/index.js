const canvas = document.getElementById('game-stage');
const ctx = canvas.getContext('2d');

let currentGame = new Game();
let currentLevel = 1;
let request;
let gravity = 0.38; //0.67
let gravitySpeed = 0.7;
let levelLastSpeed = 0;
let dyingTimer;

currentGame.player = new Player();

function loop(timestamp) {
    if (dyingTimer === undefined) {
        dyingTimer = timestamp;
    }
        
    if(controller.pause) {
        return;
    }
    level.updateLevel();

    if(controller.k) {
        if (currentGame.player.onGround) {
            if(! (currentGame.player.jumping || currentGame.player.sliding)) {
                currentGame.player.jumping = true;
                currentGame.player.jumpHeight = 360; //350
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
            currentGame.player.xVelocity = 6;
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
            currentGame.player.xVelocity = -6;
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

    level.drawFront();
    
    if(currentGame.hasEnded) {
        cancelAnimationFrame(request);
        if (! rainSound.sound.paused) {
            rainSound.sound.pause();
        }

        if(currentGame.player.health < 0) {
            request = requestAnimationFrame(dying);
        } else {
            currentGame.gameOver();
            return; //avoid entering in gameOver() twice
        }
    }

    //remove dead enemies after 3 seconds every 3 seconds :s
    if (timestamp - dyingTimer >= 4000) {
        //remove the dead enemies after the dying animation is executed

            for (let i = 0; i < level.enemiesToRemove.length; i++) {
                //level.enemies.splice(level.enemiesToRemove[i], 1);
                level.enemiesToRemove.splice(i, 1);

            }
  
        dyingTimer = timestamp;
    }

    request = requestAnimationFrame(loop);
}

function dying() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    level.updateLevel();
    currentGame.player.die();
    diedSound.play();
    if(currentGame.player.dieAnimation.currentFrame === currentGame.player.dieAnimation.totalFrames) {
        cancelAnimationFrame(request);
        this.animating = false;
        currentGame.gameOver();
        return;
    }
    request = requestAnimationFrame(dying);
}

window.onload = () => {
    let reloading = sessionStorage.getItem("reloading");
    let nextLevel = sessionStorage.getItem("nextLevel");

    document.addEventListener('keydown', controller.keyListener);
    document.addEventListener('keyup', controller.keyListener);
    document.getElementById('btn-play').onclick = () => { currentGame.startGame(); };
    document.getElementById('btn-play').onmouseover = () => { changeImage(); };
    document.getElementById('btn-play').onmouseout = () => { changeImageBack(); };
    document.getElementById('btn-play-again').onclick = () => { currentGame.startGame(); };
    document.getElementById('btn-finish').onclick = () => { currentGame.finishGame(); };
    document.getElementById('volume-control').onchange = (e) => {
        backSound.sound.volume = e.target.value / 100;
     };
    document.getElementById('volume-effects').onchange = (e) => { changeAllEffects(e); };

    if (reloading) {
        sessionStorage.removeItem("reloading");
        if(nextLevel) {
            currentLevel = parseInt(nextLevel);
            //sessionStorage.removeItem("nextLevel");
        }

        if(currentLevel > 1) {
            goTo(currentLevel);
        }

        currentGame.startGame();
    }
};

function changeImage() {
    document.getElementById("robot").src = "./images/cover-hover.png";
}

function changeImageBack() {
    document.getElementById("robot").src = "./images/cover.png";
}

const changeAllEffects = e => {
    let sounds = [jumpSound, shootSound, superShotSound, 
        saberSound, boomSound, sawSound, sawSound2, hpPlusSound, bossLaugh,
        rainSound, dashSound, diedSound, bossDeathSound];

    sessionStorage.setItem('volumeEffects', String(e.target.value));
    sounds.forEach(sound => {
        sound.sound.volume = e.target.value / 100;
    });
};