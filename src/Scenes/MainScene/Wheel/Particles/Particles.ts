import Phaser from "phaser";
import { PRELOAD_IDS } from "src/utils";

export class Particles {
  private scene: Phaser.Scene;
  private size: Phaser.Math.Vector2;

  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private dropZone: Phaser.Geom.Rectangle;

  constructor(scene: Phaser.Scene, size: Phaser.Math.Vector2) {
    this.scene = scene;
    this.size = size;

    this.create();
  }

  public getElement() {
    return this.emitter;
  }

  private create() {
    this.dropZone = new Phaser.Geom.Rectangle(
      -this.size.x / 2,
      -this.size.y / 2,
      this.size.x,
      this.size.y
    );

    this.emitter = this.scene.add.particles(0, 0, PRELOAD_IDS.WHEEL_PARTICLE, {
      frequency: 200,
      speed: { min: 100, max: 500 },
      scale: { min: 0.2, max: 1 },
      lifespan: 10000,
      quantity: 1,
      duration: -1,
      // @ts-ignore
      emitZone: {
        type: "random",
        source: this.dropZone,
      },
    });

    this.emitter.start();
  }
}
