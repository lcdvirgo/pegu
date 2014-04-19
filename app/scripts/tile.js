function Tile(state) {
    this.x = state.x;
    this.y = state.y;
    this.n = state.n;
    this.isball = state.isball;
    this.istile = state.istile;
    this.width = state.width;
    this.height = state.height;
}

Tile.prototype.getState = function() {
    return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height

    };
}


Tile.prototype.updateState = function(state) {
    this.x = state.x;
    this.y = state.y;
    this.width = state.width;
    this.height = state.height;
};




Tile.prototype.addBall = function() {
    this.isball = true;
}
Tile.prototype.removeBall = function() {
    this.isball = false;
}




Tile.prototype.serialize = function() {
    return {
        n: this.n,
        isball: this.isball,
        istile: this.istile
    };
};