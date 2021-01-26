class Sound {
    constructor(src, loop, volume) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.loop = loop;
        this.sound.volume = volume;

        document.body.appendChild(this.sound);

        this.play = function () {
            this.sound.play();
        };

        this.stop = function () {
            this.sound.pause();
        };
    }
}

backSound = new Sound('./sounds/background/Twin Musicom - Big Birds Date Night Full Version.mp3', true, 0.6);
jumpSound = new Sound('./sounds/effects/jump.wav', false, 1);
shootSound = new Sound('./sounds/effects/shot.mp3', false, 0.9);
superShotSound = new Sound('./sounds/effects/super-shot.wav', false, 1);
saberSound = new Sound('./sounds/effects/saber.mp3', false, 1);
boomSound = new Sound('./sounds/effects/boom.wav', false, 1);