class ObjAnimation {
  constructor(totalFrames, imageSrc, frameWidth = 567, frameHeight = 556, shiftX = 0, shiftY = 0) {
    this.totalFrames = totalFrames;
    this.fw = frameWidth;
    this.fh = frameHeight;
    this.w = frameWidth;
    this.h = frameHeight;
    this.shiftX = shiftX;
    this.shiftY = shiftY;
    this.currentFrame = 1;
    this.frameLimiterUpdate = 0;
    this.img = new Image();
    this.img.src = imageSrc;
  }

  animate(animating, lookingRight = false, x = 0, y = 0, width = this.w, height = this.h, cols = 3) {
    if (animating === false) {
      this.reset();
    }
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!lookingRight) {
      ctx.save();
      ctx.scale(-1, 1);
      //draw the frame
      ctx.drawImage(this.img, this.shiftX, this.shiftY, this.fw, this.fh, x * -1 - width, y, width, height);
      ctx.restore();
    } else {
      ctx.drawImage(this.img, this.shiftX, this.shiftY, this.fw, this.fh, x, y, width, height);
    }

    //to regulate the animation speed
    this.frameLimiterUpdate++;

    if (this.frameLimiterUpdate % 4 === 0) {
      this.frameLimiterUpdate = 0;

      //restart the animation
      if (this.currentFrame < this.totalFrames) {
        //next col of the sprite sheet
        this.shiftX += this.fw + 1;

        //next row of the sprite sheet
        if (this.currentFrame % cols === 0) {
          //if it's the last column
          this.shiftX = 0; //start from the begining of the next line
          this.shiftY += this.fh + 1; //go to the next line - +1 means 1px distance of each image/frame
        }

        this.currentFrame++;
      } else {
        this.shiftX = 0;
        this.shiftY = 0;
        this.currentFrame = 1;
      }
    }
  }

  reset() {
    this.currentFrame = 1;
    this.shiftX = 0;
    this.shiftY = 0;
    this.frameLimiterUpdate = 0;
  }
}
