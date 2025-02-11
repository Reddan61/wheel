import Phaser from "phaser";

type TOnClickCb = () => void;
type TOnAnimationComplitedCb = () => void;

export class SceneBackground {
  private scene: Phaser.Scene;
  private bottomText: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Graphics;
  private hitBox: Phaser.GameObjects.Zone;

  private canClick = false;
  private onClickCb = null as TOnClickCb | null;
  private onBackgroundAnimationComplitedCb =
    null as TOnAnimationComplitedCb | null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.create();
  }

  public setOnClick = (cb: TOnClickCb) => {
    this.onClickCb = cb;
  };

  public setOnBackgroundAnimationComplited = (cb: TOnAnimationComplitedCb) => {
    this.onBackgroundAnimationComplitedCb = cb;
  };

  private create() {
    const { width, height } = this.scene.scale.gameSize;

    this.background = this.scene.add.graphics();
    this.background.fillStyle(0x000000, 0.8);
    this.background.fillRect(0, 0, width, height);
    this.background.setAlpha(0);

    this.hitBox = this.scene.add
      .zone(width / 2, height / 2, width, height)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.bottomText = this.scene.add.text(
      width / 2,
      height - 60,
      "Нажмите, чтобы продолжить",
      {
        fontSize: "bold 36px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#0D42C1",
        strokeThickness: 2,
      }
    );
    this.bottomText.setOrigin(0.5).setAlpha(0);

    this.scene.add.tween({
      targets: this.background,
      alpha: 0.8,
      ease: "Linear",
      duration: 500,
      onComplete: () => {
        this.onBackgroundAnimationComplitedCb?.();

        this.scene.add.tween({
          targets: this.bottomText,
          alpha: 1,
          ease: "Linear",
          delay: 1000,
          duration: 1000,
          repeat: -1,
          yoyo: true,
          onStart: () => {
            this.canClick = true;
          },
        });
      },
    });

    this.subscribe();
  }

  private subscribe() {
    this.hitBox.on("pointerdown", this.click);
    this.scene.scale.on("resize", this.resize);

    this.scene.events.once("shutdown", () => {
      this.hitBox.off("pointerdown", this.click);
      this.scene.scale.off("resize", this.resize);
    });
  }

  private click = () => {
    if (this.canClick) {
      this.onClickCb?.();
    }
  };

  private resize = () => {
    const { width, height } = this.scene.game.scale;

    this.background.clear();
    this.background.fillStyle(0x000000, 0.8);
    this.background.fillRect(0, 0, width, height);

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.hitBox.setPosition(halfWidth, halfHeight);
    this.hitBox.setSize(width, height);

    this.bottomText.setPosition(halfWidth, height - 60);
  };
}
