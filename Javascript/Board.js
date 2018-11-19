// Create a function to reset board


if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length -1];
    };
};

class Board {
    constructor() {
        this.cells = new Array([], [], [], [], [], [], [], [], []); // sudoku collumns
        this.tempSudoku = new Array([], [], [], [], [], [], [], [], []); // House picked solutions before applying to html
        this.setupCells();
        this.death = 0;
    }

    setupCells() {
        // Build multidirectional array to represent cells on board
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.cells[x][y] = [];
                this.cells[x][y][0] = [1,2,3,4,5,6,7,8,9]; // Possible Solutions
                this.cells[x][y][1] = []; // Tried Solutions
            };
        };
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.tempSudoku[x][y] = [];
            };
        };
    }

    pickSolution(xCoordinate, yCoordinate) {
        let currentCell = this.cells[xCoordinate][yCoordinate];
        let solutions = currentCell[0];
        let triedSolutions = currentCell[1];
        let htmlCell = document.getElementById('' + xCoordinate + yCoordinate);
        let possibleSolutions = solutions.slice();

        // If there are tried solutions, remove them from possible solutions
        if (triedSolutions.length > 0) {
            for (let i = 0; i < triedSolutions.length; i++) {
                let solutionIndex = possibleSolutions.indexOf(triedSolutions[i]);
                if (solutionIndex > -1) {
                    possibleSolutions.splice(solutionIndex, 1);
                }
            }
        }

        console.log('solutions: ', solutions);
        console.log('triedSolutions: ', triedSolutions);
        console.log('possibleSolutions: ', possibleSolutions);

        // If there are solutions available, pick one
        if (possibleSolutions.length > 0) {
            // Choose random solution from solutions
            let randomIndex = Math.floor(Math.random() * possibleSolutions.length);
            let solution = possibleSolutions[randomIndex];

            // Set inner HTML of cell to solution
            htmlCell.innerHTML = solution;

            // Add picked solution to tried solutions array
            this.addTriedSolution(xCoordinate, yCoordinate, solution);

            // Notify conflicting cells to remove possible solution
            this.notifyRemove(xCoordinate, yCoordinate, solution);

            console.log('picked Solution: ', solution);

            return true;

        } else {

            console.log('picked Solution: ', []);

            return false;
        }

    }

    backtrack(xCoordinate, yCoordinate) {

        console.log('Begin backtrack');
        let previousCellCoords = this.previousCell(xCoordinate, yCoordinate);

        // Clear current cell of already tried solutions
        this.clearTriedSolutions(xCoordinate, yCoordinate);

        // Store previous cell picked solution, then remove it
        let htmlCell = document.getElementById('' + previousCellCoords[0] + previousCellCoords[1]);
        let triedSolution = this.cells[previousCellCoords[0]][previousCellCoords[1]][1].last()
        this.addTriedSolution(previousCellCoords[0], previousCellCoords[1], triedSolution);
        htmlCell.innerHTML = '';
        console.log('Removing ', triedSolution, ' from ', previousCellCoords[0], previousCellCoords[1]);

        // Tell conflicting cells they can have their solution back
        this.notifyAdd(previousCellCoords[0], previousCellCoords[1], triedSolution);

        // return modified cell (previous cell)
        return previousCellCoords;
    }

    notifyRemove(xCoordinate, yCoordinate, solution) {
        // Notify cells in the row
        for (let x = 0; x < 9; x++) {
            this.removeSolution(x, yCoordinate, solution);
        }

        // Notify cells in the collumn
        for (let y = 0; y < 9; y++) {
            this.removeSolution(xCoordinate, y, solution);
        }

        // Notify cells in the box
        let startCell = this.getBottomLeftCell(xCoordinate, yCoordinate);
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                this.removeSolution(startCell[0] + x, startCell[1] + y, solution);
            }
        }
    }

    notifyAdd(xCoordinate, yCoordinate, solution) {

        // Notify cells in the row
        for (let x = 0; x < 9; x++) {
            this.addSolution(x, yCoordinate, solution);
        }

        // Notify cells in the collumn
        for (let y = 0; y < 9; y++) {
            this.addSolution(xCoordinate, y, solution);
        }

        // Notify cells in the box
        let startCell = this.getBottomLeftCell(xCoordinate, yCoordinate);
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                this.addSolution(startCell[0] + x, startCell[1] + y, solution);
            }
        }

    }

    removeSolution(xCoordinate, yCoordinate, solution) {
        // Remove solution from a cells possible solutions array
        let currentCell = this.cells[xCoordinate][yCoordinate];
        let solutions = currentCell[0];

        let indexOfSolution = solutions.indexOf(solution);
        if (indexOfSolution > -1) {
            solutions.splice(indexOfSolution, 1);
        }

    }

    addSolution(xCoordinate, yCoordinate, solution) {
        // Add solution to a cells possible solutions array
        let currentCell = this.cells[xCoordinate][yCoordinate];
        let solutions = currentCell[0];

        if (!solutions.includes(solution)) {
            solutions.push(solution);
        }
    }

    addTriedSolution(xCoordinate, yCoordinate, solution) {
        let triedSolutions = this.cells[xCoordinate][yCoordinate][1];
        if (!triedSolutions.includes(solution)) {
            triedSolutions.push(solution);
        }
    }

    clearTriedSolutions(xCoordinate, yCoordinate) {
        this.cells[xCoordinate][yCoordinate][1] = [];
        console.log('triedSolutions cleared for: ', xCoordinate, yCoordinate);
    }

    getBottomLeftCell(xCoordinate, yCoordinate) {
        while(xCoordinate % 3 != 0) {
            xCoordinate--;
        }
        
        while(yCoordinate % 3 != 0) {
            yCoordinate--;
        }

        return [xCoordinate, yCoordinate]

    }

    nextCell(xCoordinate, yCoordinate) {
        // Return coordinates of next cell in the form [x, y]

        let nextCell;

        if (xCoordinate < 8 && yCoordinate == 8) {
            nextCell = [xCoordinate + 1, 0];
        } else if (xCoordinate <= 8 && yCoordinate <= 8) {
            nextCell = [xCoordinate, yCoordinate + 1];
        } 
        
        return nextCell;
    }

    previousCell(xCoordinate, yCoordinate) {
        // Return coordinates of previous cell in the form [x, y]

        let previousCell;

        if (xCoordinate > 0 && yCoordinate == 0) {
            previousCell = [xCoordinate - 1, 8];
        } else if (xCoordinate >= 0 && yCoordinate >= 0) {
            previousCell = [xCoordinate, yCoordinate - 1];
        } else {
            console.log('somethings broke')
        }
        
        return previousCell;
    }

    applyToHTML() {
        // Once tempSudoku is complete, push all solutions to html
    }

    setupBoard() {
        // reset everything back to normal
        this.cells = new Array([], [], [], [], [], [], [], [], []); // sudoku collumns
        this.tempSudoku = new Array([], [], [], [], [], [], [], [], []); // House picked solutions before applying to html
        this.setupCells();
        this.death = 0;
    }

    async buildBoard(xCoordinate = 0, yCoordinate = 0) {

        // Testing shananagens
        this.death++
        if (this.death > 5000) {
            let err = new Error('AHHHHHHHHHH!!!!!');
            throw err;
        }

        if (xCoordinate < 9 && yCoordinate < 9) {
        // if current cell is not past 88

            console.log('\nWorking on: ', xCoordinate, yCoordinate);

            // Pick a solution for current cell
            let pickSolutionOutcome = this.pickSolution(xCoordinate, yCoordinate);

            if (!pickSolutionOutcome) {
            // If there are no solutions available
                let lastModifiedCell = this.backtrack(xCoordinate, yCoordinate);

                // Call buildBoard on cell returned by backtrack
                this.buildBoard(lastModifiedCell[0], lastModifiedCell[1]);
            } else {
            // If there are solutions available
                let nextCell = this.nextCell(xCoordinate, yCoordinate);
                this.buildBoard(nextCell[0], nextCell[1]);
            }
        } else {
            console.log(this.death)
            return;
        }

    }
}
