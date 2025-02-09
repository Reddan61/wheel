import Phaser from "phaser";
import { LoseScene } from "src/Scenes/LoseScene";
import { MainScene } from "src/Scenes/MainScene/MainScene";
import { NoAttemptsScene } from "src/Scenes/NoAttempts";
import { WinScene } from "src/Scenes/WinScene/WinScene";

const start = () => {
  const config = {
    type: Phaser.AUTO,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    scene: [MainScene, LoseScene, WinScene, NoAttemptsScene],
    transparent: true,
  };

  new Phaser.Game(config);
};

start();
