function Game(Storage) {
    //this.storageManager = new Storage;

    this.storage = new Storage;
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
    this.levelID = 0;
    
    this.display = new Display();
    this.display.on("mousedown", this.mousedown.bind(this));
    this.display.on("pressup", this.pressup.bind(this));
    this.render();
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
    this.grid = new Grid(7, null, this.levels[this.levelID]);
    this.display.render(this.grid, {
        score: '?'
    });
};
Game.prototype.restart = function() {
    this.render();
};
Game.prototype.nextLevel = function() {
    this.levelID++;
    this.render();
};
Game.prototype.previousLevel = function() {
    this.levelID--;
    this.render();
};