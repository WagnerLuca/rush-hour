/**
 * Rush Hour Level Testing & Generation Script
 * Run with: node level-tester.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// RUSH HOUR SOLVER (same logic as game.js)
// ============================================
class RushHourSolver {
    static solve(vehicles) {
        const startState = this.vehiclesToState(vehicles);
        
        if (this.isWinState(startState, vehicles)) {
            return [];
        }
        
        const queue = [{ state: startState, moves: [] }];
        const visited = new Set();
        visited.add(this.stateToString(startState));
        
        while (queue.length > 0) {
            const { state, moves } = queue.shift();
            const possibleMoves = this.generateMoves(state, vehicles);
            
            for (const move of possibleMoves) {
                const newState = this.applyMove(state, move, vehicles);
                const stateStr = this.stateToString(newState);
                
                if (!visited.has(stateStr)) {
                    visited.add(stateStr);
                    const newMoves = [...moves, move];
                    
                    if (this.isWinState(newState, vehicles)) {
                        return newMoves;
                    }
                    
                    queue.push({ state: newState, moves: newMoves });
                }
            }
        }
        
        return null;
    }
    
    static vehiclesToState(vehicles) {
        const state = {};
        vehicles.forEach(v => {
            state[v.id] = { row: v.row, col: v.col };
        });
        return state;
    }
    
    static stateToString(state) {
        return JSON.stringify(state);
    }
    
    static isWinState(state, vehicles) {
        return state['X'].col === 4;
    }
    
    static buildGrid(state, vehicles) {
        const grid = Array(6).fill(null).map(() => Array(6).fill(null));
        vehicles.forEach(v => {
            const pos = state[v.id];
            for (let i = 0; i < v.length; i++) {
                const row = v.orientation === 'h' ? pos.row : pos.row + i;
                const col = v.orientation === 'h' ? pos.col + i : pos.col;
                if (row >= 0 && row < 6 && col >= 0 && col < 6) {
                    grid[row][col] = v.id;
                }
            }
        });
        return grid;
    }
    
    static generateMoves(state, vehicles) {
        const moves = [];
        const grid = this.buildGrid(state, vehicles);
        
        vehicles.forEach(v => {
            const pos = state[v.id];
            const isHorizontal = v.orientation === 'h';
            
            if (isHorizontal) {
                for (let newCol = pos.col - 1; newCol >= 0; newCol--) {
                    if (grid[pos.row][newCol] === null) {
                        moves.push({ id: v.id, row: pos.row, col: newCol });
                    } else break;
                }
                for (let newCol = pos.col + 1; newCol <= 6 - v.length; newCol++) {
                    if (grid[pos.row][pos.col + v.length + (newCol - pos.col - 1)] === null) {
                        moves.push({ id: v.id, row: pos.row, col: newCol });
                    } else break;
                }
            } else {
                for (let newRow = pos.row - 1; newRow >= 0; newRow--) {
                    if (grid[newRow][pos.col] === null) {
                        moves.push({ id: v.id, row: newRow, col: pos.col });
                    } else break;
                }
                for (let newRow = pos.row + 1; newRow <= 6 - v.length; newRow++) {
                    if (grid[pos.row + v.length + (newRow - pos.row - 1)][pos.col] === null) {
                        moves.push({ id: v.id, row: newRow, col: pos.col });
                    } else break;
                }
            }
        });
        
        return moves;
    }
    
    static applyMove(state, move, vehicles) {
        const newState = { ...state };
        newState[move.id] = { row: move.row, col: move.col };
        return newState;
    }
    
    static validateLevel(level) {
        const vehicles = level.vehicles;
        const grid = Array(6).fill(null).map(() => Array(6).fill(null));
        
        for (const v of vehicles) {
            for (let i = 0; i < v.length; i++) {
                const row = v.orientation === 'h' ? v.row : v.row + i;
                const col = v.orientation === 'h' ? v.col + i : v.col;
                
                if (row < 0 || row >= 6 || col < 0 || col >= 6) {
                    return { valid: false, error: `Vehicle ${v.id} is out of bounds at (${row}, ${col})` };
                }
                
                if (grid[row][col] !== null) {
                    return { valid: false, error: `Vehicle ${v.id} overlaps with ${grid[row][col]} at (${row}, ${col})` };
                }
                
                grid[row][col] = v.id;
            }
        }
        
        const redCar = vehicles.find(v => v.id === 'X');
        if (!redCar) {
            return { valid: false, error: 'No red car (X) found' };
        }
        if (redCar.row !== 2 || redCar.orientation !== 'h') {
            return { valid: false, error: 'Red car must be horizontal on row 2' };
        }
        
        const solution = this.solve(vehicles);
        if (solution === null) {
            return { valid: false, error: 'Level is not solvable' };
        }
        
        return { valid: true, solution, minMoves: solution.length };
    }
    
    static printGrid(vehicles) {
        const state = this.vehiclesToState(vehicles);
        const grid = this.buildGrid(state, vehicles);
        
        console.log('  0 1 2 3 4 5');
        console.log('  +-----------+');
        for (let row = 0; row < 6; row++) {
            let line = row + '|';
            for (let col = 0; col < 6; col++) {
                line += grid[row][col] ? grid[row][col] : '.';
                line += ' ';
            }
            line += '|';
            if (row === 2) line += ' → EXIT';
            console.log(line);
        }
        console.log('  +-----------+');
    }
}

// ============================================
// LEVEL GENERATOR
// ============================================
class LevelGenerator {
    static colors = ['blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'lime', 'brown', 'gray'];
    static vehicleIds = 'ABCDEFGHIJKLMNOP'.split('');
    
    static generateLevel(targetMinMoves, targetMaxMoves, numVehicles, maxAttempts = 1000) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const vehicles = this.createRandomLayout(numVehicles);
            
            if (vehicles) {
                const validation = RushHourSolver.validateLevel({ vehicles });
                
                if (validation.valid && 
                    validation.minMoves >= targetMinMoves && 
                    validation.minMoves <= targetMaxMoves) {
                    return {
                        vehicles,
                        minMoves: validation.minMoves,
                        solution: validation.solution,
                        attempts: attempt + 1
                    };
                }
            }
        }
        
        return null;
    }
    
    static createRandomLayout(numVehicles) {
        const grid = Array(6).fill(null).map(() => Array(6).fill(null));
        const vehicles = [];
        
        // Place red car (X) on row 2, random starting column (0-2)
        const redCol = Math.floor(Math.random() * 3);
        const redCar = {
            id: 'X',
            row: 2,
            col: redCol,
            length: 2,
            orientation: 'h',
            color: 'red'
        };
        
        if (!this.placeVehicle(grid, redCar)) {
            return null;
        }
        vehicles.push(redCar);
        
        // Place other vehicles
        let colorIndex = 0;
        let idIndex = 0;
        
        for (let i = 1; i < numVehicles; i++) {
            const placed = this.tryPlaceRandomVehicle(grid, vehicles, idIndex, colorIndex);
            if (placed) {
                idIndex++;
                colorIndex = (colorIndex + 1) % this.colors.length;
            }
        }
        
        // Must have at least a few vehicles besides red car
        if (vehicles.length < 4) {
            return null;
        }
        
        return vehicles;
    }
    
    static tryPlaceRandomVehicle(grid, vehicles, idIndex, colorIndex) {
        const maxTries = 50;
        
        for (let t = 0; t < maxTries; t++) {
            const length = Math.random() < 0.7 ? 2 : 3;
            const orientation = Math.random() < 0.5 ? 'h' : 'v';
            
            let row, col;
            if (orientation === 'h') {
                row = Math.floor(Math.random() * 6);
                col = Math.floor(Math.random() * (7 - length));
            } else {
                row = Math.floor(Math.random() * (7 - length));
                col = Math.floor(Math.random() * 6);
            }
            
            const vehicle = {
                id: this.vehicleIds[idIndex],
                row,
                col,
                length,
                orientation,
                color: this.colors[colorIndex]
            };
            
            if (this.canPlace(grid, vehicle)) {
                this.placeVehicle(grid, vehicle);
                vehicles.push(vehicle);
                return true;
            }
        }
        
        return false;
    }
    
    static canPlace(grid, vehicle) {
        for (let i = 0; i < vehicle.length; i++) {
            const row = vehicle.orientation === 'h' ? vehicle.row : vehicle.row + i;
            const col = vehicle.orientation === 'h' ? vehicle.col + i : vehicle.col;
            
            if (row < 0 || row >= 6 || col < 0 || col >= 6) {
                return false;
            }
            if (grid[row][col] !== null) {
                return false;
            }
        }
        return true;
    }
    
    static placeVehicle(grid, vehicle) {
        if (!this.canPlace(grid, vehicle)) {
            return false;
        }
        
        for (let i = 0; i < vehicle.length; i++) {
            const row = vehicle.orientation === 'h' ? vehicle.row : vehicle.row + i;
            const col = vehicle.orientation === 'h' ? vehicle.col + i : vehicle.col;
            grid[row][col] = vehicle.id;
        }
        return true;
    }
    
    static formatLevelCode(vehicles, levelNum, minMoves) {
        let code = `            // Level ${levelNum} (${minMoves} moves minimum)\n`;
        code += '            {\n';
        code += '                vehicles: [\n';
        
        vehicles.forEach((v, i) => {
            code += `                    { id: '${v.id}', row: ${v.row}, col: ${v.col}, length: ${v.length}, orientation: '${v.orientation}', color: '${v.color}' }`;
            code += i < vehicles.length - 1 ? ',\n' : '\n';
        });
        
        code += '                ]\n';
        code += '            }';
        return code;
    }
}

// ============================================
// MAIN SCRIPT
// ============================================

// Load levels from external file
const { RUSH_HOUR_LEVELS } = require('./levels.js');

function testLevels() {
    console.log('\n========================================');
    console.log('🧪 RUSH HOUR LEVEL TESTER');
    console.log('========================================\n');
    
    let validCount = 0;
    let invalidCount = 0;
    
    RUSH_HOUR_LEVELS.forEach((level, index) => {
        console.log(`\n--- Level ${index + 1} ---`);
        RushHourSolver.printGrid(level.vehicles);
        
        const result = RushHourSolver.validateLevel(level);
        
        if (result.valid) {
            validCount++;
            console.log(`✓ Valid (${result.minMoves} moves minimum)`);
        } else {
            invalidCount++;
            console.log(`✗ Invalid: ${result.error}`);
        }
    });
    
    console.log('\n========================================');
    console.log(`Summary: ${validCount} valid, ${invalidCount} invalid out of ${RUSH_HOUR_LEVELS.length} levels`);
    console.log('========================================\n');
    
    return invalidCount === 0;
}

function generateLevels(count = 6, minMoves = 5, maxMoves = 15, numVehicles = 8, autoAppend = false) {
    console.log('\n========================================');
    console.log('🎲 RUSH HOUR LEVEL GENERATOR');
    console.log('========================================');
    console.log(`Generating ${count} levels with ${minMoves}-${maxMoves} moves and ~${numVehicles} vehicles\n`);
    
    const generatedLevels = [];
    
    for (let i = 0; i < count; i++) {
        process.stdout.write(`Generating level ${i + 1}... `);
        
        const result = LevelGenerator.generateLevel(minMoves, maxMoves, numVehicles, 2000);
        
        if (result) {
            console.log(`✓ (${result.minMoves} moves, ${result.vehicles.length} vehicles, ${result.attempts} attempts)`);
            generatedLevels.push(result);
        } else {
            console.log('✗ Failed after 2000 attempts. Try different parameters.');
        }
    }
    
    if (generatedLevels.length > 0) {
        console.log('\n========================================');
        console.log('� GENERATED LEVEL PREVIEWS');
        console.log('========================================');
        
        generatedLevels.forEach((level, index) => {
            console.log(`\n--- Generated Level ${index + 1} (${level.minMoves} moves) ---`);
            RushHourSolver.printGrid(level.vehicles);
        });
        
        if (autoAppend) {
            appendLevelsToFile(generatedLevels);
        } else {
            console.log('\n========================================');
            console.log('� GENERATED LEVELS CODE');
            console.log('========================================\n');
            
            generatedLevels.forEach((level, index) => {
                console.log(formatLevelForFile(level.vehicles, RUSH_HOUR_LEVELS.length + index + 1, level.minMoves));
                if (index < generatedLevels.length - 1) console.log(',');
            });
            
            console.log('\n💡 Run with --save flag to automatically append to levels.js');
        }
    }
    
    return generatedLevels;
}

function formatLevelForFile(vehicles, levelNum, minMoves) {
    let code = `    // Level ${levelNum} (${minMoves} moves minimum)\n`;
    code += '    {\n';
    code += '        vehicles: [\n';
    
    vehicles.forEach((v, i) => {
        code += `            { id: '${v.id}', row: ${v.row}, col: ${v.col}, length: ${v.length}, orientation: '${v.orientation}', color: '${v.color}' }`;
        code += i < vehicles.length - 1 ? ',\n' : '\n';
    });
    
    code += '        ]\n';
    code += '    }';
    return code;
}

function appendLevelsToFile(generatedLevels) {
    const levelsFilePath = path.join(__dirname, 'levels.js');
    
    try {
        // Read current file
        let fileContent = fs.readFileSync(levelsFilePath, 'utf8');
        
        // Find the closing bracket of the array (last ] before the export)
        const lastBracketIndex = fileContent.lastIndexOf(']');
        
        if (lastBracketIndex === -1) {
            console.error('❌ Error: Could not find array end in levels.js');
            return false;
        }
        
        // Build the new levels code
        let newLevelsCode = '';
        generatedLevels.forEach((level, index) => {
            const levelNum = RUSH_HOUR_LEVELS.length + index + 1;
            newLevelsCode += ',\n' + formatLevelForFile(level.vehicles, levelNum, level.minMoves);
        });
        
        // Insert new levels before the closing bracket
        const newFileContent = 
            fileContent.slice(0, lastBracketIndex) + 
            newLevelsCode + '\n' +
            fileContent.slice(lastBracketIndex);
        
        // Write back to file
        fs.writeFileSync(levelsFilePath, newFileContent, 'utf8');
        
        console.log('\n========================================');
        console.log('✅ LEVELS APPENDED TO levels.js');
        console.log('========================================');
        console.log(`Added ${generatedLevels.length} new levels (now ${RUSH_HOUR_LEVELS.length + generatedLevels.length} total)`);
        
        return true;
    } catch (err) {
        console.error('❌ Error writing to levels.js:', err.message);
        return false;
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'test';

// Check for --save flag
const saveFlag = args.includes('--save') || args.includes('-s');
const filteredArgs = args.filter(arg => arg !== '--save' && arg !== '-s');

switch (command) {
    case 'test':
        const allValid = testLevels();
        // Exit with error code if any level is invalid (for CI/CD)
        process.exit(allValid ? 0 : 1);
        break;
    
    case 'generate':
        const count = parseInt(filteredArgs[1]) || 6;
        const minMoves = parseInt(filteredArgs[2]) || 5;
        const maxMoves = parseInt(filteredArgs[3]) || 15;
        const numVehicles = parseInt(filteredArgs[4]) || 8;
        generateLevels(count, minMoves, maxMoves, numVehicles, saveFlag);
        break;
    
    case 'help':
    default:
        console.log(`
Rush Hour Level Tools

Usage:
  node level-tester.js test                                    - Test current game levels
  node level-tester.js generate [count] [min] [max] [vehicles] - Generate new levels
  node level-tester.js generate [count] [min] [max] [vehicles] --save
                                                               - Generate and append to levels.js

Options:
  --save, -s    Automatically append generated levels to levels.js

Examples:
  node level-tester.js test                           - Test all levels in levels.js
  node level-tester.js generate 6 5 15 8              - Generate 6 levels with 5-15 moves
  node level-tester.js generate 3 10 25 10 --save     - Generate 3 hard levels and save
        `);
        break;
}
