function Game() {
    //this.storageManager = new Storage;
    this.levels = this.readLevels();
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
    this.grid = new Grid(7, null, this.levels[0]);
    this.display = new Display(this.grid);
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
    this.display.actuate(this.grid, {
        score: '?'
    });
};