import Phaser from "phaser";
import { Counter } from "src/Scenes/MainScene/Header/Counter/Counter";

export class Header {
  private scene: Phaser.Scene;
  private background: Phaser.GameObjects.Graphics;
  private container: Phaser.GameObjects.Container;
  private contentContainer: Phaser.GameObjects.Container;
  private counter: Counter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.create();
  }

  public setVisible(bool: boolean) {
    this.container.setVisible(bool);
  }

  private subscribe() {
    this.scene.scale.on("resize", this.resize);

    this.scene.events.once("shutdown", () => {
      this.scene.scale.off("resize", this.resize);
    });
  }

  private resize = () => {
    const { width } = this.scene.scale.gameSize;

    this.contentContainer.setPosition(width / 2, 116 / 2);
    this.background.fillRect(0, 0, width, 116);
  };

  private create() {
    this.container = this.scene.add.container(0, 0);
    this.contentContainer = this.scene.add.container(
      this.scene.scale.gameSize.width / 2,
      116 / 2
    );

    this.background = this.scene.add.graphics();
    this.background.fillStyle(0xffffff, 1);
    this.background.fillRect(0, 0, this.scene.scale.gameSize.width, 116);

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
