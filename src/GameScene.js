import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.isAttacking = false;
    this.isAttackingP2 = false;
    this.player1Alive = true;
    this.player2Alive = true;
    this.isWalkingP1 = false;
    this.isWalkingP2 = false;
  }

  init(data) {
    this.player1Wins = data.player1Wins;
    this.player2Wins = data.player2Wins;
  }

  hpText1;
  player1Hp = 100;
  hpText2;
  player2Hp = 100;

  // Runs once, loads up assets like images and audio
  preload() {
    // this.load.image('keyWord', 'assets/...');
    this.load.image("sky", "assets/background.png");

    // Load map
    this.load.tilemapTiledJSON("map", "assets/mapaDB.json");

    // Load player
    this.load.atlas("player", "assets/player1.png", "assets/player1.json");

    // Load player2
    this.load.atlas("player2", "assets/player2.png", "assets/player2.json");

    // Load music
    this.load.audio("jump", "assets/salto.mp3");
    this.load.audio("attack1", "assets/ataqueCaballero.mp3");
    this.load.audio("attack2", "assets/ataqueRojo.mp3");
    this.load.audio("steps", "assets/pasos.mp3");
    this.load.audio("damage", "assets/dano.mp3");
    this.load.audio("kill", "assets/muerte.mp3");
  }

  // Runs once, after all assets in preload are loaded
  create() {
    // Create map
    const map = this.make.tilemap({ key: "map" });

    // Add tileset in the map
    // map.addTilesetImage('keyWord from Tiled tileset', 'keyWord from preload');
    const skyTile = map.addTilesetImage("fondo", "sky");

    // Add layers in the map
    // Careful with the order of layers! Must to be like in Tiled
    // map.createLayer('keyWord from Tiled layer', 'variable of map.addTilesetImage', x, y);
    map.createLayer("Fondo", skyTile);

    const floor = map.createLayer("Suelo", skyTile);
    // This is to make everything collide with the floor
    floor.setCollisionByExclusion([-1], true);

    // Create player
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);

    this.player2 = this.physics.add.sprite(350, 100, "player2");
    this.player2.setFlipX(true);
    this.player2.setCollideWorldBounds(true);

    this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.J = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

    this.I = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

    this.L = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

    this.Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    this.P = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this.physics.add.collider(this.player, floor);
    this.physics.add.collider(this.player2, floor);
    this.jump_sound = this.sound.add("jump", { volume: 1, loop: false });
    this.jump2_sound = this.sound.add("jump", { volume: 1, loop: false });
    this.attack1_sound = this.sound.add("attack1", { volume: 1, loop: false });
    this.attack2_sound = this.sound.add("attack2", { volume: 1, loop: false });
    this.damage_sound = this.sound.add("damage", { volume: 1, loop: false });
    this.kill_sound = this.sound.add("kill", { volume: 1, loop: false });
    this.steps_sound = this.sound.add("steps", { volume: 1, loop: false });
    this.steps2_sound = this.sound.add("steps", { volume: 1, loop: false });
    this.player.setGravityY(200);
    this.player2.setGravityY(200);

    this.player.anims.create({
      key: "move",
      frames: this.anims.generateFrameNames("player", {
        prefix: "move_",
        start: 1,
        end: 2,
        zeroPad: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.player.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNames("player", {
        prefix: "idle_",
        start: 1,
        end: 7,
        zeroPad: 2,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.player.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNames("player", {
        prefix: "attack_",
        start: 1,
        end: 10,
        zeroPad: 2,
      }),
      frameRate: 7,
      repeat: 0,
    });

    this.player.on("animationcomplete-attack", () => {
      this.isAttacking = false; // End of attack
      this.player.anims.play("idle", true); // Return to idle animation
    });

    this.player.anims.create({
      key: "damage",
      frames: this.anims.generateFrameNames("player", {
        prefix: "damage_",
        start: 1,
        end: 2,
        zeroPad: 2,
      }),
      frameRate: 4,
      repeat: 0,
    });

    this.player.anims.create({
      key: "kill",
      frames: this.anims.generateFrameNames("player", {
        prefix: "kill_",
        start: 1,
        end: 6,
        zeroPad: 2,
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.player2.anims.create({
      key: "move",
      frames: this.anims.generateFrameNames("player2", {
        prefix: "move_",
        start: 1,
        end: 2,
        zeroPad: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.player2.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNames("player2", {
        prefix: "idle_",
        start: 1,
        end: 7,
        zeroPad: 2,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.player2.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNames("player2", {
        prefix: "attack_",
        start: 1,
        end: 6,
        zeroPad: 2,
      }),
      frameRate: 7,
      repeat: 0,
    });

    this.player2.on("animationcomplete-attack", () => {
      this.isAttackingP2 = false; // End of attack
      this.player.anims.play("idle", true); // Return to idle animation
    });

    this.player2.anims.create({
      key: "damage",
      frames: this.anims.generateFrameNames("player2", {
        prefix: "damage_",
        start: 1,
        end: 2,
        zeroPad: 2,
      }),
      frameRate: 7,
      repeat: 0,
    });

    this.player2.anims.create({
      key: "kill",
      frames: this.anims.generateFrameNames("player2", {
        prefix: "kill_",
        start: 1,
        end: 6,
        zeroPad: 2,
      }),
      frameRate: 5,
      repeat: 0,
    });

    map.createLayer("Ground_Layer", skyTile);

    this.physics.add.overlap(this.player, this.player2, null);

    // Create containers for health bars
    this.createHealthBar(20, 20, 1); // Player 1
    this.createHealthBar(480 - 120, 20, 2); // Player 2

    this.attackHitbox1 = this.add
      .rectangle(0, 0, 20, 20, 0xff0000, 0)
      .setOrigin(0.5);
    this.attackHitbox2 = this.add
      .rectangle(0, 0, 20, 20, 0x0000ff, 0)
      .setOrigin(0.5);
    this.physics.add.existing(this.attackHitbox1, false);
    this.physics.add.existing(this.attackHitbox2, false);

    this.physics.add.overlap(this.attackHitbox1, this.player2, () => {
      if (this.isAttacking) {
        this.player2Hp -= 10;
      }
    });

    this.physics.add.overlap(this.attackHitbox2, this.player, () => {
      if (this.isAttackingP2) {
        this.player1Hp -= 10;
      }
    });

    this.killHitbox1 = null;
    this.killHitbox2 = null;
  }

  createHealthBar(x, y, playerNum) {
    // Main container
    const container = this.add.container(x, y);

    // Background bar (black)
    const bgBar = this.add.rectangle(0, 0, 100, 15, 0x000000);
    bgBar.setOrigin(0, 0);

    // Health bar (red for P1, blue for P2)
    const healthBar = this.add.rectangle(
      2,
      2,
      96,
      11,
      playerNum === 1 ? 0xff0000 : 0x0000ff
    );
    healthBar.setOrigin(0, 0);

    // Border of the bar (white)
    const border = this.add.rectangle(0, 0, 100, 15, 0xffffff);
    border.setOrigin(0, 0);
    border.setStrokeStyle(1, 0xffffff);
    border.setFillStyle();

    // Player text
    const text = this.add.text(-5, -20, `P${playerNum}`, {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    });

    // Add everything to the container
    container.add([bgBar, healthBar, border, text]);

    // Save reference to health bar
    if (playerNum === 1) {
      this.healthBarP1 = healthBar;
    } else {
      this.healthBarP2 = healthBar;
    }
  }

  // Runs once per frame for the duration of the scene
  update() {
    // Player 1 movement logic
    if (!this.isAttacking && this.player1Alive) {
      if (this.A.isDown) {
        this.player.setVelocityX(-150);
        this.player.setFlipX(true);
        this.player.anims.play("move", true);
        if (!this.steps_sound.isPlaying) this.steps_sound.play(); // Check if already playing
      } else if (this.D.isDown) {
        this.player.setVelocityX(150);
        this.player.setFlipX(false);
        this.player.anims.play("move", true);
        if (!this.steps_sound.isPlaying) this.steps_sound.play(); // Check if already playing
      } else {
        this.player.setVelocityX(0);
        if (
          !this.player.anims.isPlaying ||
          this.player.anims.currentAnim.key !== "damage"
        ) {
          this.player.anims.play("idle", true);
        }
        this.steps_sound.stop(); // Stop sound if not moving
      }

      if (this.W.isDown && this.player.body.onFloor()) {
        this.player.setVelocityY(-140);
        this.jump_sound.play();
      }
    } else {
      this.steps_sound.stop(); // Make sure to stop sound if dead
    }

    // Player 2 movement logic
    if (!this.isAttackingP2 && this.player2Alive) {
      if (this.J.isDown) {
        this.player2.setVelocityX(-150);
        this.player2.setFlipX(true);
        this.player2.anims.play("move", true);
        if (!this.steps2_sound.isPlaying) this.steps2_sound.play(); // Check if already playing
      } else if (this.L.isDown) {
        this.player2.setVelocityX(150);
        this.player2.setFlipX(false);
        this.player2.anims.play("move", true);
        if (!this.steps2_sound.isPlaying) this.steps2_sound.play(); // Check if already playing
      } else {
        this.player2.setVelocityX(0);
        if (
          !this.player2.anims.isPlaying ||
          this.player2.anims.currentAnim.key !== "damage"
        ) {
          this.player2.anims.play("idle", true);
        }
        this.steps2_sound.stop(); // Stop sound if not moving
      }

      if (this.I.isDown && this.player2.body.onFloor()) {
        this.player2.setVelocityY(-140);
        this.jump2_sound.play();
      }
    } else {
      this.steps2_sound.stop(); // Make sure to stop sound if dead
    }

    // Attacks
    if (this.Q.isDown && !this.isAttacking && this.player1Alive) {
      this.isAttacking = true;
      this.player.anims.play("attack", true);
      this.attack1_sound.play();

      // Delay hitbox creation
      this.time.delayedCall(500, () => {
        this.createHitbox(this.player, this.player2);
      });

      // Reset isAttacking after 800ms in case animation doesn't end
      this.time.delayedCall(800, () => {
        this.isAttacking = false;
      });
    }

    if (this.P.isDown && !this.isAttackingP2 && this.player2Alive) {
      this.isAttackingP2 = true;
      this.player2.anims.play("attack", true);
      this.attack2_sound.play();

      // Delay hitbox creation
      this.time.delayedCall(500, () => {
        this.createHitbox(this.player2, this.player);
      });

      // Reset isAttackingP2 after 800ms in case animation doesn't end
      this.time.delayedCall(800, () => {
        this.isAttackingP2 = false;
      });
    }

    if (!this.player1Alive) {
      this.time.delayedCall(1500, () => {
        this.scene.start("VictoryScene", {
          winner: "Player 2",
          player1Wins: this.player1Wins,
          player2Wins: this.player2Wins,
        });
        this.resetGame();
      });
    }

    if (!this.player2Alive) {
      this.time.delayedCall(1500, () => {
        this.scene.start("VictoryScene", {
          winner: "Player 1",
          player1Wins: this.player1Wins,
          player2Wins: this.player2Wins,
        });
        this.resetGame();
      });
    }
  }

  updateHealthBar(playerNum, health) {
    const healthBar = playerNum === 1 ? this.healthBarP1 : this.healthBarP2;
    const width = (health / 100) * 96; // 96 is the maximum width of the inner bar

    // Smooth animation of the health bar
    this.tweens.add({
      targets: healthBar,
      width: width,
      duration: 200,
      ease: "Power1",
    });
  }

  createHitbox(attacker, target) {
    const offsetX = attacker.flipX ? -15 : 15;
    const hitbox = this.physics.add
      .sprite(attacker.x + offsetX, attacker.y, null)
      .setSize(2, 10)
      .setAlpha(0)
      .setOrigin(0.5, 0.5)
      .setImmovable(true);

    this.physics.add.overlap(hitbox, target, () => {
      if (target === this.player && this.player1Hp > 0) {
        this.damage_sound.play();
        this.player1Hp -= 10;
        this.updateHealthBar(1, this.player1Hp); // Update P1 health bar

        if (this.player1Hp > 0) {
          this.player.anims.play("damage", true);
        } else {
          this.player.anims.stop();
          this.kill_sound.play();
          this.player.anims.play("kill", true);
          this.player.setVelocity(0);
          this.player1Alive = false;
          this.player.setVelocityX(0);
          this.player.body.setSize(10, 1);
        }
      } else if (target === this.player2 && this.player2Hp > 0) {
        this.damage_sound.play();
        this.player2Hp -= 10;
        this.updateHealthBar(2, this.player2Hp); // Update P2 health bar

        if (this.player2Hp > 0) {
          this.player2.anims.play("damage", true);
        } else {
          this.player2.anims.play("kill", true);
          this.player2.setVelocity(0);
          this.player2Alive = false;
          this.player2.body.setSize(10, 1);
          this.kill_sound.play();
        }
      }

      hitbox.destroy();
    });

    this.time.delayedCall(100, () => {
      if (hitbox.active) {
        hitbox.destroy();
      }
    });
  }

  resetGame() {
    this.player1Hp = 100;
    this.player2Hp = 100;
    this.player1Alive = true;
    this.player2Alive = true;
    this.isAttacking = false;
    this.isAttackingP2 = false;

    // Update health bars
    this.updateHealthBar(1, this.player1Hp);
    this.updateHealthBar(2, this.player2Hp);

    this.player.setPosition(100, 100).setFlipX(false);
    this.player.setVelocity(0, 0);
    this.player.anims.play("idle", true);

    this.player2.setPosition(350, 100).setFlipX(true);
    this.player2.setVelocity(0, 0);
    this.player2.anims.play("idle", true);

    this.steps_sound.stop();
    this.steps2_sound.stop();
    this.attack1_sound.stop();
    this.attack2_sound.stop();
  }
}