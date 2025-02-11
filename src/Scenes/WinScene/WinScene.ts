import Phaser from "phaser";
import WinRays from "assets/win/winRays.png";
import WinRibbon from "assets/win/winRibbon.png";
import WinStars from "assets/win/winStars.png";
import Confetti1 from "assets/confetti/prize_confetti_1.png";
import Confetti2 from "assets/confetti/prize_confetti_2.png";
import Confetti3 from "assets/confetti/prize_confetti_3.png";
import Confetti4 from "assets/confetti/prize_confetti_4.png";
import { PRELOAD_IDS, SCENES_KEYS } from "src/utils";
import { Ribbon } from "src/Scenes/WinScene/Ribbon";
import { WinPrize } from "src/Scenes/WinScene/WinPrize";
import { Confetti } from "src/Scenes/WinScene/Confetti";
import { SceneBackground } from "src/Scenes/SceneBackground/SceneBackground";
import { IPrize } from "src/Scenes/MainScene/Wheel/Prize/Prize";

export enum WIN_SCENE_DATA_KEYS {
  PRIZE = "prize",
}

export interface IWinSceneData {
  [WIN_SCENE_DATA_KEYS.PRIZE]: IPrize;
}

export class WinScene extends Phaser.Scene {
  private prize: IPrize;
  private background: SceneBackground;
  private winPrize: WinPrize;
  private ribbon: Ribbon;
  private confetti: Confetti;
  private container: Phaser.GameObjects.Container;

  constructor() {
    super({ key: SCENES_KEYS.WIN_SCENE });
  }

  preload() {
    this.load.image(PRELOAD_IDS.WIN_RAYS, WinRays);
    this.load.image(PRELOAD_IDS.WIN_RIBBON, WinRibbon);
    this.load.image(PRELOAD_IDS.WIN_STARS, WinStars);

    this.load.image(PRELOAD_IDS.CONFETTI_1, Confetti1);
    this.load.image(PRELOAD_IDS.CONFETTI_2, Confetti2);
    this.load.image(PRELOAD_IDS.CONFETTI_3, Confetti3);
    this.load.image(PRELOAD_IDS.CONFETTI_4, Confetti4);
  }

  init(data: IWinSceneData) {
    this.prize = data.prize;
  }

  create() {
    this.background = new SceneBackground(this);

    this.ribbon = new Ribbon(this, this.prize);

    this.winPrize = new WinPrize(this, this.prize, () => {
      this.ribbon.anim();
      this.confetti.anim();
    });

    this.container = this.add.container(this.scale.gameSize.width / 2, 0);

    this.container.add([
      this.winPrize.getContainer(),
      this.ribbon.getContainer(),
    ]);

    this.confetti = new Confetti(this);

    this.subscribe();
  }

  private onBackgroundClick = () => {
    this.scene.stop(SCENES_KEYS.WIN_SCENE);
  };

  private onBackgroundAnimationComplited = () => {
    this.winPrize.anim();
  };

  private subscribe() {
    this.background.setOnClick(this.onBackgroundClick);
    this.background.setOnBackgroundAnimationComplited(
      this.onBackgroundAnimationComplited
    );

    this.scale.on("resize", this.resize);

    this.events.on("shutdown", () => {
      this.scale.off("resize", this.resize);
    });
  }

  private resize = () => {
    const { width } = this.scale.gameSize;

    this.container.setPosition(width / 2, 0);
  };
}
