import Phaser from "phaser";

export default class MarkerScene extends Phaser.Scene {
  constructor() {
    super("MarkerScene");
  }

  // Initialize scene with previous score data
  init(data) {
    this.player1Wins = data.player1Wins || 0;
    this.player2Wins = data.player2Wins || 0;
  }

  create() {
    // Create a gradient background
    // Uses dark blue colors (0x000033 to 0x000066) for a space-like effect
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x000033, 0x000033, 0x000066, 0x000066, 1);
    gradient.fillRect(0, 0, 480, 240); // Fills the entire game area

    // Create the main title with special effects
    // Style includes:
    // - Large white text (32px)
    // - Blue outline for depth
    // - Positioned at the top center of the screen
    const title = this.add
      .text(240, 30, "SCORE", {
        fontSize: "32px",
        fontFamily: "Arial Black",
        color: "#ffffff", // White text
        stroke: "#4444ff", // Blue outline
        strokeThickness: 4, // Thick outline for emphasis
      })
      .setOrigin(0.5); // Center the text

    // Add a pulsing shine effect to the title
    // Alpha transitions between full and 80% opacity
    this.tweens.add({
      targets: title,
      alpha: 0.8,
      duration: 1500, // 1.5 seconds per pulse
      ease: "Sine.easeInOut", // Smooth transition
      yoyo: true, // Go back and forth
      repeat: -1, // Repeat forever
    });

    // Create a container for the score display
    // Positioned below the title
    const scoreContainer = this.add.container(240, 90);

    // Add decorative frame around scores
    // Style includes:
    // - Blue outline
    // - Rounded corners
    // - Semi-transparent dark blue fill
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x4444ff, 1); // Blue outline, 2px thick
    graphics.strokeRoundedRect(-100, -30, 200, 80, 10); // Rounded rectangle
    graphics.fillStyle(0x000033, 0.5); // Semi-transparent dark blue
    graphics.fillRoundedRect(-100, -30, 200, 80, 10);
    scoreContainer.add(graphics);

    // Create Player 1 score text
    // Style includes:
    // - Medium cyan text (20px)
    // - Positioned at the top of the container
    const player1Score = this.add.text(
      -80,
      -20,
      `Player 1: ${this.player1Wins}`,
      {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#00ffff", // Cyan color
      }
    );

    // Create Player 2 score text
    // Style includes:
    // - Medium magenta text (20px)
    // - Positioned below Player 1 score
    const player2Score = this.add.text(
      -80,
      15,
      `Player 2: ${this.player2Wins}`,
      {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ff00ff", // Magenta color
      }
    );

    // Add both score texts to the container
    scoreContainer.add(player1Score);
    scoreContainer.add(player2Score);

    // Create a container for the play button
    // Positioned at the bottom of the screen
    const playButton = this.add.container(240, 180);

    // Create the play button background
    // Style includes:
    // - Semi-transparent green fill
    // - Green outline
    // - Rounded corners
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x00ff00, 0.3); // Semi-transparent green
    buttonBg.fillRoundedRect(-70, -20, 140, 40, 8); // Rounded rectangle
    buttonBg.lineStyle(2, 0x00ff00, 1); // Green outline
    buttonBg.strokeRoundedRect(-70, -20, 140, 40, 8);

    // Create the play button text
    // Style includes:
    // - Large white text (24px)
    // - Centered in the button
    const buttonText = this.add
      .text(0, 0, "PLAY", {
        fontSize: "24px",
        fontFamily: "Arial Black",
        color: "#ffffff", // White text
      })
      .setOrigin(0.5);

    // Add background and text to the button container
    playButton.add(buttonBg);
    playButton.add(buttonText);

    // Make the button interactive
    // Create a rectangular hit area for the button
    playButton.setInteractive(
      new Phaser.Geom.Rectangle(-70, -20, 140, 40),
      Phaser.Geom.Rectangle.Contains
    );

    // Add hover effect (brighten button)
    playButton.on("pointerover", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x00ff00, 0.5); // More opaque green
      buttonBg.fillRoundedRect(-70, -20, 140, 40, 8);
      buttonBg.lineStyle(2, 0x00ff00, 1);
      buttonBg.strokeRoundedRect(-70, -20, 140, 40, 8);
    });

    // Remove hover effect (return to normal opacity)
    playButton.on("pointerout", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x00ff00, 0.3); // Original transparency
      buttonBg.fillRoundedRect(-70, -20, 140, 40, 8);
      buttonBg.lineStyle(2, 0x00ff00, 1);
      buttonBg.strokeRoundedRect(-70, -20, 140, 40, 8);
    });

    // Handle button click
    // Start the game scene and pass the current scores
    playButton.on("pointerdown", () => {
      this.scene.start("GameScene", {
        player1Wins: this.player1Wins,
        player2Wins: this.player2Wins,
      });
    });
  }
}
