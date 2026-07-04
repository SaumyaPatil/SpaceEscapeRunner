🚀 Space Escape Runner

A simple, fast-paced arcade dodge game built with React Native and Expo. Pilot your spaceship, dodge falling asteroids, rack up your score, and beat your personal high score!

Built entirely with React Native View components and shapes — no image assets required.


🎮 Gameplay


Move your spaceship left and right to avoid falling asteroids.
Every asteroid you dodge increases your score.
One collision ends the game.
Your highest score is saved locally and persists across sessions.



✨ Features


Pure shape-based graphics — spaceship and asteroids drawn using React Native Views and styling, no images.
Left / right movement controls with screen-boundary detection.
Falling asteroids spawned at random positions with a continuous game loop.
Collision detection between the spaceship and asteroids.
Game Over screen with final score.
Restart functionality that fully resets the game state.
Persistent high score stored on-device using AsyncStorage.
Modern UI with a gradient background and smooth animations.



🛠️ Tech Stack


React Native
Expo
AsyncStorage — local high-score persistence
expo-linear-gradient — gradient background



📋 Prerequisites

Before running the project, make sure you have:


Node.js (LTS version recommended)
npm (comes with Node.js) or yarn
Expo Go app installed on your Android/iOS device
A code editor such as VS Code



🚀 Getting Started

1. Clone the repository

bash: git clone https://github.com/SaumyaPatil/SpaceEscapeRunner.git

bash: cd SpaceEscapeRunner

2. Install dependencies

bash: npm install

3. Start the development server

bash: npx expo start

4. Run the app


Open the Expo Go app on your phone.
Scan the QR code shown in the terminal or browser.
The app will load on your device.


You can also press a to open on an Android emulator or i for an iOS simulator.


📦 Building for Android

This project uses EAS Build to generate installable Android files.

Generate an APK (for direct install / testing):

bash: eas build -p android --profile preview

Generate an AAB (for Google Play Store submission):

bash: eas build -p android --profile production


📁 Project Structure

SpaceEscapeRunner/
├── App.js              # Main game logic and UI
├── assets/             # App icon and splash assets
├── app.json            # Expo configuration
├── eas.json            # EAS build configuration
├── package.json        # Dependencies and scripts
└── README.md


🎯 How to Play


Tap Start Game.
Use Move Left and Move Right to steer your spaceship.
Dodge the falling asteroids.
Survive as long as you can and beat your high score!
Tap Restart after a Game Over to play again.



🗺️ Roadmap / Future Improvements


Increasing difficulty (asteroid speed ramps up over time)
Multiple asteroids on screen at once
Sound effects and background music
Power-ups and shields
Global leaderboard



🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.


📄 License

This project is licensed under the MIT License — see the LICENSE file for details.


👤 Author

Saumya Patil
Built as a beginner-friendly React Native + Expo learning project.


GitHub: @SaumyaPatil
