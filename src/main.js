import Phaser from "phaser";
import MarkerScene from "./MarkerScene";
import GameScene from "./GameScene";
import VictoryScene from "./VictoryScene";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 240,
  scene: [MarkerScene, GameScene, VictoryScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);