class ObjAnimation {
  constructor(totalFrames, imageSrc, frameWidth = 567, frameHeight = 556, shiftX = 0, shiftY = 0, frameDuration = 100) {
    this.totalFrames = totalFrames;
    this.fw = frameWidth;
    this.fh = frameHeight;
    this.w = frameWidth;
    this.h = frameHeight;
    this.shiftX = shiftX;
    this.shiftY = shiftY;
    this.currentFrame = 1;
    this.img = new Image();
    this.img.src = imageSrc;

    this.cols = 3;
    this.frameDuration = frameDuration; // ms per frame
    this.elapsedTime = 0;
  }

  animate(animating, deltaTime, lookingRight = false, x = 0, y = 0, width = this.w, height = this.h, cols = this.cols) {
    if (!animating) {
      this.reset();
    }
    
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!lookingRight) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(this.img, this.shiftX, this.shiftY, this.fw, this.fh, x * -1 - width, y, width, height);
      ctx.restore();
    } else {
      ctx.drawImage(this.img, this.shiftX, this.shiftY, this.fw, this.fh, x, y, width, height);
    }

    // Update frame based on elapsed time
    this.elapsedTime += deltaTime;
    if (this.elapsedTime >= this.frameDuration) {
      this.elapsedTime = 0;

      if (this.currentFrame < this.totalFrames) {
        this.shiftX += this.fw + 1;
        if (this.currentFrame % cols === 0) {
          this.shiftX = 0;
          this.shiftY += this.fh + 1;
        }
        this.currentFrame++;
      } else {
        this.reset();
      }
    }
  }

  reset() {
    this.currentFrame = 1;
    this.shiftX = 0;
    this.shiftY = 0;
    this.elapsedTime = 0;
  }
}
