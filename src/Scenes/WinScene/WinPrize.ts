import Phaser from "phaser";
import { IPrize } from "src/Scenes/MainScene/Wheel/Prize/Prize";
import { PRELOAD_IDS } from "src/utils";

type TOnAnimationCompleteCb = () => void;
export class WinPrize {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private rays: Phaser.GameObjects.Image;
  private prizeImg: Phaser.GameObjects.Image;
  private prizeText: Phaser.GameObjects.Text;
  private prize: IPrize;
  private onAnimationCompleteCb: TOnAnimationCompleteCb;

  constructor(
    scene: Phaser.Scene,
    prize: IPrize,
    onAnimationComplete: TOnAnimationCompleteCb
  ) {
    this.scene = scene;
    this.prize = prize;
    this.onAnimationCompleteCb = onAnimationComplete;

    this.create();
  }

  public anim() {
    this.scene.add.tween({
      targets: this.rays,
      duration: 10000,
      repeat: -1,
      angle: 360,
      ease: "Linear",
    });

    this.scene.tweens.add({
      targets: this.prizeImg,
      y: 0,
      duration: 1000,
      ease: "Bounce.easeOut",
      onComplete: () => {
        this.onAnimationCompleteCb();
        this.scene.add.tween({
          targets: this.rays,
          duration: 1000,
          alpha: 1,
          ease: "Linear",
        });
        this.scene.add.tween({
          targets: this.prizeText,
          duration: 1000,
          alpha: 1,
          ease: "Linear",
        });
      },
    });
  }

  public getContainer() {
    return this.container;
  }

  private create() {
    const { height } = this.scene.scale.gameSize;

    this.container = this.scene.add.container(0, height / 2);

    this.prizeImg = this.scene.add
      .image(0, 0, this.prize.id)
      .setOrigin(0.5)
      .setScale(1.5);
    this.prizeImg.setPosition(0, -height / 2 - this.prizeImg.height);

    this.prizeText = this.scene.add.text(
      0,
      this.prizeImg.height + 10,
      this.prize.text,
      {
        fontSize: "bold 36px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#0D42C1",
        strokeThickness: 2,
      }
    );
    this.prizeText.setOrigin(0.5).setAlpha(0);

    this.rays = this.scene.add.image(0, 0, PRELOAD_IDS.WIN_RAYS).setAlpha(0);
    this.container.add([this.rays, this.prizeImg, this.prizeText]);

    this.subscribe();
  }

  private subscribe() {
    this.scene.scale.on("resize", this.resize);

    this.scene.events.on("shutdown", () => {
      this.scene.scale.off("resize", this.resize);
    });
  }

  private resize = () => {
    const { height } = this.scene.scale.gameSize;

    this.container.setPosition(0, height / 2);
  };
}
