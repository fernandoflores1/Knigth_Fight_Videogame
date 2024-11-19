// VictoryScene.js - Scene that displays when a player wins the game
export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super("VictoryScene");
  }

  // Initialize scene with data passed from the previous scene
  init(data) {
    this.winner = data.winner;
    this.player1Wins = data.player1Wins;
    this.player2Wins = data.player2Wins;
  }

  create() {
    // Update win counters based on the winner
    if (this.winner === "Player 1") {
      this.player1Wins += 1;
    } else if (this.winner === "Player 2") {
      this.player2Wins += 1;
    }

    // Create particle effect for the background
    // Parameters:
    // - speed: how fast particles move
    // - scale: particles start at 0.7 size and fade to 0
    // - blendMode: ADD makes particles look brighter
    // - lifespan: particles last 1 second
    // - quantity: emit 1 particle at a time
    const particles = this.add.particles(0, 0, "particle", {
      speed: 50,
      scale: { start: 0.7, end: 0 },
      blendMode: "ADD",
      lifespan: 1000,
      quantity: 1,
      emitting: true,
    });

    // Create the victory message text with special styling
    // Style includes:
    // - Large yellow text (40px)
    // - Black outline for better visibility
    // - Drop shadow effect for depth
    const victoryText = this.add
      .text(
        240, // x position centered
        90, // y position near top
        `${this.winner} WINS!`,
        {
          fontSize: "40px",
          fontFamily: "Arial Black",
          color: "#ffff00", // Bright yellow color
          stroke: "#000000", // Black outline
          strokeThickness: 6, // Thick outline for emphasis
          shadow: {
            color: "#000000",
            fill: true,
            offsetX: 1,
            offsetY: 1,
            blur: 4, // Soft shadow effect
          },
        }
      )
      .setOrigin(0.5); // Center the text at its position

    // Add a bouncing animation to the victory text
    // Text starts small (0.5) and bounces to full size (1)
    this.tweens.add({
      targets: victoryText,
      scale: { from: 0.5, to: 1 },
      duration: 1000, // Animation lasts 1 second
      ease: "Bounce.easeOut", // Bouncy effect at the end
    });

    // Create instruction text with simple styling
    // Style includes:
    // - Smaller green text (16px)
    // - Thin black outline
    const instructions = this.add
      .text(
        240, // x position centered
        200, // y position below victory text
        "Press any key to return to scoreboard",
        {
          fontSize: "16px",
          fontFamily: "Arial",
          color: "#00ff00", // Bright green color
          stroke: "#000000", // Black outline
          strokeThickness: 2, // Thin outline for readability
        }
      )
      .setOrigin(0.5); // Center the text at its position

    // Add a blinking effect to the instruction text
    // Alpha transitions between full (1) and half (0.5) opacity
    this.tweens.add({
      targets: instructions,
      alpha: 0.5,
      duration: 500, // Half second for each blink
      ease: "Linear",
      yoyo: true, // Go back and forth
      repeat: -1, // Repeat forever
    });

    // Add keyboard input to return to score screen
    // When any key is pressed, switch to MarkerScene and pass the updated scores
    this.input.keyboard.once("keydown", () => {
      this.scene.start("MarkerScene", {
        player1Wins: this.player1Wins,
        player2Wins: this.player2Wins,
      });
    });
  }
}
