function Game(size, Actuator, StorageManager) {
    this.size = size; // Size of the grid
    // this.inputManager   = new InputManager;
    this.storageManager = new StorageManager;
    
    this.levels = this.readLevels();
    //this.display.on("pressmove", this.pressmove.bind(this));

    //this.inputManager.on("move", this.move.bind(this));
    //this.inputManager.on("restart", this.restart.bind(this));
    //this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
    this.setup();
}
Game.prototype.mousedown = function(o) {
    var movesAvailable = this.grid.movesAvailable(o.n);
    this.display.setAvailableMoves(movesAvailable);

}
Game.prototype.pressup = function(move) {


    var tile = this.grid.moveTile(move.n,move.new_n);

    if(tile){
      this.display.moveTile(tile);
    }

}
Game.prototype.pressmove = function() {
    //debugger;
}

Game.prototype.setup = function() {
    var previousState = this.storageManager.getGameState();
    // Reload the game from a previous game if present
    if (previousState) {
        // this.grid        = new Grid(previousState.grid.size,
        //                             previousState.grid.cells); // Reload grid
        // this.score       = previousState.score;
        // this.over        = previousState.over;
        // this.won         = previousState.won;
        // this.keepPlaying = previousState.keepPlaying;
    } else {
        this.grid = new Grid(this.size, null, this.levels[0]);
        this.display = new Display(this.grid);
        // this.score       = 0;
        // this.over        = false;
        // this.won         = false;
        // this.keepPlaying = false;
        // Add the initial tiles
     
    }

    this.display.on("mousedown", this.mousedown.bind(this));
    this.display.on("pressup", this.pressup.bind(this));


    // Update the actuator
    this.actuate();
};

Game.prototype.readLevels = function() {
    var res;
    $.ajax({
        url: 'levels/levels.json',
        success: function(result) {
            res = result;
        },
        async: false
    });
    return res;
};
// Sends the updated grid to the actuator
Game.prototype.actuate = function() {
    // if (this.storageManager.getBestScore() < this.score) {
    //   this.storageManager.setBestScore(this.score);
    // }
    // Clear the state when the game is over (game over only, not win)
    // if (this.over) {
    //   this.storageManager.clearGameState();
    // } else {
    //   this.storageManager.setGameState(this.serialize());
    // }
    this.display.actuate(this.grid, {
        score: this.score,
        over: this.over,
        won: this.won,
        bestScore: this.storageManager.getBestScore(),
        terminated: this.isGameTerminated()
    });
};
// Return true if the game is lost, or has won and the user hasn't kept playing
Game.prototype.isGameTerminated = function() {
    if (this.over || (this.won && !this.keepPlaying)) {
        return true;
    } else {
        return false;
    }
};