import Phaser from "phaser";

export interface IPrize {
  id: string;
  text: string;
  img?: string;
  winText?: string;
}

export class Prize {
  private wheelRadius: number;
  private angle: number;
  private textColor: string;
  private prize: IPrize;
  private scene: Phaser.Scene;
  private position: Phaser.Math.Vector2;
  private container: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    angle: number,
    wheelRadius: number,
    textColor: string,
    prize: IPrize
  ) {
    this.scene = scene;
    this.position = position;
    this.angle = angle;
    this.wheelRadius = wheelRadius;
    this.prize = prize;
    this.textColor = textColor;

    this.create();
  }

  public getElement() {
    return this.container;
  }

  private create() {
    this.container = this.scene.add.container(this.position.x, this.position.y);

    const textOptions = {
      fontSize: "bold 24px",
      color: this.textColor,
      fontFamily: "Arial",
    };

    const hasImage = !!this.prize.img;
    const textPositionY = !hasImage ? 0 : this.wheelRadius / 4;

    const text = this.scene.add.text(
      0,
      textPositionY,
      this.prize.text,
      textOptions
    );
    text.setOrigin(0.5);

    this.container.add(text);

    if (hasImage) {
      const img = this.scene.add.image(0, 0, this.prize.id);

      this.container.add(img);
    }

    this.container.setRotation(this.angle);
  }
}
