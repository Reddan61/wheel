import Phaser from "phaser";
import { IPrize } from "src/Scenes/MainScene/Wheel/Prize/Prize";
import { PRELOAD_IDS } from "src/utils";

export class Ribbon {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private ribbon: Phaser.GameObjects.Image;
  private prize: IPrize;

  constructor(scene: Phaser.Scene, prize: IPrize) {
    this.scene = scene;
    this.prize = prize;

    this.create();
  }

  public getContainer() {
    return this.container;
  }

  public anim() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 1000,
      ease: "Linear",
    });
  }

  private create() {
    const starsTexture = this.scene.textures
      .get(PRELOAD_IDS.WIN_STARS)
      .getSourceImage();

    this.container = this.scene.add.container(0, starsTexture.height / 2);

    const stars = this.scene.add.image(0, 0, PRELOAD_IDS.WIN_STARS);
    stars.setOrigin(0.5);

    const ribbonContainer = this.scene.add.container(0, stars.height / 2 - 10);

    this.ribbon = this.scene.add.image(0, 0, PRELOAD_IDS.WIN_RIBBON);
    this.ribbon.setOrigin(0.5);

    const ribbonText = this.scene.add.text(
      0,
      -10,
      this.prize.winText ?? "Пусто",
      {
        fontSize: "bold 42px",
        strokeThickness: 2,
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#C01052",
      }
    );
    ribbonText.setOrigin(0.5);

    ribbonContainer.add([this.ribbon, ribbonText]);

    this.container.add([stars, ribbonContainer]).setAlpha(0);

    this.subscribe();
  }

  private subscribe() {
    this.scene.scale.on("resize", this.resize);

    this.scene.events.on("shutdown", () => {
      this.scene.scale.off("resize", this.resize);
    });
  }

  private resize = () => {
    const starsTexture = this.scene.textures
      .get(PRELOAD_IDS.WIN_STARS)
      .getSourceImage();

    this.container.setPosition(0, starsTexture.height / 2);
  };
}
