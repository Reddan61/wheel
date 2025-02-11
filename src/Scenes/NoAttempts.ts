import Phaser from "phaser";
import { SceneBackground } from "src/Scenes/SceneBackground/SceneBackground";
import { SCENES_KEYS } from "src/utils";

export class NoAttemptsScene extends Phaser.Scene {
  private background: SceneBackground;
  private title: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: SCENES_KEYS.NO_ATTEMPTS_SCENE,
    });
  }

  create() {
    this.background = new SceneBackground(this);

    const { width, height } = this.scale;

    this.title = this.add.text(
      width / 2,
      height / 2,
      "У вас закончились попытки",
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
    this.title.setAlpha(0);

    this.subscribe();
  }

  public static launch(scene: Phaser.Scene) {
    scene.scene.launch(SCENES_KEYS.NO_ATTEMPTS_SCENE);
  }

  public static stop(scene: Phaser.Scene) {
    scene.scene.stop(SCENES_KEYS.NO_ATTEMPTS_SCENE);
  }

  private onBackgroundClick = () => {
    NoAttemptsScene.stop(this.scene.scene);
  };

  private onBackgroundAnimationComplited = () => {
    this.add.tween({
      targets: this.title,
      alpha: 1,
      ease: "Linear",
      duration: 1000,
    });
  };

  private subscribe() {
    this.background.setOnClick(this.onBackgroundClick);
    this.background.setOnBackgroundAnimationComplited(
      this.onBackgroundAnimationComplited
    );

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
