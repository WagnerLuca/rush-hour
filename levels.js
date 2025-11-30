/**
 * Rush Hour Game Levels
 * This file contains all level definitions used by both the game and testing tools.
 */

const RUSH_HOUR_LEVELS = [
    // Level 1 - Easy (2 moves)
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
    // Level 2 - Easy (4 moves)
    {
        vehicles: [
            { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
            { id: 'A', row: 0, col: 2, length: 2, orientation: 'v', color: 'yellow' },
            { id: 'B', row: 0, col: 3, length: 2, orientation: 'h', color: 'green' },
            { id: 'C', row: 1, col: 4, length: 2, orientation: 'v', color: 'purple' },
            { id: 'D', row: 2, col: 3, length: 2, orientation: 'v', color: 'blue' },
            { id: 'E', row: 4, col: 2, length: 2, orientation: 'h', color: 'orange' },
            { id: 'F', row: 5, col: 4, length: 2, orientation: 'h', color: 'pink' }
        ]
    },
    // Level 3 - Medium (4 moves)
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
    // Level 4 - Medium (3 moves)
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
    // Level 5 - Hard (5 moves)
    {
        vehicles: [
            { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
            { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
            { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
            { id: 'C', row: 0, col: 3, length: 2, orientation: 'v', color: 'yellow' },
            { id: 'D', row: 0, col: 5, length: 3, orientation: 'v', color: 'purple' },
            { id: 'E', row: 1, col: 1, length: 2, orientation: 'h', color: 'orange' },
            { id: 'F', row: 2, col: 2, length: 2, orientation: 'v', color: 'pink' },
            { id: 'G', row: 2, col: 4, length: 2, orientation: 'v', color: 'cyan' },
            { id: 'H', row: 3, col: 0, length: 2, orientation: 'h', color: 'lime' },
            { id: 'I', row: 4, col: 2, length: 2, orientation: 'h', color: 'brown' },
            { id: 'J', row: 5, col: 0, length: 3, orientation: 'h', color: 'blue' }
        ]
    },
    // Level 6 - Hard
    {
        vehicles: [
            { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
            { id: 'A', row: 0, col: 0, length: 2, orientation: 'v', color: 'blue' },
            { id: 'B', row: 0, col: 1, length: 2, orientation: 'h', color: 'green' },
            { id: 'C', row: 0, col: 4, length: 3, orientation: 'v', color: 'yellow' },
            { id: 'D', row: 1, col: 3, length: 2, orientation: 'v', color: 'purple' },
            { id: 'E', row: 2, col: 2, length: 2, orientation: 'v', color: 'orange' },
            { id: 'F', row: 3, col: 0, length: 2, orientation: 'h', color: 'pink' },
            { id: 'G', row: 4, col: 3, length: 2, orientation: 'h', color: 'cyan' },
            { id: 'H', row: 4, col: 0, length: 2, orientation: 'h', color: 'lime' },
            { id: 'I', row: 5, col: 0, length: 3, orientation: 'h', color: 'brown' }
        ]
    }
,
    // Level 7 (5 moves minimum)
    {
        vehicles: [
            { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
            { id: 'A', row: 5, col: 4, length: 2, orientation: 'h', color: 'blue' },
            { id: 'B', row: 2, col: 5, length: 3, orientation: 'v', color: 'green' },
            { id: 'C', row: 4, col: 3, length: 2, orientation: 'v', color: 'yellow' },
            { id: 'D', row: 1, col: 0, length: 3, orientation: 'h', color: 'purple' },
            { id: 'E', row: 1, col: 4, length: 3, orientation: 'v', color: 'orange' },
            { id: 'F', row: 0, col: 0, length: 2, orientation: 'h', color: 'pink' }
        ]
    },
    // Level 8 (8 moves minimum)
    {
        vehicles: [
            { id: 'X', row: 2, col: 0, length: 2, orientation: 'h', color: 'red' },
            { id: 'A', row: 0, col: 5, length: 2, orientation: 'v', color: 'blue' },
            { id: 'B', row: 4, col: 1, length: 3, orientation: 'h', color: 'green' },
            { id: 'C', row: 4, col: 5, length: 2, orientation: 'v', color: 'yellow' },
            { id: 'D', row: 1, col: 2, length: 3, orientation: 'v', color: 'purple' },
            { id: 'E', row: 0, col: 2, length: 3, orientation: 'h', color: 'orange' },
            { id: 'F', row: 3, col: 0, length: 3, orientation: 'v', color: 'pink' }
        ]
    }
];

// Export for Node.js (level-tester.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RUSH_HOUR_LEVELS };
}
