//just change the properties of the level :)
const goTo = (currentLevel) => {
    currentGame.player.x = 100;
    currentGame.player.y = 500;
    currentGame.player.superCounter = 200;
    currentGame.player.shootCounter = 18;

    switch (currentLevel) {
        case 1:
            break;
        case 2:
            level.layers = [
                './images/levels/level-2/level-2.png',
                './images/levels/level-2/level-2-front.png'
            ];
        
            level.bossSpawned = false;
            level.enemies = [];
            level.bombs = [];
            level.maxRobots = 40;
            level.remainingRobots = 40; //remaining to be spawned
            level.traps = [];
            level.collectors = [];
            level.collPos = [
                [3000, 500, 'hp', 247, 224, 2],
                [3600, 500, 'super-shot', 247, 304, 2],
                [6280, 600, 'rapid-s', 300, 300, 6]
            ]; //x, y, animation width, animation height
            level.collectorsSrc = [
                `./images/collectors/hp/hp-plus.png`,
                `./images/collectors/super-shot/super-bonus.png`,
                `./images/collectors/rapid-s/rapid-s.png`
            ];
            level.trapsPos = [[1000, 600], [3335, 540], [4300, 630], [6800, 630], [6900, 640]];
            level.trapsSrc = [
                `./images/levels/traps/saw/saw.png`,
                `./images/levels/traps/saw/saw.png`,
                `./images/levels/traps/saw/saw.png`,
                `./images/levels/traps/saw/saw.png`,
                `./images/levels/traps/saw/saw.png`,
            ];
            level.platforms = [];
            level.platformsPos = [[1200, 490], [1800, 490], [2000, 570], [3270, 550], [4000, 560]];
            level.platformsSrc = [
                './images/platforms/tile_middle.png',
                './images/platforms/tile_middle.png',
                './images/platforms/tile_middle.png',
                './images/platforms/tile_middle.png',
                './images/platforms/tile_middle.png'
            ];
        
            level.spawnTimer = 180;
        break;
    }

};