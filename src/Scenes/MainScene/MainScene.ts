import Phaser from "phaser";
import Gift1 from "assets/prizes/gift_1.png";
import Gift2 from "assets/prizes/gift_2.png";
import Gift3 from "assets/prizes/gift_3.png";
import Gift4 from "assets/prizes/gift_4.png";
import Coin from "assets/prizes/coin.png";
import Star from "assets/prizes/star.png";
import Pin from "assets/pin/pin.png";
import PinLight from "assets/pin/pinLight.png";
import PinShadow from "assets/pin/pinShadow.png";
import WheelShadow from "assets/wheelShadow.png";
import WheelCircle from "assets/wheelCircle.png";
import WheelBackground from "assets/wheelBackground.png";
import Fortune from "assets/fortune.png";
import WheelBackgroundParticles from "assets/wheelParticlesBg.png";
import { WIN_SCENE_DATA_KEYS } from "src/Scenes/WinScene/WinScene";
import { StartButton } from "src/Scenes/MainScene/StartButton";
import { Wheel } from "src/Scenes/MainScene/Wheel/Wheel";
import { Header } from "src/Scenes/MainScene/Header/Header";
import { IPrize } from "src/Scenes/MainScene/Wheel/Prize/Prize";
import { PRELOAD_IDS, SCENES_KEYS } from "src/utils";

export class MainScene extends Phaser.Scene {
  private wheel: Wheel;
  private header: Header;
  private startButton: StartButton;

  private gameOptions = {
    wheel: {
      radius: 454 / 2,
    },
    prizes: [
      {
        id: "0",
        text: "x25",
        img: Coin,
        winText: "Монеты",
      },
      {
        id: "1",
        text: "Пусто",
      },
      {
        id: "2",
        text: "x1",
        img: Gift2,
        winText: "Подарок",
      },
      {
        id: "3",
        text: "x1",
        img: Gift3,
        winText: "Подарок",
      },
      {
        id: "4",
        text: "x1",
        img: Gift4,
        winText: "Подарок",
      },
      {
        id: "5",
        text: "Пусто",
      },
      {
        id: "6",
        text: "x1",
        img: Gift1,
        winText: "Подарок",
      },
      {
        id: "7",
        text: "x10",
        img: Star,
        winText: "Звезды",
      },
    ] as IPrize[],
  };

  constructor() {
    super({ key: SCENES_KEYS.MAIN_SCENE });
  }

  preload() {
    this.load.image(PRELOAD_IDS.PIN, Pin);
    this.load.image(PRELOAD_IDS.WHEEL_BACKGROUND, WheelBackground);
    this.load.image(PRELOAD_IDS.WHEEL_SHADOW, WheelShadow);
    this.load.image(PRELOAD_IDS.WHEEL_CIRCLE, WheelCircle);
    this.load.image(
      PRELOAD_IDS.WHEEL_BACKGROUND_PARTICLES,
      WheelBackgroundParticles
    );
    this.load.image(PRELOAD_IDS.PIN_LIGHT, PinLight);
    this.load.image(PRELOAD_IDS.PIN_SHADOW, PinShadow);
    this.load.image(PRELOAD_IDS.FORTUNE, Fortune);

    this.gameOptions.prizes.forEach(({ id, img }) => {
      if (img) {
        this.load.image(id, img);
      }
    });
  }

  create() {
    const { width, height } = this.game.scale.gameSize;
    const { radius } = this.gameOptions.wheel;

    const wheelPosition = new Phaser.Math.Vector2(width / 2, height / 2);

    this.wheel = new Wheel(
      this,
      wheelPosition,
      radius,
      this.gameOptions.prizes,
      (prize) => {
        this.header.setVisible(true);
        this.startButton.setVisible(true);

        if (prize.img) {
          this.scene.launch(SCENES_KEYS.WIN_SCENE, {
            [WIN_SCENE_DATA_KEYS.PRIZE]: prize,
          });
        } else {
          this.scene.launch(SCENES_KEYS.LOSE_SCENE);
        }
      },
      () => {
        this.header.setVisible(false);
        this.startButton.setVisible(false);
      }
    );

    this.header = new Header(this);

    const buttonPosition = new Phaser.Math.Vector2(
      width / 2,
      this.wheel.getHeight() - 100
    );

    this.startButton = new StartButton(this, buttonPosition, () => {
      this.wheel.spin();
    });

    this.subscribe();
  }

  private subscribe() {
    this.scale.on("resize", this.resize);
    window.addEventListener("resize", this.windowResize);

    this.events.on("shutdown", () => {
      this.scale.off("resize", this.resize);
      window.removeEventListener("resize", this.windowResize);
    });
  }

  private windowResize = () => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    this.game.scale.resize(width, height);
  };

  private resize = () => {
    const { width, height } = this.scale.gameSize;

    const wheelPosition = new Phaser.Math.Vector2(width / 2, height / 2);
    const buttonPosition = new Phaser.Math.Vector2(width / 2, height - 20);

    this.wheel.resize(wheelPosition.x, wheelPosition.y);
    this.startButton.resize(buttonPosition.x, buttonPosition.y);
  };
}
