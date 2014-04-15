function Tile(state) {
    this.x = state.x;
    this.y = state.y;
    this.n = state.n;
    this.isball = state.isball;
    this.istile = state.istile;
    this.n = state.n;
}
Tile.prototype.updatePosition = function(position) {
    this.x = position.x;
    this.y = position.y;
};
Tile.prototype.addBall = function() {
    this.isball = true;
}
Tile.prototype.removeBall = function() {
    this.isball = false;
}

Tile.prototype.serialize = function () {
  return {

      n: this.n,

    isball: this.isball,
    istile: this.istile
  };
};