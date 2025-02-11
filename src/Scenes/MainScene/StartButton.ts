import Phaser from "phaser";

type OnClickCb = () => void;

export class StartButton {
  private scene: Phaser.Scene;
  private position: Phaser.Math.Vector2;
  private sizes = new Phaser.Math.Vector2(600, 94);
  private color = 0x0d42c1;
  private container: Phaser.GameObjects.Container;
  private contentContainer: Phaser.GameObjects.Container;
  private hitBox: Phaser.GameObjects.Zone;
  private shadow: Phaser.GameObjects.Graphics;

  private animationDuration = 300;

  private onClick: OnClickCb;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    onClick: OnClickCb
  ) {
    this.scene = scene;
    this.position = new Phaser.Math.Vector2(
      position.x - this.sizes.x / 2,
      position.y - this.sizes.y
    );
    this.onClick = onClick;

    this.create();
    this.subscribe();
  }

  public hide() {
    const { height } = this.scene.scale.gameSize;

    this.scene.add.tween({
      targets: this.container,
      y: height,
      duration: this.animationDuration,
      onComplete: () => {
        this.container.setVisible(false);
        this.hitBox.disableInteractive();
      },
    });
  }

  public show() {
    this.container.setVisible(true);
    this.hitBox.setInteractive();

    this.scene.add.tween({
      targets: this.container,
      y: this.position.y,
      duration: this.animationDuration,
    });
  }

  private create() {
    this.container = this.scene.add.container(this.position.x, this.position.y);

    const background = this.scene.add
      .graphics()
      .fillStyle(this.color, 1)
      .fillRoundedRect(0, 0, this.sizes.x, this.sizes.y, 20);

    this.contentContainer = this.scene.add.container(0, 0);

    const buttonCenter = new Phaser.Math.Vector2(
      this.sizes.x / 2,
      this.sizes.y / 2
    );

    const text = this.scene.add
      .text(buttonCenter.x, buttonCenter.y, "Крутить колесо", {
        fontSize: "36px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.hitBox = this.scene.add
      .zone(buttonCenter.x, buttonCenter.y, this.sizes.x, this.sizes.y)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.shadow = this.scene.add.graphics();
    this.shadow.fillStyle(0x000000, 0.5);
    this.shadow.fillRoundedRect(0, 5, this.sizes.x, this.sizes.y, 20);

    this.contentContainer.add([background, text, this.hitBox]);
    this.container.add([this.shadow, this.contentContainer]);
  }

  public resize(x: number, y: number) {
    this.position = new Phaser.Math.Vector2(
      x - this.sizes.x / 2,
      y - this.sizes.y
    );

    this.container.setPosition(this.position.x, this.position.y);
  }

  private subscribe() {
    this.hitBox.on("pointerdown", this.onClick);
    this.hitBox.on("pointerover", () => {
      this.scene.add.tween({
        targets: this.contentContainer,
        y: 5,
        duration: 200,
      });
    });
    this.hitBox.on("pointerout", () => {
      this.scene.add.tween({
        targets: this.contentContainer,
        y: 0,
        duration: 200,
      });
    });
  }
}
