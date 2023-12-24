const controller = {
  left: false,
  right: false,
  j: false,
  k: false,
  l: false,
  s: false,
  pause: false,
  keyListener(e) {
    let state = e.type === 'keydown' ? true : false;
    switch (e.code) {
      case 'KeyA':
        controller.left = state;
        break;
      case 'KeyD':
        controller.right = state;
        break;
      case 'KeyJ':
        controller.j = state;
        break;
      case 'KeyK':
      case 'Space':
      case 'KeyW':
        controller.k = state;
        break;
      case 'KeyL':
        controller.l = state;
        break;
      case 'KeyS':
        controller.s = state;
        break;
    }

    if (e.type === 'keyup') {
      currentGame.player.animating = false; //reset next player animation
      switch (e.code) {
        case 'Escape':
        case 'KeyF':
          controller.pause = !controller.pause;
          if (!controller.pause) {
            request = requestAnimationFrame(loop);
          } else if (controller.pause) {
            ctx.strokeStyle = 'silver';
            ctx.lineWidth = 2;
            ctx.font = 'bold 25px sans-serif';
            ctx.strokeText('PAUSED', currentGame.player.x + 30, currentGame.player.y - 50);
          }
          break;
        case 'KeyJ':
          currentGame.player.shooting = false;
          break;
        case 'KeyL':
          currentGame.player.canMelee = true;
          break;
        case 'KeyS':
          currentGame.player.canSlide = true;
          break;
      }
    }
  },
  updateController() {
    return;
  },
};
