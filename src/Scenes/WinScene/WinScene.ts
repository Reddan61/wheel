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

export class WinScene extends Phaser.Scene {
  private prize: IPrize;

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

  init(data: { prize: IPrize }) {
    this.prize = data.prize;
  }

  create() {
    new SceneBackground(this, () => {
      this.scene.stop(SCENES_KEYS.WIN_SCENE);
    });

    const ribbon = new Ribbon(this, this.prize);
    const winPrize = new WinPrize(
      this,
      new Phaser.Math.Vector2(0, ribbon.getHeight() + 150),
      this.prize
    );
    ribbon.getContainer().addAt(winPrize.getContainer());

    new Confetti(this);
  }
}
