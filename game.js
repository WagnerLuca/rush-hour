// Rush Hour Game Logic

class RushHourGame {
    constructor() {
        this.board = document.getElementById('board');
        this.movesDisplay = document.getElementById('moves');
        this.levelDisplay = document.getElementById('level');
        this.winMessage = document.getElementById('winMessage');
        this.winMoves = document.getElementById('winMoves');
        
        this.cellSize = 62; // 60px + 2px gap
        this.boardPadding = 10;
        this.moves = 0;
        this.currentLevel = 0;
        this.vehicles = [];
        this.grid = [];
        
        this.dragging = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.vehicleStartX = 0;
        this.vehicleStartY = 0;
        
        this.levels = this.createLevels();
        
        this.initBoard();
        this.loadLevel(this.currentLevel);
        this.setupEventListeners();
    }
    
    createLevels() {
        // Each level defines vehicles with: id, row, col, length, orientation ('h' or 'v'), color
        // The red car (id: 'X') is always the target and must reach column 4 on row 2 (exit row)
        return [
            // Level 1 - Easy
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
                    { id: 'B', row: 0, col: 3, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 1, col: 5, length: 2, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 3, col: 2, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 5, col: 0, length: 3, orientation: 'h', color: 'orange' }
                ]
            },
            // Level 2
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
                    { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 0, col: 4, length: 3, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 1, col: 1, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 3, col: 0, length: 3, orientation: 'h', color: 'orange' },
                    { id: 'F', row: 4, col: 2, length: 2, orientation: 'v', color: 'pink' },
                    { id: 'G', row: 3, col: 5, length: 3, orientation: 'v', color: 'cyan' }
                ]
            },
            // Level 3
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'h', color: 'blue' },
                    { id: 'B', row: 0, col: 2, length: 2, orientation: 'v', color: 'green' },
                    { id: 'C', row: 0, col: 3, length: 2, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 0, col: 4, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 1, col: 0, length: 2, orientation: 'h', color: 'orange' },
                    { id: 'F', row: 2, col: 4, length: 2, orientation: 'v', color: 'pink' },
                    { id: 'G', row: 3, col: 0, length: 2, orientation: 'v', color: 'cyan' },
                    { id: 'H', row: 3, col: 1, length: 2, orientation: 'v', color: 'lime' },
                    { id: 'I', row: 4, col: 3, length: 2, orientation: 'h', color: 'brown' },
                    { id: 'J', row: 5, col: 0, length: 2, orientation: 'h', color: 'blue' }
                ]
            },
            // Level 4 - Medium
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 3, orientation: 'h', color: 'blue' },
                    { id: 'B', row: 0, col: 5, length: 3, orientation: 'v', color: 'green' },
                    { id: 'C', row: 1, col: 0, length: 2, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 1, col: 2, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 2, col: 3, length: 2, orientation: 'v', color: 'orange' },
                    { id: 'F', row: 3, col: 1, length: 2, orientation: 'h', color: 'pink' },
                    { id: 'G', row: 4, col: 0, length: 2, orientation: 'h', color: 'cyan' },
                    { id: 'H', row: 4, col: 3, length: 2, orientation: 'h', color: 'lime' },
                    { id: 'I', row: 5, col: 1, length: 2, orientation: 'h', color: 'brown' }
                ]
            },
            // Level 5
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
                    { id: 'B', row: 0, col: 1, length: 3, orientation: 'h', color: 'green' },
                    { id: 'C', row: 0, col: 4, length: 2, orientation: 'v', color: 'yellow' },
                    { id: 'D', row: 1, col: 1, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 2, col: 3, length: 3, orientation: 'v', color: 'orange' },
                    { id: 'F', row: 2, col: 4, length: 2, orientation: 'v', color: 'pink' },
                    { id: 'G', row: 3, col: 0, length: 2, orientation: 'h', color: 'cyan' },
                    { id: 'H', row: 4, col: 1, length: 2, orientation: 'v', color: 'lime' },
                    { id: 'I', row: 5, col: 2, length: 2, orientation: 'h', color: 'brown' },
                    { id: 'J', row: 5, col: 4, length: 2, orientation: 'h', color: 'blue' }
                ]
            },
            // Level 6 - Hard
            {
                vehicles: [
                    { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
                    { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
                    { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
                    { id: 'C', row: 0, col: 3, length: 2, orientation: 'h', color: 'yellow' },
                    { id: 'D', row: 0, col: 5, length: 2, orientation: 'v', color: 'purple' },
                    { id: 'E', row: 1, col: 1, length: 2, orientation: 'v', color: 'orange' },
                    { id: 'F', row: 1, col: 3, length: 2, orientation: 'v', color: 'pink' },
                    { id: 'G', row: 2, col: 2, length: 3, orientation: 'v', color: 'cyan' },
                    { id: 'H', row: 2, col: 4, length: 2, orientation: 'v', color: 'lime' },
                    { id: 'I', row: 3, col: 3, length: 2, orientation: 'h', color: 'brown' },
                    { id: 'J', row: 4, col: 0, length: 2, orientation: 'h', color: 'blue' },
                    { id: 'K', row: 5, col: 0, length: 3, orientation: 'h', color: 'green' },
                    { id: 'L', row: 4, col: 4, length: 2, orientation: 'v', color: 'yellow' }
                ]
            }
        ];
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
        
        // Reset grid
        this.grid = Array(6).fill(null).map(() => Array(6).fill(null));
        
        // Load level data
        const level = this.levels[levelIndex];
        level.vehicles.forEach(vehicleData => {
            this.createVehicle(vehicleData);
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
        
        // Add icon
        vehicle.innerHTML = data.id === 'X' ? '🚗' : (isTruck ? '🚛' : '🚙');
        
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
        
        // Add transition for smooth animation
        redCar.element.style.transition = 'left 0.8s ease-in-out';
        
        // Animate car driving off to the right
        const exitPosition = this.boardPadding + 8 * this.cellSize; // Move past the board
        redCar.element.style.left = `${exitPosition}px`;
        
        // Show win message after animation
        setTimeout(() => {
            redCar.element.style.transition = '';
            this.showWinMessage();
        }, 800);
    }
    
    showWinMessage() {
        this.winMoves.textContent = this.moves;
        this.winMessage.classList.remove('hidden');
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
        
        document.getElementById('nextLevelWinBtn').addEventListener('click', () => {
            if (this.currentLevel < this.levels.length - 1) {
                this.currentLevel++;
                this.loadLevel(this.currentLevel);
            } else {
                // All levels complete, restart
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
