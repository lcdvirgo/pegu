function Tile(state) {
  this.x                = state.x;
  this.y                = state.y;
  this.isball                = state.isball;
  this.istile                = state.istile;
  this.n            = state.n;

  this.previousState = null;

}

Tile.prototype.saveState = function () {
  this.previousState = { isball: this.isball, istile: this.istile, x: this.x, y:this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.addBall = function(){

  this.isball = true;
}
Tile.prototype.removeBall = function(){

  this.isball = false;
}

Tile.prototype.updateState = function (state) {
  this.istile = state.istile;
  this.isball = state.isball;
  this.x = state.x;
  this.y = state.y; 
  this.n = state.n;  
};

Tile.prototype.serialize = function () {
  return {
    position: {
      isball: this.isball,
      istile: this.istile,
      n: this.n
    }
  };
};
