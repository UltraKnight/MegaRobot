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

let backSound = new Sound('./sounds/background/Twin Musicom - Big Birds Date Night Full Version.mp3', true, 0.8);
let jumpSound = new Sound('./sounds/effects/jump.wav', false, 1);
let shootSound = new Sound('./sounds/effects/shot.mp3', false, 0.9);
let superShotSound = new Sound('./sounds/effects/super-shot.wav', false, 1);
let saberSound = new Sound('./sounds/effects/saber.mp3', false, 1);
let boomSound = new Sound('./sounds/effects/boom.wav', false, 1);
let sawSound = new Sound('./sounds/effects/saw.mp3', false, 1);
let sawSound2 = new Sound('./sounds/effects/saw2.mp3', false, 0.9);
let hpPlusSound = new Sound('./sounds/effects/pickup.wav', false, 1);
let bossLaugh = new Sound('./sounds/effects/boss-laugh.mp3', false, 1);
let rainSound = new Sound('./sounds/background/rain.mp3', true, 1);
let dashSound = new Sound('./sounds/effects/dash.mp3', false, 1);
let diedSound = new Sound('./sounds/effects/died.wav', false, 1);