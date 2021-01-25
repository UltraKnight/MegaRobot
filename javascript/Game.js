class Game {
    constructor() {
        this.player = {};
        this.controller = {};
        this.collectors = {}; //object of array of items of the game like -> life, armor parts, etc.
        this.hasEnded = false;
    }

    startGame() {
        cancelAnimationFrame(request);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        request = requestAnimationFrame(loop);
    }
    
    gameOver() {
        if(this.player.health > 0) {
            ctx.font = 'bold 100px serif';
            ctx.fillStyle = 'red';
            ctx.fillText(`CONGRATULATIONS!!! YOU SURVIVED!!!`, canvas.width / 2 - 300, canvas.height / 2 - 20);
        } else {
            ctx.font = 'bold 100px serif';
            ctx.fillStyle = 'red';
            ctx.fillText(`YOU DIED`, canvas.width / 2 - 300, canvas.height / 2 - 20);
        }
    }

    finishGame() {
        cancelAnimationFrame(request);
        return;
    }
}