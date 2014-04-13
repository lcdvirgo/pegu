function Tile(a){this.x=a.x,this.y=a.y,this.isball=a.isball,this.istile=a.istile,this.n=a.n,this.previousState=null}function Grid(a,b,c){this.size=a,this.level=c,this.cells=b?this.fromState(b):this.empty()}function Display(a){function b(a){d.update&&(d.update=!1,c.update(a))}this.events={},this.grid=a,this.availableMoves={up:!1,right:!1,down:!1,left:!1},this.moved=!1,this.tiles=[],this.score=0,this.canvas=document.getElementById("testCanvas"),this.stage=new createjs.Stage(this.canvas),createjs.Touch.enable(this.stage),createjs.Ticker.addEventListener("tick",b),this.stage.enableMouseOver(10),this.stage.mouseMoveOutside=!0,this.container=new createjs.Container,this.container.x=250,this.container.y=50,this.stage.addChild(this.container),this.board=new createjs.Container,this.container.addChild(this.board),this.balls=new createjs.Container,this.container.addChild(this.balls),this.ismoving=!1,this.size=0,this.selected,this.update=!1,this.w=70,this.h=70,this.ballw=64,this.ballh=64,window.alphaThresh=.75;var c=this.stage,d=this}function LocalStorageManager(){this.bestScoreKey="bestScore",this.gameStateKey="gameState";var a=this.localStorageSupported();this.storage=a?window.localStorage:window.fakeStorage}function Game(a,b,c){this.size=a,this.storageManager=new c,this.levels=this.readLevels(),this.setup()}function Play(){this.levels=this.readLevels(),this.currentLevel=1,this.params=levels[currentLevel]}Tile.prototype.saveState=function(){this.previousState={isball:this.isball,istile:this.istile,x:this.x,y:this.y}},Tile.prototype.updatePosition=function(a){this.x=a.x,this.y=a.y},Tile.prototype.addBall=function(){this.isball=!0},Tile.prototype.removeBall=function(){this.isball=!1},Tile.prototype.updateState=function(a){this.istile=a.istile,this.isball=a.isball,this.x=a.x,this.y=a.y,this.n=a.n},Tile.prototype.serialize=function(){return{position:{isball:this.isball,istile:this.istile,n:this.n}}},Grid.prototype.empty=function(){for(var a=[],b=1,c=0;c<this.size;c++)for(var d=a[c]=[],e=0;e<this.size;e++){var f={};f.isball=$.inArray(b,this.level.currentScheme)>=0&&$.inArray(b,this.level.emptySpots)<0?!0:!1,f.istile=$.inArray(b,this.level.currentScheme)>=0?!0:!1,f.n=b;var g=new Tile(f);d.push(g),b++}return a},Grid.prototype.movesAvailable=function(a){var b={up:!1,right:!1,down:!1,left:!1},c=this,d=c.getTile(a);return this.eachCell(function(e,f){var g=c.cells[e][f];0==g.isball&&1==g.istile&&(g.n==a-2*c.size&&1==c.getTile(a-c.size).isball&&d.y==g.y?b.left=a-2*c.size:g.n==a+2*c.size&&1==c.getTile(a+c.size).isball&&d.y==g.y?b.right=a+2*c.size:g.n==a-2&&1==c.getTile(a-1).isball&&d.x==g.x?b.up=a-2:g.n==a+2&&1==c.getTile(a+1).isball&&d.x==g.x&&(b.down=a+2))}),b},Grid.prototype.eachCell=function(a){for(var b=0;b<this.size;b++)for(var c=0;c<this.size;c++)a(b,c,this.cells[b][c])},Grid.prototype.getTile=function(a){var b;return this.eachCell(function(c,d,e){e.n==a&&(b=e)}),b},Grid.prototype.moveTile=function(a,b){var c,d={};d.old_n=this.getTile(a),d.new_n=this.getTile(b),d.new_n.addBall(),d.old_n.removeBall(),b-2*this.size==a?(c=b-this.size,d.middle_n=this.getTile(c),d.middle_n.removeBall()):b+2*this.size==a?(c=b+this.size,d.middle_n=this.getTile(c),d.middle_n.removeBall()):b+2==a?(c=b+1,d.middle_n=this.getTile(c),d.middle_n.removeBall()):b-2==a&&(c=b-1,d.middle_n=this.getTile(c),d.middle_n.removeBall());var e={new_n:d.new_n.n,old_n:d.old_n.n,middle_n:d.middle_n.n};return e},Display.prototype.on=function(a,b){this.events[a]||(this.events[a]=[]),this.events[a].push(b)},Display.prototype.emit=function(a,b){var c=this.events[a];c&&c.forEach(function(a){a(b)})},Display.prototype.moveTile=function(a){var b=this.tiles[a.middle_n],c=this.tiles[a.old_n];this.tiles[a.new_n]=c,c.n=a.new_n,this.balls.removeChild(b)},Display.prototype.setAvailableMoves=function(a){this.availableMoves=a},Display.prototype.actuate=function(a){var b=this;this.size=a.size,window.requestAnimationFrame(function(){for(var c=0;c<a.cells.length;c++)for(var d=a.cells[c],e=0;e<d.length;e++){var f=d[e],g={};g.x=c*b.w,g.y=e*b.h,f.updatePosition(g),b.addNewTile(f),b.addNewBall(f)}})},Display.prototype.pressup=function(a){var b=this;if(b.moved)b.moved=!1;else{var c=a.currentTarget;c.x=c.start.x,c.y=c.start.y}b.update=!0},Display.prototype.mousedown=function(a){var b=this,c=a.currentTarget;c.parent.addChild(c),c.offset={x:c.x-a.stageX,y:c.y-a.stageY},c.start={x:c.x,y:c.y},b.ismoving=!0,b.emit("mousedown",{x:c.x,y:c.y,n:c.n})},Display.prototype.pressmove=function(a){var b=this,c=a.currentTarget;if(b.availableMoves&&!b.moved){var d=!1;if(b.availableMoves.left&&c.x<=c.start.x){var e=b.grid.getTile(b.availableMoves.left);c.x=a.stageX+c.offset.x,c.x<e.x+b.w/2&&(d=!0)}if(b.availableMoves.right&&c.x>=c.start.x){var e=b.grid.getTile(b.availableMoves.right);c.x=a.stageX+c.offset.x,c.x>e.x-b.w/2&&(d=!0)}if(b.availableMoves.down&&c.y>=c.start.y){var e=b.grid.getTile(b.availableMoves.down);c.y=a.stageY+c.offset.y,c.y>e.y-b.h/2&&(d=!0)}if(b.availableMoves.up&&c.y<=c.start.y){var e=b.grid.getTile(b.availableMoves.up);c.y=a.stageY+c.offset.y,c.y<e.y+b.h/2&&(d=!0)}d&&(b.emit("pressup",{n:c.n,new_n:e.n}),c.x=e.x,c.y=e.y,b.moved=!0)}b.update=!0,b.selected=c},Display.prototype.rollover=function(a){var b=this,c=a.target;c.scaleX=c.scaleY=1.04*c.scale,b.update=!0},Display.prototype.rollout=function(a){var b=this,c=a.target;c.scaleX=c.scaleY=c.scale,b.update=!0},Display.prototype.addNewBall=function(a){var b=this;if(a.isball&&a.istile){var c=(new createjs.Graphics).beginFill("rgba(255,255,255,1)").drawRoundRect(0,0,b.ballw,b.ballh,5),d=new createjs.Shape(c),e=new createjs.Text(a.n,"14px Arial","#ff7700");e.x=30,e.y=30,d.x=b.w/2,d.y=b.h/2,d.scale=1,d.regX=b.ballw/2,d.regY=b.ballh/2;var f=new createjs.Container;f.addChild(d),f.name="ball_"+a.n,f.x=a.x,f.y=a.y,f.n=a.n,f.cursor="pointer",this.tiles[a.n]=f,b.balls.addChild(f),f.addEventListener("pressup",function(a){b.pressup(a)}),f.addEventListener("mousedown",function(a){b.mousedown(a)}),f.addEventListener("pressmove",function(a){b.pressmove(a)}),d.addEventListener("rollover",function(a){b.rollover(a)}),d.addEventListener("rollout",function(a){b.rollout(a)})}},Display.prototype.addNewTile=function(a){var b=this,c=new createjs.Container;c.name="square_"+a.n;var d="";d=a.isball?a.n+" ball":a.n+" empty";new createjs.Text(d,"14px Arial","#ff7700");if(a.istile){var e=(new createjs.Graphics).beginFill("rgba(90,255,24,1)").drawRoundRect(0,0,b.w,b.h,2),f=new createjs.Shape(e);c.x=a.x,c.y=a.y,c.addChild(f),b.board.addChild(c)}b.update=!0},window.fakeStorage={_data:{},setItem:function(a,b){return this._data[a]=String(b)},getItem:function(a){return this._data.hasOwnProperty(a)?this._data[a]:void 0},removeItem:function(a){return delete this._data[a]},clear:function(){return this._data={}}},LocalStorageManager.prototype.localStorageSupported=function(){var a="test",b=window.localStorage;try{return b.setItem(a,"1"),b.removeItem(a),!0}catch(c){return!1}},LocalStorageManager.prototype.getBestScore=function(){return this.storage.getItem(this.bestScoreKey)||0},LocalStorageManager.prototype.setBestScore=function(a){this.storage.setItem(this.bestScoreKey,a)},LocalStorageManager.prototype.getGameState=function(){var a=this.storage.getItem(this.gameStateKey);return a?JSON.parse(a):null},LocalStorageManager.prototype.setGameState=function(a){this.storage.setItem(this.gameStateKey,JSON.stringify(a))},LocalStorageManager.prototype.clearGameState=function(){this.storage.removeItem(this.gameStateKey)},Game.prototype.mousedown=function(a){var b=this.grid.movesAvailable(a.n);this.display.setAvailableMoves(b)},Game.prototype.pressup=function(a){var b=this.grid.moveTile(a.n,a.new_n);b&&this.display.moveTile(b)},Game.prototype.pressmove=function(){},Game.prototype.setup=function(){var a=this.storageManager.getGameState();a||(this.grid=new Grid(this.size,null,this.levels[0]),this.display=new Display(this.grid)),this.display.on("mousedown",this.mousedown.bind(this)),this.display.on("pressup",this.pressup.bind(this)),this.actuate()},Game.prototype.readLevels=function(){var a;return $.ajax({url:"levels/levels.json",success:function(b){a=b},async:!1}),a},Game.prototype.actuate=function(){this.display.actuate(this.grid,{score:this.score,over:this.over,won:this.won,bestScore:this.storageManager.getBestScore(),terminated:this.isGameTerminated()})},Game.prototype.isGameTerminated=function(){return this.over||this.won&&!this.keepPlaying?!0:!1},Play.prototype.readLevels=function(){var a;return $.ajax({url:"levels/levels.json",success:function(b){a=b},async:!1}),a},Play.prototype.outputGrid=function(){return new Grid},window.requestAnimationFrame(function(){new Game(7,Display,LocalStorageManager)});