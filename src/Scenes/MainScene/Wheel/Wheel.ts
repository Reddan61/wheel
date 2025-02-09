import Phaser from "phaser";
import { IPrize, Prize } from "src/Scenes/MainScene/Wheel/Prize/Prize";
import { getAttempts, setAttempts } from "src/config";
import { PRELOAD_IDS, SCENES_KEYS } from "src/utils";

export type TOnEndSpinCb = (prize: IPrize) => void;
export type TOnStartSpinCb = () => void;

export class Wheel {
  private canSpin = true;
  private color = 0x0d42c1;
  //ms
  private rotationTime = 5000;
  private startAngleCorrect: number;
  private radius: number;
  private scene: Phaser.Scene;
  private position: Phaser.Math.Vector2;
  private backgroundImage: Phaser.GameObjects.Image;
  private backgroundContainer: Phaser.GameObjects.Container;
  private wheelContainer: Phaser.GameObjects.Container;
  private prizes: IPrize[];

  private onEndSpinCb: TOnEndSpinCb;
  private onStartSpinCb: TOnStartSpinCb;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    radius: number,
    prizes: IPrize[],
    onEndSpinCb: TOnEndSpinCb,
    onStartSpinCb: TOnStartSpinCb
  ) {
    this.scene = scene;
    this.position = position;
    this.radius = radius;
    this.prizes = prizes;
    this.onEndSpinCb = onEndSpinCb;
    this.onStartSpinCb = onStartSpinCb;

    const startItemIndex = -2;
    const angleStep = 360 / this.prizes.length;
    this.startAngleCorrect = angleStep * startItemIndex - angleStep / 2;

    this.create();
  }

  public resize(x: number, y: number) {
    this.backgroundContainer.setPosition(x, y);
  }

  public reset() {
    this.wheelContainer.setAngle(0);
  }

  public getHeight() {
    return this.backgroundImage.height;
  }

  private create() {
    this.backgroundContainer = this.scene.add.container(
      this.position.x,
      this.position.y
    );

    this.backgroundImage = this.scene.add.image(
      0,
      0,
      PRELOAD_IDS.WHEEL_BACKGROUND_PARTICLES
    );
    const backgroundCircle = this.scene.add.image(
      0,
      0,
      PRELOAD_IDS.WHEEL_BACKGROUND
    );

    this.backgroundContainer.add([this.backgroundImage, backgroundCircle]);

    const wheelCorrectedPosition = new Phaser.Math.Vector2(0.5, -5);

    this.wheelContainer = this.scene.add.container(
      wheelCorrectedPosition.x,
      wheelCorrectedPosition.y
    );
    const wheel = this.scene.add.graphics();
    wheel.fillStyle(this.color, 1);

    this.wheelContainer.add(wheel);
    this.backgroundContainer.add(this.wheelContainer);

    const prizesLength = this.prizes.length;
    const angleStep = (2 * Math.PI) / prizesLength;

    for (let i = 0; i < prizesLength; i++) {
      const isOdd = i % 2 != 0;

      const currentPrize = this.prizes[i];

      const startAngle =
        i * angleStep + Phaser.Math.DegToRad(this.startAngleCorrect);
      const endAngle = startAngle + angleStep;
      const middleAngle = (startAngle + endAngle) / 2;

      const sectionColor = isOdd ? this.color : 0xc3d3fb;

      const sectionColorGraphics = this.scene.add.graphics({
        fillStyle: { color: sectionColor },
      });
      sectionColorGraphics.slice(0, 0, this.radius, startAngle, endAngle);
      sectionColorGraphics.fillPath();

      this.wheelContainer.add(sectionColorGraphics);

      const offset = this.radius - this.radius / 3;

      const prizePosition = new Phaser.Math.Vector2(
        offset * Math.cos(middleAngle),
        offset * Math.sin(middleAngle)
      );

      const prize = new Prize(
        this.scene,
        prizePosition,
        middleAngle + Math.PI / 2,
        this.radius,
        isOdd ? "#FFFFFF" : "#0D42C1",
        currentPrize
      );

      this.wheelContainer.add(prize.getElement());
    }

    const wheelShadow = this.scene.add.image(
      wheelCorrectedPosition.x,
      wheelCorrectedPosition.y,
      PRELOAD_IDS.WHEEL_SHADOW
    );

    const wheelCircle = this.scene.add.image(
      wheelCorrectedPosition.x,
      wheelCorrectedPosition.y,
      PRELOAD_IDS.WHEEL_CIRCLE
    );

    const pinShadow = this.scene.add.image(
      wheelCorrectedPosition.x,
      wheelCorrectedPosition.y,
      PRELOAD_IDS.PIN_SHADOW
    );

    const pinLight = this.scene.add
      .image(
        wheelCorrectedPosition.x,
        wheelCorrectedPosition.y,
        PRELOAD_IDS.PIN_LIGHT
      )
      .setAlpha(0.4);

    const pin = this.scene.add.image(
      wheelCorrectedPosition.x,
      wheelCorrectedPosition.y,
      PRELOAD_IDS.PIN
    );

    this.backgroundContainer.add([
      wheelShadow,
      pinShadow,
      pinLight,
      wheelCircle,
      pin,
    ]);
  }

  public spin() {
    if (!this.canSpin) {
      return;
    }

    const attempts = getAttempts();

    if (attempts <= 0) {
      this.scene.scene.launch(SCENES_KEYS.NO_ATTEMPTS_SCENE);
      return;
    } else {
      setAttempts(getAttempts() - 1);
    }

    this.reset();
    this.canSpin = false;

    const rounds = Phaser.Math.Between(2, 10);
    const prizesLength = this.prizes.length;
    const sliceAngle = 360 / prizesLength;
    const prizeIndex = Phaser.Math.Between(0, prizesLength - 1);

    const segmentStartAngle = prizeIndex * sliceAngle + this.startAngleCorrect;
    const segmentEndAngle = segmentStartAngle + sliceAngle;
    const finishSegmentAngle = Phaser.Math.Between(
      segmentStartAngle,
      segmentEndAngle
    );

    const finalAngle = 360 * rounds - finishSegmentAngle - 90;

    this.wheelContainer.setRotation(0);

    this.scene.tweens.add({
      targets: this.wheelContainer,
      angle: finalAngle,
      duration: this.rotationTime,
      ease: "Sine.easeInOut",
      onStart: () => {
        this.onStartSpinCb();
      },
      onComplete: () => {
        this.canSpin = true;
        const prize = this.prizes[prizeIndex];
        this.onEndSpinCb(prize);
      },
    });
  }
}
