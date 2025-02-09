import Phaser from "phaser";
import { IPrize } from "src/Scenes/MainScene/Wheel/Prize/Prize";
import { PRELOAD_IDS } from "src/utils";

export class WinPrize {
  private scene: Phaser.Scene;
  private position: Phaser.Math.Vector2;
  private container: Phaser.GameObjects.Container;
  private rays: Phaser.GameObjects.Image;
  private prize: IPrize;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    prize: IPrize
  ) {
    this.scene = scene;
    this.position = position;
    this.prize = prize;

    this.create();
  }

  public getContainer() {
    return this.container;
  }

  private create() {
    this.container = this.scene.add.container(this.position.x, this.position.y);

    const prize = this.scene.add.image(0, 0, this.prize.id);
    prize.setOrigin(0.5);
    prize.setScale(1.5);

    const prizeText = this.scene.add.text(
      0,
      prize.height + 10,
      this.prize.text,
      {
        fontSize: "bold 36px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#0D42C1",
        strokeThickness: 2,
      }
    );
    prizeText.setOrigin(0.5);

    this.rays = this.scene.add.image(0, prize.y, PRELOAD_IDS.WIN_RAYS);
    this.container.add([this.rays, prize, prizeText]);
  }
}
