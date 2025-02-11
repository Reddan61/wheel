import Phaser from "phaser";
import { CONFIG_KEYS, getConfigValueByKey } from "src/config";
import { Counter } from "src/Scenes/MainScene/Header/Counter/Counter";

export class Header {
  private height = 116;
  private scene: Phaser.Scene;
  private background: Phaser.GameObjects.Graphics;
  private container: Phaser.GameObjects.Container;
  private contentContainer: Phaser.GameObjects.Container;
  private counter: Counter;

  private animationDuration = 300;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.create();
  }

  public hide() {
    this.scene.tweens.add({
      targets: this.container,
      y: 0 - this.container.height,
      duration: this.animationDuration,
      ease: "Linear",
      onComplete: () => {
        this.container.setVisible(false);
      },
    });
  }

  public show() {
    this.container.setVisible(true);

    this.scene.tweens.add({
      targets: this.container,
      y: 0,
      duration: this.animationDuration,
      ease: "Linear",
    });
  }

  private subscribe() {
    this.scene.scale.on("resize", this.resize);

    this.scene.events.once("shutdown", () => {
      this.scene.scale.off("resize", this.resize);
    });
  }

  private resize = () => {
    this.container.setSize(this.scene.scale.gameSize.width, this.height);

    const { width, height } = this.container;

    this.contentContainer.setPosition(width / 2, height / 2);
    this.background.fillRect(0, 0, width, height);
  };

  private create() {
    this.container = this.scene.add.container(0, 0);
    this.container.setSize(this.scene.scale.width, this.height);

    const { width, height } = this.container;

    this.contentContainer = this.scene.add.container(width / 2, height / 2);

    this.background = this.scene.add.graphics();
    this.background.fillStyle(0xffffff, 1);
    this.background.fillRect(0, 0, width, height);

    const titlePosition = new Phaser.Math.Vector2(0, 0);

    const title = this.scene.add
      .text(titlePosition.x, titlePosition.y, "Фортуна", {
        fontSize: "bold 48px",
        color: "#000000",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.counter = new Counter(
      this.scene,
      new Phaser.Math.Vector2(
        titlePosition.x + title.width / 2 + 65,
        titlePosition.y
      )
    );

    this.contentContainer.add([title, this.counter.getElement()]);
    this.container.add([this.background, this.contentContainer]);

    this.subscribe();
  }
}
