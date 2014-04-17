function Sound() {
    this.createMoveSound();
}
Sound.prototype.victory = function() {
    this.moveSound = createjs.Sound.play("victory");
    this.moveSound.volume = 0.2;
}
Sound.prototype.move = function() {
    this.moveSound = createjs.Sound.play("move");
    this.moveSound.volume = 0.2;
}
Sound.prototype.createMoveSound = function() {
    if (!createjs.Sound.initializeDefaultPlugins()) {
        return;
    }
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound("sounds/move.ogg", "move");
    createjs.Sound.registerSound("sounds/victory.ogg", "victory");
}