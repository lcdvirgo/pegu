function Tile(a){this.ratio=window.devicePixelRatio||1,this.n=a.n,this.isball=a.isball,this.istile=a.istile}function Grid(a,b){this.size=b.size,this.level=b,this.storage=a,this.cells=this.build()}function Display(){this.events={},this.availableMoves={up:!1,right:!1,down:!1,left:!1},this.moved=!1,this.balls=[],this.score=0,this.init()}function LocalStorage(){this.levelID="pegu_level";var a=this.localStorageSupported();this.storage=a?window.localStorage:window.bkStorage}function Social(){}function Sound(){this.createMoveSound()}function Game(a,b,c){this.storage=new a,this.social=new b,this.shortcurmove=!1,this.sound=new c,this.ison=!1,this.init()}Tile.prototype.getState=function(){return{x:this.x,y:this.y,width:this.width,height:this.height}},Tile.prototype.updateState=function(a){this.x=a.x*this.ratio,this.y=a.y*this.ratio,this.width=a.width*this.ratio,this.height=a.height*this.ratio},Tile.prototype.addBall=function(){this.isball=!0},Tile.prototype.removeBall=function(){this.isball=!1},Tile.prototype.serialize=function(){return{n:this.n,isball:this.isball,istile:this.istile}},Grid.prototype.build=function(){var a=[],b=1,c=this.storage?this.storage.grid:this.level;this.balls=c.currentScheme.length-c.emptySpots.length;for(var d=0;d<this.size;d++)for(var e=a[d]=[],f=0;f<this.size;f++){var g={};g.isball=$.inArray(b,c.currentScheme)>=0&&$.inArray(b,c.emptySpots)<0?!0:!1,g.istile=$.inArray(b,c.currentScheme)>=0?!0:!1,g.n=b;var h=new Tile(g);e.push(h),b++}return a},Grid.prototype.serialize=function(){var a=[],b=[];return this.eachCell(function(c,d,e){e.istile&&a.push(e.n),!e.isball&&e.istile&&b.push(e.n)}),{currentScheme:a,emptySpots:b}},Grid.prototype.getBalls=function(){var a=[];return this.eachCell(function(b,c,d){d.isball&&a.push(d)}),a},Grid.prototype.movesArray=function(a){var b={up:!1,right:!1,down:!1,left:!1},c=this,d=c.getTile(a);return this.eachCell(function(e,f){var g=c.cells[e][f];0==g.isball&&1==g.istile&&(g.n==a-2*c.size&&1==c.getTile(a-c.size).isball&&d.y==g.y?b.left=a-2*c.size:g.n==a+2*c.size&&1==c.getTile(a+c.size).isball&&d.y==g.y?b.right=a+2*c.size:g.n==a-2&&1==c.getTile(a-1).isball&&d.x==g.x?b.up=a-2:g.n==a+2&&1==c.getTile(a+1).isball&&d.x==g.x&&(b.down=a+2))}),b},Grid.prototype.eachCell=function(a){for(var b=0;b<this.size;b++)for(var c=0;c<this.size;c++)a(b,c,this.cells[b][c])},Grid.prototype.getTile=function(a){var b;return this.eachCell(function(c,d,e){e.n==a&&(b=e)}),b},Grid.prototype.moveTile=function(a,b){var c,d={};d.from_n=this.getTile(a),d.to_n=this.getTile(b),d.to_n.addBall(),d.from_n.removeBall(),b-2*this.size==a&&(c=b-this.size,d.eaten=this.getTile(c),d.eaten.removeBall()),b+2*this.size==a&&(c=b+this.size,d.eaten=this.getTile(c),d.eaten.removeBall()),b+2==a&&(c=b+1,d.eaten=this.getTile(c),d.eaten.removeBall()),b-2==a&&(c=b-1,d.eaten=this.getTile(c),d.eaten.removeBall());var e={to_n:d.to_n.n,from_n:d.from_n.n,eaten:d.eaten.n,final_position:{x:d.to_n.x,y:d.to_n.y}};return e},Display.prototype.tick=function(a){(!a.paused||this.update)&&(this.stage.update(a),this.update=!1)},Display.prototype.pauseTicker=function(a){setTimeout(function(){createjs.Ticker.setPaused(!0)},a||100)},Display.prototype.playTicker=function(){createjs.Ticker.setPaused(!1)},Display.prototype.updateStage=function(){this.update=!0},Display.prototype.tutorial=function(){this.playTicker();var a=this;this.displayText("It's Easy!");var b=this.pegs.getChildAt(0),c=(this.pegs.getChildAt(1),this.pegs.getChildAt(3)),d=this.tiles.getChildAt(6),e=new createjs.Bitmap("images/hand.png");this.board.addChild(e),e.y=-200,e.x=b.x,createjs.Tween.get(e).call(function(){}).wait(300).to({x:b.x+20,y:b.y+20},200).wait(500).to({x:c.x+20,y:b.y+20},200).call(function(){}).wait(1e3).call(function(){}).to({x:d.x+20,y:d.y+20,alpha:0},200).wait(1e3).call(function(){a.pauseTicker()}),createjs.Tween.get(b).wait(1e3).call(function(){a.emit("mousedown",{n:b.n})}).to({x:c.x,y:b.y},200).call(function(){a.emit("pressup",{n:b.n,to_n:a.availableMoves.right})}).wait(1e3).call(function(){a.displayText("Try!"),a.emit("mousedown",{n:b.n})}).to({x:d.x,y:d.y},200).call(function(){a.displayText("Try"),a.emit("pressup",{n:b.n,to_n:a.availableMoves.down})})},Display.prototype.auto=function(){},Display.prototype.init=function(){var a=this,b=document.getElementById("canvasHolder"),c=document.createElement("canvas");c.id="pegu",c.width=window.innerHeight,c.height=window.innerHeight,b.appendChild(c),this.canvas=c,this.stage=new createjs.Stage(this.canvas),this.stage.enableMouseOver(10),this.stage.mouseMoveOutside=!0,this.container=new createjs.Container,this.stage.addChild(this.container),this.scoreBoard=document.getElementById("scoreboard"),this.textBoard=document.getElementById("panel"),this.infoBoard=document.getElementById("info"),createjs.Touch.enable(this.stage),createjs.Ticker.addEventListener("tick",function(b){a.tick(b)}),this.pauseTicker(),window.alphaThresh=.75,$(window).resize(function(){clearTimeout(this.resizeTO),this.resizeTO=setTimeout(function(){a.draw()},100)})},Display.prototype.eachChildren=function(a,b){for(var c=0;c<a.children.length;c++)b(a.children[c])},Display.prototype.draw=function(){this.playTicker(),this.emit("draw_board"),this.displayText(" "),this.drawn_balls=0,this.ratio=window.devicePixelRatio||1,createjs.Tween.removeAllTweens();var a=window.innerWidth,b=window.innerHeight,c=Math.min(a,b),d=Math.floor(c/(this.size+3||8));this.container.removeAllChildren(),this.container.removeAllEventListeners(),this.board=new createjs.Container,this.container.addChild(this.board),this.tiles=new createjs.Container,this.board.addChild(this.tiles),this.pegs=new createjs.Container,this.board.addChild(this.pegs),this.canvas.width=a*this.ratio,this.canvas.height=b*this.ratio,this.canvas.setAttribute("width",Math.round(a*this.ratio)),this.canvas.setAttribute("height",Math.round(b*this.ratio)),this.canvas.style.width=a+"px",this.canvas.style.height=b+"px",this.board.x=Math.floor(a*this.ratio/2-this.size*this.ratio*d/2),this.board.y=Math.floor(b*this.ratio/2-this.size*this.ratio*d/2),this.stage.scaleX=this.stage.scaleY=1;for(var e=0;e<this.grid.cells.length;e++)for(var f=this.grid.cells[e],g=0;g<f.length;g++){var h=f[g],i={};i.x=e*d,i.y=g*d,i.width=d,i.height=d,h.updateState(i),this.addNewTile(h),this.addNewBall(h)}},Display.prototype.render=function(a,b){this.gameStatus=b,this.size=a.size,this.grid=a,this.draw()},Display.prototype.on=function(a,b){this.events[a]||(this.events[a]=[]),this.events[a].push(b)},Display.prototype.emit=function(a,b){var c=this.events[a];c&&c.forEach(function(a){a(b)})},Display.prototype.moveTile=function(a,b){this.playTicker();var c=this,d=this.balls[a.eaten],e=this.balls[a.from_n];this.balls[a.to_n]=e,e.n=a.to_n,this.is_short=b,this.is_short&&createjs.Tween.get(e).to({x:a.final_position.x,y:a.final_position.y},100,createjs.Ease.linear).call(function(){c.pauseTicker(200),e.start.x=a.final_position.x,e.start.y=a.final_position.y,this.moved=!0}),this.pegs.removeChild(d)},Display.prototype.autoMoveTile=function(a){var b=this,c=(this.grid.getTile(a.from_n),this.grid.getTile(a.to_n)),d=this.balls[a.from_n];createjs.Tween.get(d).to({x:c.x,y:c.y},200).wait(1e3).call(function(){b.emit("automoved",{from_n:a.from_n,to_n:a.to_n,x:a.final_position.x,y:a.final_position.y})})},Display.prototype.setAvailableMoves=function(a){this.availableMoves=a},Display.prototype.pressup=function(a){if(this.gameStatus){var b=a.currentTarget,c=a.target;if(c.scaleX=c.scaleY=c.scale,this.moved){var d=b.getChildByName("helper");d&&d.removeAllChildren(),this.pauseTicker(200),this.moved=!1}else b.x=b.start.x,b.y=b.start.y,this.pauseTicker(200)}this.updateStage()},Display.prototype.mousedown=function(a){if(this.gameStatus){this.is_short=!1;var b=a.target;b.scaleX=b.scaleY=1.04*b.scale;var c=a.currentTarget;c.parent.addChild(c),c.offset={x:c.x-a.stageX,y:c.y-a.stageY},c.start={x:c.x,y:c.y},this.emit("mousedown",{x:c.x,y:c.y,n:c.n,touch:createjs.Touch.isSupported()})}},Display.prototype.pressmove=function(a){if(this.gameStatus){var b=a.currentTarget;if(this.availableMoves&&!this.moved&&!this.is_short){this.playTicker();var c=!1,d=Math.abs(b.x-b.start.x),e=Math.abs(b.y-b.start.y),f=4;if(d>f||e>f)if(d>e){if(this.availableMoves.left&&b.x<=b.start.x){var g=this.grid.getTile(this.availableMoves.left);b.x=a.stageX+b.offset.x,b.y=g.y,b.x<g.x+g.width/2&&(c=!0)}if(this.availableMoves.right&&b.x>=b.start.x){var g=this.grid.getTile(this.availableMoves.right);b.x=a.stageX+b.offset.x,b.y=g.y,b.x>g.x-g.width/2&&(c=!0)}}else{if(this.availableMoves.down&&b.y>=b.start.y){var g=this.grid.getTile(this.availableMoves.down);b.y=a.stageY+b.offset.y,b.x=g.x,b.y>g.y-g.height/2&&(c=!0)}if(this.availableMoves.up&&b.y<=b.start.y){var g=this.grid.getTile(this.availableMoves.up);b.y=a.stageY+b.offset.y,b.x=g.x,b.y<g.y+g.height/2&&(c=!0)}}else b.y=a.stageY+b.offset.y,b.x=a.stageX+b.offset.x,this.pauseTicker(20);c&&(this.emit("pressup",{n:b.n,to_n:g.n}),b.x=g.x,b.y=g.y,this.moved=!0,this.pauseTicker(20))}}},Display.prototype.getHoverHelper=function(a,b){var c=this.grid.getTile(a),d=new createjs.Shape;d.mouseEnabled=!1;var e={width:this.getPercent(c.width,10),height:this.getPercent(c.height,10)};return d.regX=e.width/2,d.regY=e.height/2,d.x=c.width/2,d.y=c.height/2,d.alpha=1,d.name="arrow_"+b,d.graphics.beginFill("rgba(240,142,118,0.4)"),"up"==b?d.graphics.drawRoundRect(0,0,e.width,e.height/4,5):"down"==b?d.graphics.drawRoundRect(0,e.height-e.height/4,e.width,e.height/4,5):"left"==b?d.graphics.drawRoundRect(0,0,e.width/4,e.height,5):"right"==b&&d.graphics.drawRoundRect(e.width-e.width/4,0,e.width/4,e.height,5),d},Display.prototype.rollover=function(a){var b=a.currentTarget;this.emit("rollover",{n:b.parent.n});var c=b.parent.getChildByName("helper");if(this.availableMoves.down){var d=this.getHoverHelper(this.availableMoves.down,"down");c.addChild(d)}if(this.availableMoves.up){var d=this.getHoverHelper(this.availableMoves.up,"up");c.addChild(d)}if(this.availableMoves.right){var d=this.getHoverHelper(this.availableMoves.right,"right");c.addChild(d)}if(this.availableMoves.left){var d=this.getHoverHelper(this.availableMoves.left,"left");c.addChild(d)}this.updateStage()},Display.prototype.rollout=function(a){var b=a.currentTarget,c=b.parent.getChildByName("helper");c.removeAllChildren(),this.updateStage()},Display.prototype.displayLevelName=function(a){var b=document.createElement("span");b.setAttribute("id","level_name"),b.appendChild(document.createTextNode(a));var c=document.getElementById("level_name");this.infoBoard.replaceChild(b,c)},Display.prototype.displayText=function(a){var b=document.createElement("span");b.setAttribute("id","textnode"),b.appendChild(document.createTextNode(a));var c=document.getElementById("textnode");this.textBoard.replaceChild(b,c)},Display.prototype.setScore=function(a){var b=document.createElement("span");b.setAttribute("id","score"),b.appendChild(document.createTextNode(a));var c=document.getElementById("score");this.scoreBoard.replaceChild(b,c)},Display.prototype.getPercent=function(a,b){return a-a*b/100},Display.prototype.addNewBall=function(a){var b=this;if(a.isball&&a.istile){var c=new createjs.Container,d={width:this.getPercent(a.width,10),height:this.getPercent(a.height,10)},e=(new createjs.Graphics).beginFill("rgba(255,255,255,1)").drawRoundRect(0,0,d.width,d.height,5),f=new createjs.Shape(e);f.scale=1,f.regX=d.width/2,f.regY=d.height/2,f.x=a.width/2,f.y=a.height/2,f.scaleX=0,f.scaleY=0,c.addChild(f),c.name="ball_"+a.n,c.x=a.x,c.y=a.y,c.n=a.n;var g=new createjs.Container;g.name="helper",c.addChild(g),f.cache(f.x-a.height-10,f.y-a.height+10,2*a.width+10,2*a.height+10),this.gameStatus&&(c.cursor="pointer"),this.balls[a.n]=c,this.pegs.addChild(c),c.addEventListener("pressup",function(a){b.pressup(a)}),c.addEventListener("mousedown",function(a){b.mousedown(a)}),c.addEventListener("pressmove",function(a){b.pressmove(a)}),f.addEventListener("rollover",function(a){b.rollover(a)}),f.addEventListener("rollout",function(a){b.rollout(a)}),createjs.Tween.get(f).wait(10*a.n).to({scaleX:1,scaleY:1},300,createjs.Ease.bounceOut).call(function(){b.drawn_balls++,b.grid.balls==b.drawn_balls&&b.pauseTicker()})}},Display.prototype.addNewTile=function(a){var b=new createjs.Container;if(b.name="square_"+a.n,a.istile){var c=(new createjs.Graphics).beginFill("rgba(240,117,110,1)").drawRoundRect(0,0,a.width,a.height,2),d=new createjs.Shape(c);b.x=a.x,b.y=a.y,d.cache(d.x-a.height-10,d.y-a.height+10,2*a.width+10,2*a.height+10),b.addChild(d),this.tiles.addChild(b)}},window.bkStorage={_data:{},setItem:function(a,b){return this._data[a]=String(b)},getItem:function(a){return this._data.hasOwnProperty(a)?this._data[a]:void 0},removeItem:function(a){return delete this._data[a]},clear:function(){return this._data={}}},LocalStorage.prototype.localStorageSupported=function(){var a="test",b=window.localStorage;try{return b.setItem(a,"1"),b.removeItem(a),!0}catch(c){return!1}},LocalStorage.prototype.setLevelID=function(a){this.storage.setItem(this.levelID,a)},LocalStorage.prototype.getLevelID=function(){return this.storage.getItem(this.levelID)},LocalStorage.prototype.clearCurrentLevel=function(){this.storage.removeItem("pegu_level_"+this.getLevelID())},LocalStorage.prototype.getCurrenLevel=function(){var a=this.storage.getItem("pegu_level_"+this.getLevelID());return a?JSON.parse(a):null},LocalStorage.prototype.getLevel=function(a){var b=this.storage.getItem("pegu_level_"+a);return b?JSON.parse(b):null},LocalStorage.prototype.setLevel=function(a){var b="pegu_level_"+a.level;this.storage.setItem(b,JSON.stringify(a))},LocalStorage.prototype.setGameStatus=function(a){this.storage.setItem("pegu_status",a)},LocalStorage.prototype.getGameStatus=function(){return this.storage.getItem("pegu_status")||0},Social.prototype.destroyLayer=function(){window.publicMethods.destroy(),this.open=!1},Social.prototype.callback=function(){this.smart="3"},Social.prototype.addLayer=function(){this.open=!0,this.layer=addthis.layers({theme:"transparent",share:{position:"left",services:"facebook,twitter,google_plusone_share"}})},Social.prototype.isopen=function(){return this.open},Sound.prototype.victory=function(){this.moveSound=createjs.Sound.play("victory"),this.moveSound.volume=.2},Sound.prototype.dispose=function(){this.moveSound=createjs.Sound.play("tick"),this.moveSound.volume=.2},Sound.prototype.loss=function(){this.sound=createjs.Sound.play("loss"),this.sound.volume=.2},Sound.prototype.move=function(){this.moveSound=createjs.Sound.play("move"),this.moveSound.volume=.2},Sound.prototype.createMoveSound=function(){createjs.Sound.initializeDefaultPlugins()&&(createjs.Sound.alternateExtensions=["mp3"],createjs.Sound.registerSound("sounds/move.ogg","move"),createjs.Sound.registerSound("sounds/victory.ogg","victory"),createjs.Sound.registerSound("sounds/loss.ogg","loss"),createjs.Sound.registerSound("sounds/tick.ogg","tick"))},Game.prototype.init=function(){var a=this;this.levels=this.readLevels(),this.display=new Display,this.display.on("draw_board",this.draw_board.bind(this)),this.display.on("automoved",this.autoMove.bind(this)),this.display.on("rollover",this.setMoves.bind(this)),setTimeout(function(){a.start()},100)},Game.prototype.setMoves=function(a){var b=this.grid.movesArray(a.n),c=[];for(var d in b){var e=b[d];if(e){var f={dir:d,n:e};c.push(f)}}return this.display.setAvailableMoves(b),c},Game.prototype.mousedown=function(a){var b=this,c=this.setMoves(a);if(1!=c.length||a.touch)this.shortcurmove=!1;else{this.shortcurmove=!0;var d=this.grid.moveTile(a.n,c[0].n);if(d)if(this.display.moveTile(d,this.shortcurmove),this.sound.move(),this.addPoints(),this.saveState(),this.getNextPlayableBall());else{var e=this.grid.getBalls();e.length>1?(this.sound.loss(),this.restartTimeout=setTimeout(function(){b.restart()},3e3)):(this.sound.victory(),this.restartTimeout=setTimeout(function(){b.restart(),b.nextLevel()},1e3))}}},Game.prototype.pressup=function(a){var a,b=this;if(a=this.shortcurmove?null:this.grid.moveTile(a.n,a.to_n))if(this.display.moveTile(a,this.shortcurmove),this.sound.move(),this.addPoints(),this.saveState(),this.getNextPlayableBall());else{var c=this.grid.getBalls();c.length>1?(this.sound.loss(),setTimeout(function(){b.restart()},3e3)):(this.sound.victory(),setTimeout(function(){b.restart(),b.nextLevel()},1e3))}},Game.prototype.getNextPlayableBall=function(){var a=this,b=this.grid.getBalls(),c=[],d=function(){var e=Math.floor(Math.random()*b.length);if(b[e]){var f=b[e],g=a.grid.movesArray(f.n);for(var h in g){var i=g[h];if(i){var j={from_n:f.n,dir:h,n:i};c.push(j)}}c.length>0||(b.splice(e,1),d())}};if(d(),c.length>0){var e=c[Math.floor(Math.random()*c.length)];return e}return!1},Game.prototype.autoPlayMatch=function(){{var a=this,b={},c=[],d=function(){var e=a.getNextPlayableBall();if(e){{a.grid.moveTile(e.from_n,e.n)}c.push({from_n:e.from_n,to_n:e.n}),d()}else{var f=a.grid.getBalls();f.length>1?b.win=!1:(b.win=!0,b.moves=c)}};d()}return b},Game.prototype.resolve=function(){var a=this,b=1e3,c=0,d={},e=function(){a.resetMatch();var f=a.autoPlayMatch();return c++,f&&f.win?(d.win=!0,d.moves=f.moves,d):c>=b?(d.win=!1,d):void e()},e=e();return d},Game.prototype.autoMove=function(a){var b=this,c=b.grid.moveTile(a.from_n,a.to_n);b.display.autoMoveTile(c)},Game.prototype.showMatch=function(){var a=this.resolve();if(a.win){var b=a.moves[0];this.autoMove(b)}},Game.prototype.pressmove=function(){},Game.prototype.draw_board=function(){this.sound.dispose()},Game.prototype.addPoints=function(){this.score--,this.displayPoints()},Game.prototype.displayPoints=function(){this.getNextPlayableBall()?this.display.setScore(this.score+" moves left"):(console.log(this.score),this.score<=0?(this.display.displayText("Pegu!"),this.display.setScore("you won!")):(this.display.displayText("Damn!"),this.display.setScore("you left "+this.score+" pegs...")))},Game.prototype.displayLevelName=function(a){this.display.displayLevelName(a)},Game.prototype.readLevels=function(){var a;return $.ajax({url:"levels/levels.json",success:function(b){a=b},async:!1}),a},Game.prototype.resetMatch=function(){this.grid=new Grid(null,this.levels[this.levelID])},Game.prototype.render=function(){this.levelID=this.levelID<0?this.levels.length-1:this.levelID,this.levelID=this.levels[this.levelID]?this.levelID:0,this.level_name=this.levels[this.levelID].name;var a=this.levels[this.levelID].currentScheme.length-this.levels[this.levelID].emptySpots.length-1;this.getGameStatus()&&this.storage.setLevelID(this.levelID);var b=this.storage.getLevel(this.levelID);this.level=b&&this.level_name!=b.name?null:b,this.score=this.level?this.level.score:a,this.grid=new Grid(this.level,this.levels[this.levelID]),this.display.render(this.grid,this.getGameStatus()),this.displayLevelName(this.level_name),this.displayPoints()},Game.prototype.getGameStatus=function(){return this.storage.getGameStatus()},Game.prototype.setGameStatus=function(a){this.storage.setGameStatus(a)},Game.prototype.play=function(){this.setGameStatus(1),this.storage.getLevelID()!=this.levelID&&this.start()},Game.prototype.start=function(){var a=this;this.levelID=1==a.getGameStatus()?this.storage.getLevelID()||0:this.storage.getLevelID()||this.levels.length-1,this.render(),this.display.on("mousedown",this.mousedown.bind(this)),this.display.on("pressup",this.pressup.bind(this))},Game.prototype.restart=function(){this.restartTimeout&&clearTimeout(this.restartTimeout),this.storage.getCurrenLevel()&&(this.storage.clearCurrentLevel(),this.render())},Game.prototype.nextLevel=function(){this.saveState(),this.levelID++,this.render()},Game.prototype.previousLevel=function(){this.saveState(),this.levelID--,this.render()},Game.prototype.gotoLevel=function(a){this.saveState(),this.levelID=a,this.render()},Game.prototype.saveState=function(){this.grid&&this.storage.setLevel({grid:this.grid.serialize(),score:this.score,level:this.levelID,name:this.level_name})},Game.prototype.isopenSocial=function(){return this.social.isopen()},Game.prototype.openSocial=function(){this.social.addLayer()},Game.prototype.closeSocial=function(){this.social.destroyLayer()},jQuery(document).ready(function(a){game=new Game(LocalStorage,Social,Sound),a(".play a").on("click",function(b){b.preventDefault(),a(".how_to_play").hide("200"),a("header").hide("500",function(){game.play()}),a(".game_asset").show("500")}),a("#infobtn").on("click",function(b){b.preventDefault(),a(".how_to_play").show("200"),a("header").show("500"),a(".game_asset").hide("500")}),a("#refresh").on("click",function(a){a.preventDefault(),game.restart()}),a("#next").on("click",function(a){a.preventDefault(),game.nextLevel()}),a("#previous").on("click",function(a){a.preventDefault(),game.previousLevel()}),a("#sharebtn").on("click",function(a){a.preventDefault(),game.isopenSocial()?game.closeSocial():game.openSocial()}),a(window).unload(function(){game.saveState()})});