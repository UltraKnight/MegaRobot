class Platform {
    constructor(source, x, y) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 100;
        this.imgSrc = source;
        this.isEnemy = false;
    }

    left() { return this.x; }
    right() { return this.x + this.width; }
    top() { return this.y; }
    bottom() { return this.y + this.height - 45; }

    draw() {
        let img = new Image();
        img.src = this.imgSrc;
        this.x = this.x - level.speed;
        ctx.drawImage(img, this.x - level.speed, this.y, this.width, this.height);
    }
}