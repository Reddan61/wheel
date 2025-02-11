import Phaser from "phaser";
import Pin from "assets/pin/pin.png";
import PinLight from "assets/pin/pinLight.png";
import PinShadow from "assets/pin/pinShadow.png";
import WheelShadow from "assets/wheel/wheelShadow.png";
import WheelCircle from "assets/wheel/wheelCircle.png";
import WheelBackground from "assets/wheel/wheelBackground.png";
import WheelRaysBackground from "assets/wheel/wheelRaysBackground.png";
import WheelParticle from "assets/wheel/particle.png";
import Fortune from "assets/fortune.png";
import {
  IWinSceneData,
  WIN_SCENE_DATA_KEYS,
} from "src/Scenes/WinScene/WinScene";
import { StartButton } from "src/Scenes/MainScene/StartButton";
import { Wheel } from "src/Scenes/MainScene/Wheel/Wheel";
import { Header } from "src/Scenes/MainScene/Header/Header";
import { IPrize } from "src/Scenes/MainScene/Wheel/Prize/Prize";
import { PRELOAD_IDS, SCENES_KEYS } from "src/utils";
import { CONFIG_KEYS, getConfigValueByKey } from "src/config";

export class MainScene extends Phaser.Scene {
  private wheel: Wheel;
  private header: Header;
  private startButton: StartButton;

  constructor() {
    super({ key: SCENES_KEYS.MAIN_SCENE });
  }

  preload() {
    this.load.image(PRELOAD_IDS.PIN, Pin);
    this.load.image(PRELOAD_IDS.WHEEL_BACKGROUND, WheelBackground);
    this.load.image(PRELOAD_IDS.WHEEL_SHADOW, WheelShadow);
    this.load.image(PRELOAD_IDS.WHEEL_CIRCLE, WheelCircle);
    this.load.image(PRELOAD_IDS.WHEEL_BACKGROUND_RAYS, WheelRaysBackground);
    this.load.image(PRELOAD_IDS.WHEEL_PARTICLE, WheelParticle);
    this.load.image(PRELOAD_IDS.PIN_LIGHT, PinLight);
    this.load.image(PRELOAD_IDS.PIN_SHADOW, PinShadow);
    this.load.image(PRELOAD_IDS.FORTUNE, Fortune);

    const prizes = getConfigValueByKey(CONFIG_KEYS.PRIZES);

    prizes.forEach(({ id, img }) => {
      if (img) {
        this.load.image(id, img);
      }
    });
  }

  create() {
    const { width, height } = this.game.scale.gameSize;

    const wheelPosition = new Phaser.Math.Vector2(width / 2, height / 2);

    this.wheel = new Wheel(this, wheelPosition);

    this.header = new Header(this);

    const buttonPosition = new Phaser.Math.Vector2(width / 2, height - 50);

    this.startButton = new StartButton(
      this,
      buttonPosition,
      this.onStartButtonClick
    );

    this.subscribe();
  }

  private subscribe() {
    this.wheel.setOnEnd(this.onEndWheelSpin);
    this.wheel.setOnStart(this.onStartWheelSpin);

    this.scale.on("resize", this.resize);
    window.addEventListener("resize", this.windowResize);

    this.events.on("shutdown", () => {
      this.scale.off("resize", this.resize);
      window.removeEventListener("resize", this.windowResize);
    });
  }

  private onStartButtonClick = () => {
    this.wheel.spin();
  };

  private onEndWheelSpin = (prize: IPrize) => {
    this.header.show();
    this.startButton.show();

    if (prize.img) {
      this.scene.launch(SCENES_KEYS.WIN_SCENE, {
        [WIN_SCENE_DATA_KEYS.PRIZE]: prize,
      } as IWinSceneData);
    } else {
      this.scene.launch(SCENES_KEYS.LOSE_SCENE);
    }
  };

  private onStartWheelSpin = () => {
    this.header.hide();
    this.startButton.hide();
  };

  private windowResize = () => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    this.game.scale.resize(width, height);
  };

  private resize = () => {
    const { width, height } = this.scale.gameSize;

    const wheelPosition = new Phaser.Math.Vector2(width / 2, height / 2);
    const buttonPosition = new Phaser.Math.Vector2(width / 2, height - 50);

    this.wheel.resize(wheelPosition.x, wheelPosition.y);
    this.startButton.resize(buttonPosition.x, buttonPosition.y);
  };
}
