function Game(Storage) {
    //this.storageManager = new Storage;
    this.storage = new Storage;
    this.ison = false;
    this.init();
}
Game.prototype.mousedown = function(o) {
    var movesAvailable = this.grid.movesAvailable(o.n);
    this.display.setAvailableMoves(movesAvailable);
}
Game.prototype.pressup = function(move) {
    var move = this.grid.moveTile(move.n, move.to_n);
    if (move) {
        this.display.moveTile(move);
        this.addPoints();
        this.saveState();
    }
}
Game.prototype.pressmove = function() {
    //debugger;
}
Game.prototype.init = function() {
    this.levels = this.readLevels();
    this.levelID = this.storage.getLevelID() || this.levels.length - 1;
    this.display = new Display();
    this.render();
};
Game.prototype.addPoints = function() {
    this.score--;
    this.displayPoints();
}
Game.prototype.displayPoints = function() {
    if (this.score == 1) {
        this.display.displayWin();
    } else {
        this.display.setScore(this.score);
    }
}
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
Game.prototype.render = function() {
    this.levelID = this.levelID < 0 ? this.levels.length - 1 : this.levelID;
    this.levelID = this.levels[this.levelID] ? this.levelID : 0;
    var defaultScore = this.levels[this.levelID].currentScheme.length - this.levels[this.levelID].emptySpots.length;
    this.storage.setLevelID(this.levelID);
    this.level = this.storage.getLevel(this.levelID);
    this.score = this.level ? this.level.score : defaultScore;
    this.grid = new Grid(this.level, this.levels[this.levelID]);

    this.display.render(this.grid,this.getGameStatus());
    this.displayPoints();
};
Game.prototype.getGameStatus = function() {
    return this.storage.getGameStatus();
}
Game.prototype.start = function() {
    this.levelID = 0;

    this.storage.setGameStatus(1);
    this.render();
    this.display.on("mousedown", this.mousedown.bind(this));
    this.display.on("pressup", this.pressup.bind(this));
};
Game.prototype.restart = function() {
    this.storage.clearLevel();
    this.render();
};
Game.prototype.nextLevel = function() {
    this.saveState();
    this.levelID++;
    this.render();
};
Game.prototype.previousLevel = function() {
    this.saveState();
    this.levelID--;
    this.render();
};
Game.prototype.saveState = function() {
    if (this.grid) {
        this.storage.setLevel({
            grid: this.grid.serialize(),
            score: this.score,
            level: this.levelID
        });
    }
};