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

        for(let i = 0; i < level.platformsSrc.length; i++) {
            level.platforms.push(new Platform(level.platformsSrc[i], level.platformsPos[i][0], level.platformsPos[i][1]));
        }

        for(let i = 0; i < level.trapsSrc.length; i++) {
            level.traps.push(new Trap(level.trapsSrc[i], level.trapsPos[i][0], level.trapsPos[i][1]));
        }

        for(let i = 0; i < level.collectorsSrc.length; i++) {
            level.collectors.push(new Collector(level.collectorsSrc[i], level.collPos[i][0], 
                level.collPos[i][1], level.collPos[i][2], level.collPos[i][3], level.collPos[i][4]));
        }

        document.getElementById("game-stage").style.display = "block";
        document.getElementById("main-menu").style.display = "none";
        document.getElementById("robot").style.display = "none";
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

    message(s) {
        controller.pause = true;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.fillRect(canvas.width / 2 - 250, canvas.height / 2 - 280, 500, 200);
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'gold';
        ctx.fillText(`${s}`, 
         canvas.width / 2 - 240, canvas.height / 2 - 250);
        ctx.fillText('Press ESC to continue.',
         canvas.width / 2 - 240, canvas.height / 2 - 250 + 30);
    }

    finishGame() {
        //cancelAnimationFrame(request);
        location.reload();
    }
}