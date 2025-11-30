# 🚗 Rush Hour - Sliding Block Puzzle Game

A web-based implementation of the classic Rush Hour puzzle game. Move the red car to the exit by sliding other vehicles out of the way!

![Rush Hour Game](https://img.shields.io/badge/Game-Rush%20Hour-red)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Supported-orange)
![CSS3](https://img.shields.io/badge/CSS3-Flexbox%20%26%20Grid-blue)

## 🎮 How to Play

1. **Objective**: Move the red car (🚗) to the exit on the right side of the board
2. **Controls**: Click and drag vehicles to slide them
3. **Rules**: 
   - Vehicles can only move in their orientation (horizontal or vertical)
   - Vehicles cannot pass through each other
   - Clear a path for the red car to reach the exit

## 🚀 Getting Started

Simply open `index.html` in your web browser to start playing!

```bash
# Or use a local server (optional)
npx serve .
```

## 📁 Project Structure

```
rush-hour/
├── index.html        # Main game HTML file
├── styles.css        # Game styling and animations
├── game.js           # Game logic with solver
├── levels.js         # Level definitions (shared source)
├── level-tester.js   # CLI tool for testing & generating levels
├── level-tools.html  # Browser-based level tools UI
└── README.md         # This file
```

## ✨ Features

### Game Features
- 🎯 **8 challenging levels** (Easy to Hard)
- 📱 **Responsive design** (works on mobile and desktop)
- 🖱️ **Drag and drop** controls with smooth animations
- 📊 **Move counter** with optimal move display
- 🔄 **Reset** and level navigation
- 🎉 **Win celebration** with star rating
- 🚗 **Exit animation** when the red car escapes

### Solver & Hints
- 🧠 **BFS Solver** - Finds the optimal solution for any level
- 💡 **Solution button** - Shows step-by-step optimal solution
- ▶️ **Play solution** - Watch the puzzle solve itself
- ⭐ **Star rating** - Compare your moves to the optimal

### Level Tools
- 🧪 **Level validator** - Checks for overlaps and solvability
- 🎲 **Level generator** - Automatically creates new valid puzzles
- 📝 **Auto-save** - Generated levels append directly to `levels.js`

## 🛠️ Level Tools

### Command Line (Node.js)

```bash
# Test all levels for validity
node level-tester.js test

# Generate new levels (preview only)
node level-tester.js generate [count] [minMoves] [maxMoves] [vehicles]

# Generate and automatically save to levels.js
node level-tester.js generate 3 5 15 8 --save

# Show help
node level-tester.js help
```

**Examples:**
```bash
# Generate 6 easy levels (5-10 moves, 7 vehicles)
node level-tester.js generate 6 5 10 7 --save

# Generate 3 hard levels (15-25 moves, 10 vehicles)
node level-tester.js generate 3 15 25 10 --save
```

### Browser-Based Tools

Open `level-tools.html` in your browser for a visual interface:
- Test existing levels with grid preview
- Generate new levels with configurable difficulty
- Copy generated level code to clipboard

## 🎨 Vehicle Types

| Type | Size | Description |
|------|------|-------------|
| 🚗 Red Car | 2 cells | Main vehicle - get it to the exit! |
| 🚙 Cars | 2 cells | Blocking vehicles |
| 🚛 Trucks | 3 cells | Longer blocking vehicles |

## 📊 Level Difficulty

| Level | Minimum Moves | Difficulty |
|-------|---------------|------------|
| 1 | 2 | ⭐ Easy |
| 2 | 4 | ⭐ Easy |
| 3 | 4 | ⭐⭐ Medium |
| 4 | 3 | ⭐ Easy |
| 5 | 5 | ⭐⭐ Medium |
| 6 | 6 | ⭐⭐⭐ Hard |
| 7 | 5 | ⭐⭐ Medium |
| 8 | 8 | ⭐⭐⭐ Hard |

## 🧠 How the Solver Works

The game includes a **Breadth-First Search (BFS)** solver that:
1. Explores all possible board states
2. Finds the shortest path to the solution
3. Returns the optimal sequence of moves

This ensures:
- Every generated level is **guaranteed solvable**
- The **optimal move count** is always known
- Players can get **hints** when stuck

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, animations, gradients
- **JavaScript ES6+** - Classes, modules, async operations
- **Node.js** - Level testing and generation tools (optional)

## 🎯 Algorithm Details

### Solver (BFS)
```
1. Start with initial board state
2. Add to queue with empty move list
3. While queue not empty:
   a. Get next state from queue
   b. Generate all possible moves
   c. For each move, if not visited:
      - If win state → return moves
      - Add to queue with updated moves
4. Return null (no solution)
```

### Level Generator
```
1. Place red car on row 2 (random column 0-2)
2. Randomly place additional vehicles:
   - 70% chance of car (length 2)
   - 30% chance of truck (length 3)
   - 50% horizontal, 50% vertical
3. Validate: no overlaps, bounds check
4. Solve with BFS to verify solvability
5. Check if solution length is within target range
6. Repeat until valid level found
```

## � Docker

### Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The game will be available at: http://localhost:8080

### Using Docker Directly

```bash
# Build the image
docker build -t rush-hour-game .

# Run the container
docker run -d -p 8080:80 --name rush-hour rush-hour-game

# Stop and remove
docker stop rush-hour && docker rm rush-hour
```

### Pull from GitHub Container Registry

```bash
# Pull the latest image
docker pull ghcr.io/wagnerluca/rush-hour:latest

# Run from registry
docker run -d -p 8080:80 ghcr.io/wagnerluca/rush-hour:latest
```

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. **Validates Levels** - Runs the level tester to ensure all puzzles are valid and solvable
2. **Builds Docker Image** - Creates an optimized nginx-based container
3. **Pushes to Registry** - Publishes to GitHub Container Registry (ghcr.io)

### Pipeline Triggers
- Push to `main` or `master` branch
- Pull requests to `main` or `master`
- Manual trigger via workflow dispatch

### Pipeline Status
![CI/CD](https://github.com/WagnerLuca/rush-hour/actions/workflows/ci-cd.yml/badge.svg)

## �📝 License

MIT License

## 🤝 Contributing

Feel free to:
- Add more levels using the generator
- Improve the UI/UX
- Optimize the solver
- Add new features

---

Made with ❤️ and JavaScript