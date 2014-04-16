function Tile(a){this.x=a.x,this.y=a.y,this.n=a.n,this.isball=a.isball,this.istile=a.istile,this.width=a.width,this.height=a.height}function Grid(a,b){this.size=7,this.level=b,this.storage=a,this.cells=this.build()}function Display(){this.events={},this.availableMoves={up:!1,right:!1,down:!1,left:!1},this.moved=!1,this.balls=[],this.score=0,this.init()}function LocalStorage(){this.levelID="pegu_level";var a=this.localStorageSupported();this.storage=a?window.localStorage:window.bkStorage}function Game(a){this.storage=new a,this.ison=!1,this.init()}Tile.prototype.updateState=function(a){this.x=a.x,this.y=a.y,this.width=a.width,this.height=a.height},Tile.prototype.addBall=function(){this.isball=!0},Tile.prototype.removeBall=function(){this.isball=!1},Tile.prototype.serialize=function(){return{n:this.n,isball:this.isball,istile:this.istile}},Grid.prototype.build=function(){for(var a=[],b=1,c=this.storage?this.storage.grid:this.level,d=0;d<this.size;d++)for(var e=a[d]=[],f=0;f<this.size;f++){var g={};g.isball=$.inArray(b,c.currentScheme)>=0&&$.inArray(b,c.emptySpots)<0?!0:!1,g.istile=$.inArray(b,c.currentScheme)>=0?!0:!1,g.n=b;var h=new Tile(g);e.push(h),b++}return a},Grid.prototype.serialize=function(){var a=[],b=[];return this.eachCell(function(c,d,e){e.istile&&a.push(e.n),e.isball||b.push(e.n)}),{currentScheme:a,emptySpots:b}},Grid.prototype.movesAvailable=function(a){var b={up:!1,right:!1,down:!1,left:!1},c=this,d=c.getTile(a);return this.eachCell(function(e,f){var g=c.cells[e][f];0==g.isball&&1==g.istile&&(g.n==a-2*c.size&&1==c.getTile(a-c.size).isball&&d.y==g.y?b.left=a-2*c.size:g.n==a+2*c.size&&1==c.getTile(a+c.size).isball&&d.y==g.y?b.right=a+2*c.size:g.n==a-2&&1==c.getTile(a-1).isball&&d.x==g.x?b.up=a-2:g.n==a+2&&1==c.getTile(a+1).isball&&d.x==g.x&&(b.down=a+2))}),b},Grid.prototype.eachCell=function(a){for(var b=0;b<this.size;b++)for(var c=0;c<this.size;c++)a(b,c,this.cells[b][c])},Grid.prototype.getTile=function(a){var b;return this.eachCell(function(c,d,e){e.n==a&&(b=e)}),b},Grid.prototype.moveTile=function(a,b){var c,d={};d.from_n=this.getTile(a),d.to_n=this.getTile(b),d.to_n.addBall(),d.from_n.removeBall(),b-2*this.size==a&&(c=b-this.size,d.eaten=this.getTile(c),d.eaten.removeBall()),b+2*this.size==a&&(c=b+this.size,d.eaten=this.getTile(c),d.eaten.removeBall()),b+2==a&&(c=b+1,d.eaten=this.getTile(c),d.eaten.removeBall()),b-2==a&&(c=b-1,d.eaten=this.getTile(c),d.eaten.removeBall());var e={to_n:d.to_n.n,from_n:d.from_n.n,eaten:d.eaten.n};return e},Display.prototype.tick=function(a){this.update&&(this.update=!1,this.stage.update(a))},Display.prototype.init=function(){var a=this,b=document.getElementById("canvasHolder"),c=document.createElement("canvas");c.id="pegu",c.width=window.innerHeight,c.height=window.innerHeight,b.appendChild(c),this.canvas=c,this.canvas.width=window.innerWidth,this.canvas.height=window.innerWidth,this.stage=new createjs.Stage(this.canvas),this.stage.enableMouseOver(10),this.stage.mouseMoveOutside=!0,this.container=new createjs.Container,this.stage.addChild(this.container),this.scoreBoard=document.getElementById("scoreboard"),createjs.Touch.enable(this.stage),createjs.Ticker.addEventListener("tick",function(b){a.tick(b)}),window.alphaThresh=.75,$(window).resize(function(){clearTimeout(this.resizeTO),this.resizeTO=setTimeout(function(){a.draw()},100)})},Display.prototype.eachChildren=function(a,b){for(var c=0;c<a.children.length;c++)b(a.children[c])},Display.prototype.draw=function(){var a=window.innerWidth,b=window.innerHeight,c=Math.min(a,b),d=c/(this.size+1||8);this.container.removeAllChildren(),this.container.removeAllEventListeners(),this.board=new createjs.Container,this.container.addChild(this.board),this.tiles=new createjs.Container,this.board.addChild(this.tiles),this.pegs=new createjs.Container,this.board.addChild(this.pegs),this.canvas.width=a,this.canvas.height=b;for(var e=0;e<this.grid.cells.length;e++)for(var f=this.grid.cells[e],g=0;g<f.length;g++){var h=f[g],i={};i.x=e*d,i.y=g*d,i.width=d,i.height=d,h.updateState(i),this.addNewTile(h),this.addNewBall(h)}this.board.x=a/2-this.size*d/2,this.board.y=b/2-this.size*d/2,this.update=!0},Display.prototype.render=function(a,b){this.gameStatus=b,this.size=a.size,this.grid=a,this.draw()},Display.prototype.on=function(a,b){this.events[a]||(this.events[a]=[]),this.events[a].push(b)},Display.prototype.emit=function(a,b){var c=this.events[a];c&&c.forEach(function(a){a(b)})},Display.prototype.moveTile=function(a){var b=this.balls[a.eaten],c=this.balls[a.from_n];this.balls[a.to_n]=c,c.n=a.to_n,this.pegs.removeChild(b)},Display.prototype.setAvailableMoves=function(a){this.availableMoves=a},Display.prototype.pressup=function(a){if(this.gameStatus){var b=a.target;if(b.scaleX=b.scaleY=b.scale,this.moved)this.moved=!1;else{var c=a.currentTarget;c.x=c.start.x,c.y=c.start.y}this.update=!0}},Display.prototype.mousedown=function(a){if(this.gameStatus){var b=a.target;b.scaleX=b.scaleY=1.04*b.scale;var c=a.currentTarget;c.parent.addChild(c),c.offset={x:c.x-a.stageX,y:c.y-a.stageY},c.start={x:c.x,y:c.y},this.emit("mousedown",{x:c.x,y:c.y,n:c.n})}},Display.prototype.pressmove=function(a){if(this.gameStatus){var b=a.currentTarget;if(this.availableMoves&&!this.moved){var c=!1,d=Math.abs(b.x-b.start.x),e=Math.abs(b.y-b.start.y),f=4;if(d>f||e>f)if(d>e){if(this.availableMoves.left&&b.x<=b.start.x){var g=this.grid.getTile(this.availableMoves.left);b.x=a.stageX+b.offset.x,b.y=g.y,b.x<g.x+g.width/2&&(c=!0)}if(this.availableMoves.right&&b.x>=b.start.x){var g=this.grid.getTile(this.availableMoves.right);b.x=a.stageX+b.offset.x,b.y=g.y,b.x>g.x-g.width/2&&(c=!0)}}else{if(this.availableMoves.down&&b.y>=b.start.y){var g=this.grid.getTile(this.availableMoves.down);b.y=a.stageY+b.offset.y,b.x=g.x,b.y>g.y-g.height/2&&(c=!0)}if(this.availableMoves.up&&b.y<=b.start.y){var g=this.grid.getTile(this.availableMoves.up);b.y=a.stageY+b.offset.y,b.x=g.x,b.y<g.y+g.height/2&&(c=!0)}}else b.y=a.stageY+b.offset.y,b.x=a.stageX+b.offset.x;c&&(this.emit("pressup",{n:b.n,to_n:g.n}),b.x=g.x,b.y=g.y,this.moved=!0)}this.update=!0}},Display.prototype.rollover=function(a){a.target.scaleX=a.target.scaleY=a.target.scale,this.update=!0},Display.prototype.rollout=function(a){a.target.scaleX=a.target.scaleY=a.target.scale,this.update=!0},Display.prototype.displayWin=function(){var a=document.createElement("span");a.setAttribute("id","score"),a.appendChild(document.createTextNode("Pegu!"));var b=document.getElementById("score");this.scoreBoard.replaceChild(a,b)},Display.prototype.setScore=function(a){var b=document.createElement("span");b.setAttribute("id","score"),b.appendChild(document.createTextNode(a));var c=document.getElementById("score");this.scoreBoard.replaceChild(b,c)},Display.prototype.addNewBall=function(a){var b=this;if(a.isball&&a.istile){var c={width:a.width-10*a.width/100,height:a.height-10*a.height/100},d=(new createjs.Graphics).beginFill("rgba(255,255,255,1)").drawRoundRect(0,0,c.width,c.height,5),e=new createjs.Shape(d),f=new createjs.Container;e.scale=1,e.regX=c.width/2,e.regY=c.height/2,e.x=a.width/2,e.y=a.height/2,f.name="ball_"+a.n,f.x=a.x,f.y=a.y,f.n=a.n,this.gameStatus&&(f.cursor="pointer"),f.addChild(e),this.balls[a.n]=f,this.pegs.addChild(f),f.addEventListener("pressup",function(a){b.pressup(a)}),f.addEventListener("mousedown",function(a){b.mousedown(a)}),f.addEventListener("pressmove",function(a){b.pressmove(a)}),e.addEventListener("rollover",function(a){b.rollover(a)}),e.addEventListener("rollout",function(a){b.rollout(a)})}},Display.prototype.addNewTile=function(a){var b=new createjs.Container;if(b.name="square_"+a.n,a.istile){var c=(new createjs.Graphics).beginFill("rgba(240,117,110,1)").drawRoundRect(0,0,a.width,a.height,2),d=new createjs.Shape(c);b.x=a.x,b.y=a.y,b.addChild(d),this.tiles.addChild(b)}this.update=!0},window.bkStorage={_data:{},setItem:function(a,b){return this._data[a]=String(b)},getItem:function(a){return this._data.hasOwnProperty(a)?this._data[a]:void 0},removeItem:function(a){return delete this._data[a]},clear:function(){return this._data={}}},LocalStorage.prototype.localStorageSupported=function(){var a="test",b=window.localStorage;try{return b.setItem(a,"1"),b.removeItem(a),!0}catch(c){return!1}},LocalStorage.prototype.getBestScore=function(){return this.storage.getItem(this.bestScoreKey)||0},LocalStorage.prototype.setBestScore=function(a){this.storage.setItem(this.bestScoreKey,a)},LocalStorage.prototype.setLevelID=function(a){this.storage.setItem(this.levelID,a)},LocalStorage.prototype.getLevelID=function(){return this.storage.getItem(this.levelID)},LocalStorage.prototype.clearLevel=function(){this.storage.removeItem("game_level_"+this.getLevelID())},LocalStorage.prototype.getLevel=function(a){var b=this.storage.getItem("pegu_level_"+a);return b?JSON.parse(b):null},LocalStorage.prototype.setLevel=function(a){var b="pegu_level_"+a.level;this.storage.setItem(b,JSON.stringify(a))},LocalStorage.prototype.setGameStatus=function(a){this.storage.setItem("pegu_status",a)},LocalStorage.prototype.getGameStatus=function(){return this.storage.getItem("pegu_status")||0},Game.prototype.mousedown=function(a){var b=this.grid.movesAvailable(a.n);this.display.setAvailableMoves(b)},Game.prototype.pressup=function(a){var a=this.grid.moveTile(a.n,a.to_n);a&&(this.display.moveTile(a),this.addPoints(),this.saveState())},Game.prototype.pressmove=function(){},Game.prototype.init=function(){this.levels=this.readLevels(),this.levelID=this.storage.getLevelID()||this.levels.length-1,this.display=new Display,this.render()},Game.prototype.addPoints=function(){this.score--,this.displayPoints()},Game.prototype.displayPoints=function(){1==this.score?this.display.displayWin():this.display.setScore(this.score)},Game.prototype.readLevels=function(){var a;return $.ajax({url:"levels/levels.json",success:function(b){a=b},async:!1}),a},Game.prototype.render=function(){this.levelID=this.levelID<0?this.levels.length-1:this.levelID,this.levelID=this.levels[this.levelID]?this.levelID:0;var a=this.levels[this.levelID].currentScheme.length-this.levels[this.levelID].emptySpots.length;this.storage.setLevelID(this.levelID),this.level=this.storage.getLevel(this.levelID),this.score=this.level?this.level.score:a,this.grid=new Grid(this.level,this.levels[this.levelID]),this.display.render(this.grid,this.getGameStatus()),this.displayPoints()},Game.prototype.getGameStatus=function(){return this.storage.getGameStatus()},Game.prototype.start=function(){this.levelID=0,this.storage.setGameStatus(1),this.render(),this.display.on("mousedown",this.mousedown.bind(this)),this.display.on("pressup",this.pressup.bind(this))},Game.prototype.restart=function(){this.storage.clearLevel(),this.render()},Game.prototype.nextLevel=function(){this.saveState(),this.levelID++,this.render()},Game.prototype.previousLevel=function(){this.saveState(),this.levelID--,this.render()},Game.prototype.saveState=function(){this.grid&&this.storage.setLevel({grid:this.grid.serialize(),score:this.score,level:this.levelID})},jQuery(document).ready(function(a){var b=new Game(LocalStorage);1==b.getGameStatus()?(a("header").hide(),a("#info,#buttons,#panel").show("500"),b.start()):(a("header").show("500"),a("#info,#buttons,#panel").hide("500")),a(".play a").on("click",function(c){c.preventDefault(),a("header").hide("500"),a("#info,#buttons,#panel").show("500"),1==b.getGameStatus()||b.start()}),a("#infobtn").on("click",function(b){b.preventDefault(),a("header").show("500"),a("#info,#buttons,#panel").hide("500")}),a("#refresh").on("click",function(a){a.preventDefault(),b.restart()}),a("#next").on("click",function(a){a.preventDefault(),b.nextLevel()}),a("#previous").on("click",function(a){a.preventDefault(),b.previousLevel()}),a(window).unload(function(){b.saveState()})});