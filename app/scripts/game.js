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
    var tile = this.grid.moveTile(move.n, move.to_n);
    if (tile) {
        this.display.moveTile(tile);
    }
}
Game.prototype.pressmove = function() {
    //debugger;
}
Game.prototype.init = function() {
    //var previousState = this.storage.getGameState();
    this.levels = this.readLevels();
    this.levelID = this.storage.getLevelID();
    this.display = new Display();
    this.display.on("mousedown", this.mousedown.bind(this));
    this.display.on("pressup", this.pressup.bind(this));
    
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
Game.prototype.render = function() {
    this.levelID = this.levelID < 0 ? this.levels.length - 1 : this.levelID;
    this.levelID = this.levels[this.levelID] ? this.levelID : 0;
    this.storage.setLevelID(this.levelID);
    var storage = this.storage.getLevel(this.levelID);

    this.grid = new Grid(storage, this.levels[this.levelID]);
    this.display.render(this.grid, {
        score: storage ? storage.score:0
    });
};

Game.prototype.getGameStatus = function(){
    return this.storage.getGameStatus();
}

Game.prototype.start = function() {
this.storage.setGameStatus(1);
this.render();
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
            score: 1,
            level: this.levelID
        });
    }
};