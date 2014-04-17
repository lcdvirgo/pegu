function Sound(){
	

this.createMoveSound();
}


Sound.prototype.move = function(){

    // if initializeDefaultPlugins returns false, we cannot play sound
  
   this.moveSound = createjs.Sound.play("move"); 
    // moveSound.addEventListener("complete", createjs.proxy(this.handleComplete, this));
     this.moveSound.volume = 0.2;


}


Sound.prototype.createMoveSound = function(){

  if (!createjs.Sound.initializeDefaultPlugins()) {return;}
 

    createjs.Sound.alternateExtensions = ["mp3"];



  createjs.Sound.alternateExtensions = ["mp3"];
 //createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandler, this));
 createjs.Sound.registerSound("sounds/move.ogg", "move");



}