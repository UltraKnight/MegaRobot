class Game {
  constructor() {
    this.player = {};
    this.controller = {};
    this.collectors = {}; //object of array of items of the game like -> life, armor parts, etc.
    this.hasEnded = false;
    this.lastLevel = 2;
  }

  startGame() {
    if (this.hasEnded) {
      sessionStorage.setItem('reloading', 'true');
      window.location = window.location.href;
      return;
    }

    cancelAnimationFrame(request);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < level.platformsSrc.length; i++) {
      level.platforms.push(new Platform(level.platformsSrc[i], level.platformsPos[i][0], level.platformsPos[i][1]));
    }

    for (let i = 0; i < level.trapsSrc.length; i++) {
      level.traps.push(new Trap(level.trapsSrc[i], level.trapsPos[i][0], level.trapsPos[i][1]));
    }

    for (let i = 0; i < level.collectorsSrc.length; i++) {
      level.collectors.push(
        new Collector(
          level.collectorsSrc[i],
          level.collPos[i][0],
          level.collPos[i][1],
          level.collPos[i][2],
          level.collPos[i][3],
          level.collPos[i][4],
          level.collPos[i][5],
        ),
      );
    }

    document.getElementById('game-stage').style.display = 'block';
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('robot').style.display = 'none';

    backSound.sound.src = `./sounds/background/backSound${currentLevel}.mp3`;
    if (backSound.sound.paused) {
      backSound.play();
    }
    requestAnimationFrame(loop);
    if (currentLevel === 1) {
      this.message('Megarobot! Help us to eliminate the unbridled robots that are trying to invade our facilities!');
    }
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
    const btnPlay = document.getElementById('btn-play-again');
    btnPlay.disabled = false;

    if (this.player.health >= 0) {
      if (currentLevel < this.lastLevel) {
        ctx.font = 'bold 90px serif';
        ctx.fillStyle = 'red';
        ctx.fillText(`CONGRATULATIONS!!! YOU SURVIVED!!!`, 50, canvas.height / 2 - 20);
        ctx.font = '40px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(
          `It's not over yet... Click on the NEXT LEVEL button when you're ready!`,
          80,
          canvas.height / 2 + 50,
        );
        currentLevel++;
        btnPlay.innerHTML = 'NEXT LEVEL';

        document.removeEventListener('keydown', controller.keyListener);
        document.removeEventListener('keyup', controller.keyListener);
        //if(! sessionStorage.getItem("nextLevel")) {
        sessionStorage.setItem('nextLevel', String(currentLevel));
        //}
      } else {
        ctx.font = 'bold 60px serif';
        ctx.fillStyle = 'red';
        ctx.fillText(`THAT'S IT! YOU BEATED THE GAME AND SAVED THE WORLD!`, 50, canvas.height / 2 - 20);
        currentLevel = 1;
        sessionStorage.setItem('nextLevel', '1');
        document.removeEventListener('keydown', controller.keyListener);
        document.removeEventListener('keyup', controller.keyListener);
      }
    } else {
      btnPlay.innerHTML = 'PLAY AGAIN';
      ctx.font = 'bold 100px serif';
      ctx.fillStyle = 'red';
      ctx.fillText(`YOU DIED`, canvas.width / 2 - 300, canvas.height / 2 - 20);

      // currentLevel = 1;
      // if(sessionStorage.getItem("nextLevel")) {
      //     sessionStorage.removeItem("nextLevel");
      // }
    }
  }

  message(s) {
    controller.pause = true;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    //ctx.fillRect(canvas.width / 2 - 250, canvas.height / 2 - 280, 500, 200);
    ctx.fillRect(0, canvas.height / 2 - 280, canvas.width, 200);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'gold';
    ctx.fillText(`${s}`, canvas.width / 2 - 240, canvas.height / 2 - 250);
    ctx.fillText('Press ESC or F to continue.', canvas.width / 2 - 240, canvas.height / 2 - 250 + 30);
  }

  finishGame() {
    //cancelAnimationFrame(request);
    if (confirm('If you quit you will lose your progress, ok?')) {
      if (sessionStorage.getItem('nextLevel')) {
        sessionStorage.removeItem('nextLevel');
      }
      window.location = window.location.href;
    }
  }
}
