class Game {
    constructor() {
        this.player = {};
        this.controller = {};
        this.collectors = {}; //object of array of items of the game like -> life, armor parts, etc.
        this.hasEnded = false;
    }

    startGame() {
        if(this.hasEnded) {
            sessionStorage.setItem("reloading", "true");
            location.reload();
        }

        cancelAnimationFrame(request);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < level.platformsSrc.length; i++) {
            level.platforms.push(new Platform(level.platformsSrc[i], level.platformsPos[i][0], level.platformsPos[i][1]));
        }

        document.getElementById("game-stage").style.display = "block";
        document.getElementById("main-menu").style.display = "none";
        //request = requestAnimationFrame(loop);
        backSound.play();
        requestAnimationFrame(loop);
    }
    
    showLife() {
        ctx.font = 'bold 35px sans-serif';
        ctx.fillStyle = 'gold';
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.fillText(`LIFE ${String(this.player.health)}`, 50, 50);
        ctx.strokeText(`LIFE ${String(this.player.health)}`, 50, 50);
    }

    gameOver() {
        backSound.stop();

        
        if(this.player.health > 0) {
            ctx.font = 'bold 90px serif';
            ctx.fillStyle = 'red';
            ctx.fillText(`CONGRATULATIONS!!! YOU SURVIVED!!!`, 50, canvas.height / 2 - 20);
        } else {
            ctx.font = 'bold 100px serif';
            ctx.fillStyle = 'red';
            ctx.fillText(`YOU DIED`, canvas.width / 2 - 300, canvas.height / 2 - 20);
        }
    }

    finishGame() {
        //cancelAnimationFrame(request);
        location.reload();
    }
}