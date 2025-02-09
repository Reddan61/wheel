import Phaser from "phaser";
import { PRELOAD_IDS } from "src/utils";

export class Confetti {
  private scene: Phaser.Scene;
  private confettiIds = [
    PRELOAD_IDS.CONFETTI_1,
    PRELOAD_IDS.CONFETTI_2,
    PRELOAD_IDS.CONFETTI_3,
    PRELOAD_IDS.CONFETTI_4,
  ];
  private dropZone: Phaser.Geom.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.create();
  }

  private create() {
    this.dropZone = new Phaser.Geom.Rectangle(0, 0, this.scene.scale.width, 0);

    this.confettiIds.forEach((id) => {
      const emitter1 = this.scene.add.particles(0, 0, id, {
        x: 0,
        y: 0,
        frequency: 200,
        speedY: 500,
        scale: { min: 0.5, max: 1 },
        rotate: {
          onEmit: () => {
            return 0;
          },
          onUpdate: (particle) => {
            return particle.angle + 1;
          },
        },
        lifespan: 5000,
        quantity: 1,
        duration: -1,
        // @ts-ignore
        emitZone: {
          type: "random",
          source: this.dropZone,
        },
      });

      emitter1.start();
    });

    this.subscribe();
  }

  private subscribe() {
    this.scene.scale.on("resize", this.resize);

    this.scene.events.on("shutdown", () => {
      this.scene.scale.off("resize", this.resize);
    });
  }

  private resize = () => {
    const { width } = this.scene.scale;

    this.dropZone.setSize(width, 0);
  };
}
