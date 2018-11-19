class Cell {
    constructor(x,y){
        this.xCoordinate = x;
        this.yCoordinate = y;
        this.cellSolution = null;
        this.solution; // set once a solution has been picked
        this.possibleSolutions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.triedSolutions = []; // add numbers to this when they are applied to a cell
        this.htmlCell = document.getElementById('' + x + y);
        this.name = 'cell' + x + y;
    }

    remPossibleSolution(number) {
        let indexOfNumber = this.possibleSolutions.indexOf(number);
        if (indexOfNumber != -1) {
            this.possibleSolutions.splice(indexOfNumber, 1);
        }
    }

    addPossibleSolution(number) {
        if (!this.possibleSolutions.includes(number) && !this.triedSolutions.includes(number)) {
            this.possibleSolutions.push(number);
        }
    }

    pickSolution() {
        let randomNumber = Math.floor(Math.random() * this.possibleSolutions.length);
        this.solution = this.possibleSolutions[randomNumber];
        return this.solution;
    }

    getName() {
        return this.name;
    }

    getCoordinates() {
        return [this.xCoordinate, this.yCoordinate];
    }

    getPossibleSolutions() {
        return this.possibleSolutions;
    }

    getHtmlCell() {
        return this.htmlCell;
    }
}
