import Phaser from "phaser";
import { SceneBackground } from "src/Scenes/SceneBackground/SceneBackground";
import { SCENES_KEYS } from "src/utils";

export class LoseScene extends Phaser.Scene {
  private title: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENES_KEYS.LOSE_SCENE });
  }

  preload() {}

  create() {
    const { width, height } = this.scale.gameSize;

    new SceneBackground(this, () => {
      this.scene.stop(SCENES_KEYS.LOSE_SCENE);
    });

    this.title = this.add.text(
      width / 2,
      height / 2,
      "Вы ничего не выиграли. Повезет в следующий раз",
      {
        fontSize: "bold 42px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#0D42C1",
        strokeThickness: 2,
        align: "center",
        wordWrap: { width: 450 },
      }
    );
    this.title.setOrigin(0.5);

    this.subscribe();
  }

  private subscribe() {
    this.scale.on("resize", this.resize);

    this.events.once("shutdown", () => {
      this.scale.off("resize", this.resize);
    });
  }

  private resize = () => {
    const { width, height } = this.game.scale;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.title.setPosition(halfWidth, halfHeight);
  };
}
