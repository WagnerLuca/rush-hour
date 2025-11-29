// Rush Hour Game Logic with Solver

class RushHourSolver {
    // Solves using BFS to find optimal solution
    static solve(vehicles) {
        const startState = this.vehiclesToState(vehicles);
        
        // Check if already solved
        if (this.isWinState(startState, vehicles)) {
            return [];
        }
        
        const queue = [{ state: startState, moves: [] }];
        const visited = new Set();
        visited.add(this.stateToString(startState));
        
        while (queue.length > 0) {
            const { state, moves } = queue.shift();
            
            // Generate all possible moves
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
        
        return null; // No solution found
    }
    
    static vehiclesToState(vehicles) {
        // State: { vehicleId: { row, col } }
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
        return state['X'].col === 4; // Red car at exit
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
                // Try moving left
                for (let newCol = pos.col - 1; newCol >= 0; newCol--) {
                    if (grid[pos.row][newCol] === null) {
                        moves.push({ id: v.id, row: pos.row, col: newCol });
                    } else {
                        break;
                    }
                }
                // Try moving right
                for (let newCol = pos.col + 1; newCol <= 6 - v.length; newCol++) {
                    if (grid[pos.row][pos.col + v.length + (newCol - pos.col - 1)] === null) {
                        moves.push({ id: v.id, row: pos.row, col: newCol });
                    } else {
                        break;
                    }
                }
            } else {
                // Try moving up
                for (let newRow = pos.row - 1; newRow >= 0; newRow--) {
                    if (grid[newRow][pos.col] === null) {
                        moves.push({ id: v.id, row: newRow, col: pos.col });
                    } else {
                        break;
                    }
                }
                // Try moving down
                for (let newRow = pos.row + 1; newRow <= 6 - v.length; newRow++) {
                    if (grid[pos.row + v.length + (newRow - pos.row - 1)][pos.col] === null) {
                        moves.push({ id: v.id, row: newRow, col: pos.col });
                    } else {
                        break;
                    }
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
    
    // Validate level has no overlaps and is solvable
    static validateLevel(level) {
        const vehicles = level.vehicles;
        const grid = Array(6).fill(null).map(() => Array(6).fill(null));
        
        // Check for overlaps
        for (const v of vehicles) {
            for (let i = 0; i < v.length; i++) {
                const row = v.orientation === 'h' ? v.row : v.row + i;
                const col = v.orientation === 'h' ? v.col + i : v.col;
                
                if (row < 0 || row >= 6 || col < 0 || col >= 6) {
                    return { valid: false, error: `Vehicle ${v.id} is out of bounds` };
                }
                
                if (grid[row][col] !== null) {
                    return { valid: false, error: `Vehicle ${v.id} overlaps with ${grid[row][col]} at (${row}, ${col})` };
                }
                
                grid[row][col] = v.id;
            }
        }
        
        // Check red car is on row 2 and horizontal
        const redCar = vehicles.find(v => v.id === 'X');
        if (!redCar) {
            return { valid: false, error: 'No red car (X) found' };
        }
        if (redCar.row !== 2 || redCar.orientation !== 'h') {
            return { valid: false, error: 'Red car must be horizontal on row 2' };
        }
        
        // Check if solvable
        const solution = this.solve(vehicles);
        if (solution === null) {
            return { valid: false, error: 'Level is not solvable' };
        }
        
        return { valid: true, solution, minMoves: solution.length };
    }
}

class RushHourGame {
    constructor() {
        this.board = document.getElementById('board');
        this.movesDisplay = document.getElementById('moves');
        this.levelDisplay = document.getElementById('level');
        this.winMessage = document.getElementById('winMessage');
        this.winMoves = document.getElementById('winMoves');
        this.optimalDisplay = document.getElementById('optimal');
        this.solutionPanel = document.getElementById('solutionPanel');
        this.solutionSteps = document.getElementById('solutionSteps');
        
        this.cellSize = 62; // 60px + 2px gap
        this.boardPadding = 10;
        this.moves = 0;
        this.currentLevel = 0;
        this.vehicles = [];
        this.grid = [];
        this.currentSolution = null;
        this.isShowingSolution = false;
        
        this.dragging = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.vehicleStartX = 0;
        this.vehicleStartY = 0;
        
        this.levels = this.createLevels();
        
        this.initBoard();
        this.validateAllLevels();
        this.loadLevel(this.currentLevel);
        this.setupEventListeners();
    }
    
    createLevels() {
        // Carefully designed levels - all validated and solvable
        return [
            // Level 1 - Easy
            {
                vehicles: [
                    { id: 'X', row: 2, col: 1, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 3, orientation: 'v', color: 'yellow' },
                    { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 1, col: 3, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'D', row: 3, col: 0, length: 3, orientation: 'h', color: 'blue' },
                    { id: 'E', row: 3, col: 3, length: 3, orientation: 'v', color: 'orange' }
                ]
            },
            // Level 2 - Easy
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 2, length: 3, orientation: 'v', color: 'yellow' },
                    { id: 'B', row: 0, col: 3, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 0, col: 5, length: 3, orientation: 'v', color: 'purple' },
                    { id: 'D', row: 3, col: 3, length: 2, orientation: 'h', color: 'blue' },
                    { id: 'E', row: 4, col: 2, length: 2, orientation: 'v', color: 'orange' }
                ]
            },
            // Level 3 - Medium
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
                    { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 1, col: 2, length: 2, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 0, col: 4, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 2, col: 3, length: 3, orientation: 'v', color: 'orange' },
                    { id: 'F', row: 3, col: 0, length: 2, orientation: 'h', color: 'pink' },
                    { id: 'G', row: 4, col: 1, length: 2, orientation: 'v', color: 'cyan' },
                    { id: 'H', row: 5, col: 3, length: 2, orientation: 'h', color: 'lime' }
                ]
            },
            // Level 4 - Medium
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'h', color: 'blue' },
                    { id: 'B', row: 0, col: 2, length: 2, orientation: 'v', color: 'green' },
                    { id: 'C', row: 0, col: 3, length: 3, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 1, col: 0, length: 2, orientation: 'h', color: 'purple' },
                    { id: 'E', row: 2, col: 4, length: 2, orientation: 'v', color: 'orange' },
                    { id: 'F', row: 3, col: 0, length: 2, orientation: 'v', color: 'pink' },
                    { id: 'G', row: 3, col: 1, length: 2, orientation: 'h', color: 'cyan' },
                    { id: 'H', row: 4, col: 4, length: 2, orientation: 'v', color: 'lime' },
                    { id: 'I', row: 5, col: 0, length: 3, orientation: 'h', color: 'brown' }
                ]
            },
            // Level 5 - Hard
            {
                vehicles: [
                    { id: 'X', row: 2, col: 1, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 3, orientation: 'v', color: 'blue' },
                    { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 0, col: 3, length: 2, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 0, col: 5, length: 3, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 1, col: 1, length: 2, orientation: 'v', color: 'orange' },
                    { id: 'F', row: 2, col: 4, length: 2, orientation: 'v', color: 'pink' },
                    { id: 'G', row: 3, col: 1, length: 3, orientation: 'h', color: 'cyan' },
                    { id: 'H', row: 4, col: 0, length: 2, orientation: 'h', color: 'lime' },
                    { id: 'I', row: 4, col: 3, length: 3, orientation: 'v', color: 'brown' },
                    { id: 'J', row: 5, col: 0, length: 2, orientation: 'h', color: 'blue' }
                ]
            },
            // Level 6 - Hard
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
                    { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 0, col: 4, length: 3, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 1, col: 1, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 1, col: 3, length: 2, orientation: 'v', color: 'orange' },
                    { id: 'F', row: 2, col: 2, length: 2, orientation: 'v', color: 'pink' },
                    { id: 'G', row: 3, col: 0, length: 2, orientation: 'h', color: 'cyan' },
                    { id: 'H', row: 3, col: 3, length: 3, orientation: 'v', color: 'lime' },
                    { id: 'I', row: 4, col: 1, length: 2, orientation: 'v', color: 'brown' },
                    { id: 'J', row: 5, col: 0, length: 2, orientation: 'h', color: 'blue' },
                    { id: 'K', row: 5, col: 4, length: 2, orientation: 'h', color: 'green' }
                ]
            }
        ];
    }
    
    validateAllLevels() {
        console.log('Validating all levels...');
        this.levels.forEach((level, index) => {
            const result = RushHourSolver.validateLevel(level);
            if (result.valid) {
                level.solution = result.solution;
                level.minMoves = result.minMoves;
                console.log(`Level ${index + 1}: ✓ Valid (${result.minMoves} moves minimum)`);
            } else {
                console.error(`Level ${index + 1}: ✗ Invalid - ${result.error}`);
            }
        });
    }
    
    initBoard() {
        // Create grid cells
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                this.board.appendChild(cell);
            }
        }
    }
    
    loadLevel(levelIndex) {
        // Clear existing vehicles
        this.vehicles.forEach(v => v.element.remove());
        this.vehicles = [];
        this.moves = 0;
        this.movesDisplay.textContent = '0';
        this.levelDisplay.textContent = levelIndex + 1;
        this.winMessage.classList.add('hidden');
        this.hideSolution();
        
        // Reset grid
        this.grid = Array(6).fill(null).map(() => Array(6).fill(null));
        
        // Load level data
        const level = this.levels[levelIndex];
        this.currentSolution = level.solution || null;
        
        // Update optimal moves display
        if (this.optimalDisplay && level.minMoves) {
            this.optimalDisplay.textContent = level.minMoves;
        }
        
        level.vehicles.forEach(vehicleData => {
            this.createVehicle({ ...vehicleData });
        });
    }
    
    createVehicle(data) {
        const vehicle = document.createElement('div');
        const isHorizontal = data.orientation === 'h';
        const isTruck = data.length === 3;
        
        vehicle.className = `vehicle ${data.color} ${isHorizontal ? 'horizontal' : 'vertical'} length-${data.length}`;
        if (isTruck) vehicle.classList.add('truck');
        
        // Set position
        const x = this.boardPadding + data.col * this.cellSize;
        const y = this.boardPadding + data.row * this.cellSize;
        vehicle.style.left = `${x}px`;
        vehicle.style.top = `${y}px`;
        
        // Add icon and ID
        const icon = data.id === 'X' ? '🚗' : (isTruck ? '🚛' : '🚙');
        vehicle.innerHTML = `<span class="vehicle-id">${data.id}</span>${icon}`;
        
        // Store vehicle data
        const vehicleObj = {
            element: vehicle,
            id: data.id,
            row: data.row,
            col: data.col,
            length: data.length,
            orientation: data.orientation,
            isRed: data.id === 'X'
        };
        
        this.vehicles.push(vehicleObj);
        this.board.appendChild(vehicle);
        
        // Update grid
        this.updateGrid();
        
        // Add drag events
        vehicle.addEventListener('mousedown', (e) => this.startDrag(e, vehicleObj));
        vehicle.addEventListener('touchstart', (e) => this.startDrag(e, vehicleObj), { passive: false });
    }
    
    updateGrid() {
        // Reset grid
        this.grid = Array(6).fill(null).map(() => Array(6).fill(null));
        
        // Place vehicles on grid
        this.vehicles.forEach(v => {
            for (let i = 0; i < v.length; i++) {
                const row = v.orientation === 'h' ? v.row : v.row + i;
                const col = v.orientation === 'h' ? v.col + i : v.col;
                if (row >= 0 && row < 6 && col >= 0 && col < 6) {
                    this.grid[row][col] = v.id;
                }
            }
        });
    }
    
    startDrag(e, vehicle) {
        if (this.isShowingSolution) return;
        e.preventDefault();
        
        this.dragging = vehicle;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        this.dragStartX = clientX;
        this.dragStartY = clientY;
        this.vehicleStartX = parseInt(vehicle.element.style.left);
        this.vehicleStartY = parseInt(vehicle.element.style.top);
        
        vehicle.element.style.zIndex = '100';
    }
    
    onDrag(e) {
        if (!this.dragging) return;
        e.preventDefault();
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - this.dragStartX;
        const deltaY = clientY - this.dragStartY;
        
        const vehicle = this.dragging;
        const isHorizontal = vehicle.orientation === 'h';
        
        // Calculate bounds
        const { minPos, maxPos } = this.calculateBounds(vehicle);
        
        if (isHorizontal) {
            let newX = this.vehicleStartX + deltaX;
            newX = Math.max(minPos, Math.min(maxPos, newX));
            vehicle.element.style.left = `${newX}px`;
        } else {
            let newY = this.vehicleStartY + deltaY;
            newY = Math.max(minPos, Math.min(maxPos, newY));
            vehicle.element.style.top = `${newY}px`;
        }
    }
    
    calculateBounds(vehicle) {
        const isHorizontal = vehicle.orientation === 'h';
        
        // Find obstacles
        let minCell = 0;
        let maxCell = 6 - vehicle.length;
        
        if (isHorizontal) {
            // Check cells to the left
            for (let col = vehicle.col - 1; col >= 0; col--) {
                if (this.grid[vehicle.row][col] !== null) {
                    minCell = col + 1;
                    break;
                }
            }
            // Check cells to the right
            for (let col = vehicle.col + vehicle.length; col < 6; col++) {
                if (this.grid[vehicle.row][col] !== null) {
                    maxCell = col - vehicle.length;
                    break;
                }
            }
        } else {
            // Check cells above
            for (let row = vehicle.row - 1; row >= 0; row--) {
                if (this.grid[row][vehicle.col] !== null) {
                    minCell = row + 1;
                    break;
                }
            }
            // Check cells below
            for (let row = vehicle.row + vehicle.length; row < 6; row++) {
                if (this.grid[row][vehicle.col] !== null) {
                    maxCell = row - vehicle.length;
                    break;
                }
            }
        }
        
        const minPos = this.boardPadding + minCell * this.cellSize;
        const maxPos = this.boardPadding + maxCell * this.cellSize;
        
        return { minPos, maxPos, minCell, maxCell };
    }
    
    endDrag() {
        if (!this.dragging) return;
        
        const vehicle = this.dragging;
        const isHorizontal = vehicle.orientation === 'h';
        
        // Snap to grid
        let currentPos = isHorizontal 
            ? parseInt(vehicle.element.style.left) 
            : parseInt(vehicle.element.style.top);
        
        const cellPos = Math.round((currentPos - this.boardPadding) / this.cellSize);
        const snappedPos = this.boardPadding + cellPos * this.cellSize;
        
        if (isHorizontal) {
            vehicle.element.style.left = `${snappedPos}px`;
            if (cellPos !== vehicle.col) {
                this.moves++;
                this.movesDisplay.textContent = this.moves;
            }
            vehicle.col = cellPos;
        } else {
            vehicle.element.style.top = `${snappedPos}px`;
            if (cellPos !== vehicle.row) {
                this.moves++;
                this.movesDisplay.textContent = this.moves;
            }
            vehicle.row = cellPos;
        }
        
        vehicle.element.style.zIndex = '10';
        
        // Update grid
        this.updateGrid();
        
        // Check win condition
        this.checkWin();
        
        this.dragging = null;
    }
    
    checkWin() {
        // Red car needs to be at column 4 (so it extends to column 5, the exit)
        const redCar = this.vehicles.find(v => v.isRed);
        if (redCar && redCar.col === 4) {
            this.animateCarExit(redCar);
        }
    }
    
    animateCarExit(redCar) {
        // Disable dragging during animation
        this.dragging = null;
        this.isShowingSolution = true;
        
        // Add transition for smooth animation
        redCar.element.style.transition = 'left 0.8s ease-in-out';
        
        // Animate car driving off to the right
        const exitPosition = this.boardPadding + 8 * this.cellSize;
        redCar.element.style.left = `${exitPosition}px`;
        
        // Show win message after animation
        setTimeout(() => {
            redCar.element.style.transition = '';
            this.isShowingSolution = false;
            this.showWinMessage();
        }, 800);
    }
    
    showWinMessage() {
        const level = this.levels[this.currentLevel];
        this.winMoves.textContent = this.moves;
        
        // Show rating based on moves
        const optimalMoves = level.minMoves || 1;
        const rating = this.getRating(this.moves, optimalMoves);
        
        const ratingElement = document.getElementById('winRating');
        if (ratingElement) {
            ratingElement.innerHTML = rating;
        }
        
        const optimalInfo = document.getElementById('winOptimal');
        if (optimalInfo) {
            optimalInfo.textContent = optimalMoves;
        }
        
        this.winMessage.classList.remove('hidden');
    }
    
    getRating(moves, optimal) {
        const ratio = moves / optimal;
        if (ratio <= 1) return '⭐⭐⭐ Perfect!';
        if (ratio <= 1.5) return '⭐⭐ Great!';
        if (ratio <= 2) return '⭐ Good!';
        return 'Completed!';
    }
    
    showSolution() {
        // Reset to initial state first
        this.loadLevel(this.currentLevel);
        
        // Recalculate solution from current state
        const vehicleData = this.levels[this.currentLevel].vehicles;
        const solution = RushHourSolver.solve(vehicleData);
        
        if (!solution) {
            alert('Could not calculate solution.');
            return;
        }
        
        this.displaySolutionSteps(solution);
    }
    
    displaySolutionSteps(solution) {
        this.solutionPanel.classList.remove('hidden');
        this.solutionSteps.innerHTML = '';
        
        const vehicles = this.levels[this.currentLevel].vehicles;
        
        // Create state tracker
        let state = RushHourSolver.vehiclesToState(vehicles);
        
        solution.forEach((move, index) => {
            const vehicle = vehicles.find(v => v.id === move.id);
            const oldPos = state[move.id];
            const isHorizontal = vehicle.orientation === 'h';
            
            let direction;
            if (isHorizontal) {
                direction = move.col > oldPos.col ? 'right' : 'left';
            } else {
                direction = move.row > oldPos.row ? 'down' : 'up';
            }
            
            const distance = isHorizontal 
                ? Math.abs(move.col - oldPos.col) 
                : Math.abs(move.row - oldPos.row);
            
            const stepDiv = document.createElement('div');
            stepDiv.className = 'solution-step';
            stepDiv.innerHTML = `
                <span class="step-number">${index + 1}.</span>
                <span class="step-vehicle ${vehicle.color}">${move.id}</span>
                <span class="step-direction">${this.getArrow(direction)} ${direction}</span>
                <span class="step-distance">(${distance} cell${distance > 1 ? 's' : ''})</span>
            `;
            
            stepDiv.addEventListener('click', () => this.animateToStep(solution, index));
            
            this.solutionSteps.appendChild(stepDiv);
            
            // Update state for next step
            state = RushHourSolver.applyMove(state, move, vehicles);
        });
        
        // Add play all button info
        const playInfo = document.createElement('div');
        playInfo.className = 'solution-info';
        playInfo.innerHTML = `<em>Click a step to see the board at that point, or click "▶ Play" to watch all moves.</em>`;
        this.solutionSteps.appendChild(playInfo);
    }
    
    getArrow(direction) {
        const arrows = { left: '←', right: '→', up: '↑', down: '↓' };
        return arrows[direction] || '→';
    }
    
    async animateToStep(solution, targetStep) {
        // Reset first
        this.loadLevel(this.currentLevel);
        this.solutionPanel.classList.remove('hidden');
        this.isShowingSolution = true;
        
        // Animate each step up to target
        for (let i = 0; i <= targetStep; i++) {
            await this.animateMove(solution[i]);
            await this.delay(300);
        }
        
        this.isShowingSolution = false;
    }
    
    async playSolution() {
        const vehicleData = this.levels[this.currentLevel].vehicles;
        const solution = RushHourSolver.solve(vehicleData);
        
        if (!solution || solution.length === 0) {
            alert('No solution available.');
            return;
        }
        
        // Reset first
        this.loadLevel(this.currentLevel);
        this.solutionPanel.classList.remove('hidden');
        this.isShowingSolution = true;
        
        // Recalculate and display steps
        this.displaySolutionSteps(solution);
        
        // Animate each step
        for (const move of solution) {
            await this.animateMove(move);
            await this.delay(500);
        }
        
        this.isShowingSolution = false;
        
        // Trigger win
        this.moves = solution.length;
        this.movesDisplay.textContent = this.moves;
        this.checkWin();
    }
    
    animateMove(move) {
        return new Promise(resolve => {
            const vehicle = this.vehicles.find(v => v.id === move.id);
            if (!vehicle) {
                resolve();
                return;
            }
            
            const isHorizontal = vehicle.orientation === 'h';
            
            vehicle.element.style.transition = 'left 0.3s ease, top 0.3s ease';
            vehicle.element.style.boxShadow = '0 0 15px rgba(255, 255, 0, 0.8)';
            
            if (isHorizontal) {
                const x = this.boardPadding + move.col * this.cellSize;
                vehicle.element.style.left = `${x}px`;
                vehicle.col = move.col;
            } else {
                const y = this.boardPadding + move.row * this.cellSize;
                vehicle.element.style.top = `${y}px`;
                vehicle.row = move.row;
            }
            
            setTimeout(() => {
                vehicle.element.style.transition = '';
                vehicle.element.style.boxShadow = '';
                this.updateGrid();
                resolve();
            }, 300);
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    hideSolution() {
        if (this.solutionPanel) {
            this.solutionPanel.classList.add('hidden');
        }
        this.isShowingSolution = false;
    }
    
    setupEventListeners() {
        // Mouse events
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Touch events
        document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        document.addEventListener('touchend', () => this.endDrag());
        
        // Button events
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.loadLevel(this.currentLevel);
        });
        
        document.getElementById('prevLevelBtn').addEventListener('click', () => {
            if (this.currentLevel > 0) {
                this.currentLevel--;
                this.loadLevel(this.currentLevel);
            }
        });
        
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            if (this.currentLevel < this.levels.length - 1) {
                this.currentLevel++;
                this.loadLevel(this.currentLevel);
            }
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showSolution();
        });
        
        document.getElementById('playBtn').addEventListener('click', () => {
            this.playSolution();
        });
        
        document.getElementById('closeSolutionBtn').addEventListener('click', () => {
            this.hideSolution();
        });
        
        document.getElementById('nextLevelWinBtn').addEventListener('click', () => {
            if (this.currentLevel < this.levels.length - 1) {
                this.currentLevel++;
                this.loadLevel(this.currentLevel);
            } else {
                this.currentLevel = 0;
                this.loadLevel(this.currentLevel);
            }
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RushHourGame();
});
