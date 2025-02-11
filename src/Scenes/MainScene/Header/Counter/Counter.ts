import Phaser from "phaser";
import {
  CONFIG_KEYS,
  getConfigValueByKey,
  setConfigValueByKey,
} from "src/config";
import { PRELOAD_IDS } from "src/utils";

export class Counter {
  private position: Phaser.Math.Vector2;
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private count: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2) {
    this.scene = scene;
    this.position = position;

    this.create();
  }

  public getElement() {
    return this.container;
  }

  private create() {
    this.container = this.scene.add.container(this.position.x, this.position.y);

    const image = this.scene.add.image(0, 0, PRELOAD_IDS.FORTUNE);

    const rectangle = this.scene.add.graphics();
    const radius = 21;
    const rectangleSize = new Phaser.Math.Vector2(132, 42);
    const rectanglePosition = new Phaser.Math.Vector2(0, -rectangleSize.y / 2);

    rectangle.fillStyle(0xc3d3fb, 1);
    rectangle.lineStyle(1, 0x003d6d, 1);

    rectangle.fillRoundedRect(
      rectanglePosition.x,
      rectanglePosition.y,
      rectangleSize.x,
      rectangleSize.y,
      radius
    );
    rectangle.strokeRoundedRect(
      rectanglePosition.x,
      rectanglePosition.y,
      rectangleSize.x,
      rectangleSize.y,
      radius
    );

    this.count = this.scene.add
      .text(
        rectanglePosition.x + rectangleSize.x / 2,
        rectanglePosition.y + rectangleSize.y / 2,
        String(getConfigValueByKey(CONFIG_KEYS.ATTEMPTS)),
        {
          fontSize: "bold 28px",
          color: "#003D6D",
          fontFamily: "Arial",
        }
      )
      .setOrigin(0.5);

    this.container.add([rectangle, image, this.count]);

    this.subscribe();
  }

  private subscribe() {
    setConfigValueByKey(CONFIG_KEYS.ON_CHANGE_ATTEMPTS_CB, (attempts) => {
      this.count.setText(String(attempts));
    });

    this.scene.events.once("shutdown", () => {
      setConfigValueByKey(CONFIG_KEYS.ON_CHANGE_ATTEMPTS_CB, null);
    });
  }
}
