const rain = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  raining: new ObjAnimation(3, `./images/env/rain/raining.png`, 1920, 1080),

  makeRain(deltaTime) {
    this.raining.animate(true, deltaTime, true, this.x, this.y, this.width, this.height, 1);
  },
};
