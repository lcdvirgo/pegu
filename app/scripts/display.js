function Display() {
    this.events = {};
    this.availableMoves = {
        up: false,
        right: false,
        down: false,
        left: false
    }
    this.moved = false;
    this.balls = [];
    this.score = 0;
    this.init();
}
Display.prototype.tick = function(event) {
    if (!event.paused || this.update) {
        this.stage.update(event);
        this.update = false;
    }
}
Display.prototype.updateStage = function() {
    this.update = true;
}
Display.prototype.tutorial = function() {
    createjs.Ticker.setPaused(false);
    var self = this;
    this.displayText('It\'s Easy!');
    var target = this.pegs.getChildAt(0);
    var target2 = this.pegs.getChildAt(1);
    var target3 = this.pegs.getChildAt(3);
    var target4 = this.tiles.getChildAt(6);
    var bitmap = new createjs.Bitmap("images/hand.png");
    this.board.addChild(bitmap);
    bitmap.y = 0 - 200;
    bitmap.x = target.x;
    createjs.Tween.get(bitmap).call(function() {}).wait(300).to({
        x: target.x + 20,
        y: target.y + 20
    }, 200).wait(500).to({
        x: target3.x + 20,
        y: target.y + 20
    }, 200).call(function() {}).wait(1000).call(function() {}).to({
        x: target4.x + 20,
        y: target4.y + 20,
        alpha: 0
    }, 200).wait(1000).call(function() {
        createjs.Ticker.setPaused(true);
    });
    createjs.Tween.get(target).wait(1000).call(function() {
        self.emit("mousedown", {
            n: target.n
        });
    }).to({
        x: target3.x,
        y: target.y
    }, 200).call(function() {
        
        self.emit("pressup", {
            n: target.n,
            to_n: self.availableMoves.right
        });
    }).wait(1000).call(function() {
        self.displayText('Try!');
        self.emit("mousedown", {
            n: target.n
        });
    }).to({
        x: target4.x,
        y: target4.y
    }, 200).call(function() {
        self.displayText('Try');
        self.emit("pressup", {
            n: target.n,
            to_n: self.availableMoves.down
        });
    });
};
Display.prototype.auto = function() {}
Display.prototype.init = function(event) {
    var self = this;
    var canvas_holder = document.getElementById('canvasHolder');
    var canvas = document.createElement('canvas');
    canvas.id = "pegu";
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    canvas_holder.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerWidth;
    this.stage = new createjs.Stage(this.canvas);
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true;
    this.container = new createjs.Container();
    this.stage.addChild(this.container);
    this.scoreBoard = document.getElementById('scoreboard');
    this.textBoard = document.getElementById('panel');
    this.infoBoard = document.getElementById('info');
    createjs.Touch.enable(this.stage);
    createjs.Ticker.addEventListener("tick", function(event) {
        self.tick(event);
    });
    createjs.Ticker.setPaused(true);
    window.alphaThresh = 0.75;
    //this.resizeTO;
    $(window).resize(function() {
        clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            self.draw();
        }, 100);
    });
}
Display.prototype.eachChildren = function(container, callback) {
    for (var x = 0; x < container.children.length; x++) {
        callback(container.children[x]);
    }
};
Display.prototype.draw = function() {
    createjs.Ticker.setPaused(false);
    this.emit("draw_board");
    this.displayText(' ');
    createjs.Tween.removeAllTweens();
    var w = window.innerWidth;
    var h = window.innerHeight;
    var m = Math.min(w, h);
    var unit = m / (this.size + 3 || 8);
    this.container.removeAllChildren();
    this.container.removeAllEventListeners();
    this.board = new createjs.Container();
    this.container.addChild(this.board);
    this.tiles = new createjs.Container();
    this.board.addChild(this.tiles);
    this.pegs = new createjs.Container();
    this.board.addChild(this.pegs);
    this.canvas.width = w;
    this.canvas.height = h;
    this.drawn_balls = 0;
    for (var i = 0; i < this.grid.cells.length; i++) {
        var column = this.grid.cells[i];
        for (var c = 0; c < column.length; c++) {
            var tile = column[c];
            var cell = {};
            cell.x = i * unit;
            cell.y = c * unit;
            cell.width = unit;
            cell.height = unit;
            // this.islast = false;
            // if(c == column.length - 1 && i == this.grid.cells.length - 1){
            //     this.islast = true;
            // }

            tile.updateState(cell);
            this.addNewTile(tile);
            this.addNewBall(tile);
        };
    };
    this.board.x = w / 2 - (this.size * unit / 2);
    this.board.y = h / 2 - (this.size * unit / 2);
};
Display.prototype.render = function(grid, gameStatus) {
    this.gameStatus = gameStatus;
    this.size = grid.size;
    this.grid = grid;
    this.draw();
};
Display.prototype.on = function(event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};
Display.prototype.emit = function(event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function(callback) {
            callback(data);
        });
    }
};
Display.prototype.moveTile = function(move, is_short) {
    var b = this.balls[move.eaten];
    var t1 = this.balls[move.from_n];
    this.balls[move.to_n] = t1;
    t1.n = move.to_n;
    this.is_short = is_short;
    if (this.is_short) {
        t1.x = move.final_position.x
        t1.y = move.final_position.y
    }
    this.pegs.removeChild(b);
};
Display.prototype.autoMoveTile = function(move) {
    var self = this;


var target = this.grid.getTile(move.from_n);
var to = this.grid.getTile(move.to_n);

  var s = this.balls[move.from_n];



   // createjs.Ticker.setPaused(false);

//self.updateStage();

    createjs.Tween.get(s).to({
        x: to.x,
        y: to.y
    }, 200).wait(1000).call(function() {
        console.log('moved');
        self.emit("automoved", {
            from_n: move.from_n,
            to_n: move.to_n,
            x: move.final_position.x,
            y: move.final_position.y
        });
        //createjs.Ticker.setPaused(true);
       // self.updateStage();
    });
}
Display.prototype.setAvailableMoves = function(moves) {
    this.availableMoves = moves;
};
Display.prototype.pressup = function(evt) {
    if (this.gameStatus) {
        var t = evt.target;
        t.scaleX = t.scaleY = t.scale;
        if (!this.moved && !this.is_short) {
            var o = evt.currentTarget;
            o.x = o.start.x;
            o.y = o.start.y;
        } else {
            this.moved = false;
        }
    }
    this.updateStage();
    createjs.Ticker.setPaused(true);
}
Display.prototype.mousedown = function(evt) {
    createjs.Ticker.setPaused(false);
    if (this.gameStatus) {
        var t = evt.target;
        t.scaleX = t.scaleY = t.scale * 1.04;
        var o = evt.currentTarget;
        o.parent.addChild(o);
        o.offset = {
            x: o.x - evt.stageX,
            y: o.y - evt.stageY
        };
        o.start = {
            x: o.x,
            y: o.y
        };
        this.emit("mousedown", {
            x: o.x,
            y: o.y,
            n: o.n
        });
    }
}
Display.prototype.pressmove = function(evt) {
    if (this.gameStatus) {
        var o = evt.currentTarget;
        if (this.availableMoves && !this.moved) {
            var move = false;
            var dx = Math.abs(o.x - o.start.x);
            var dy = Math.abs(o.y - o.start.y);
            var tolerance = 4;
            if (dx > tolerance || dy > tolerance) {
                if (dx > dy) {
                    if (this.availableMoves.left && o.x <= o.start.x) {
                        var tile = this.grid.getTile(this.availableMoves.left);
                        o.x = evt.stageX + o.offset.x;
                        o.y = tile.y;
                        if (o.x < tile.x + (tile.width / 2)) {
                            move = true;
                        }
                    }
                    if (this.availableMoves.right && o.x >= o.start.x) {
                        var tile = this.grid.getTile(this.availableMoves.right);
                        o.x = evt.stageX + o.offset.x;
                        o.y = tile.y;
                        if (o.x > tile.x - (tile.width / 2)) {
                            move = true;
                        }
                    }
                } else {
                    if (this.availableMoves.down && o.y >= o.start.y) {
                        var tile = this.grid.getTile(this.availableMoves.down);
                        o.y = evt.stageY + o.offset.y;
                        o.x = tile.x;
                        if (o.y > tile.y - (tile.height / 2)) {
                            move = true;
                        }
                    }
                    if (this.availableMoves.up && o.y <= o.start.y) {
                        var tile = this.grid.getTile(this.availableMoves.up);
                        o.y = evt.stageY + o.offset.y;
                        o.x = tile.x;
                        if (o.y < tile.y + (tile.height / 2)) {
                            move = true;
                        }
                    }
                }
            } else {
                o.y = evt.stageY + o.offset.y;
                o.x = evt.stageX + o.offset.x;
            }
            if (move) {
                this.emit("pressup", {
                    n: o.n,
                    to_n: tile.n
                });
                o.x = tile.x;
                o.y = tile.y;

                this.moved = true;
            }
        }
    }
}
Display.prototype.rollover = function(evt) {
    evt.target.scaleX = evt.target.scaleY = evt.target.scale;
};
Display.prototype.rollout = function(evt) {
    evt.target.scaleX = evt.target.scaleY = evt.target.scale;
};
Display.prototype.displayLevelName = function(text) {
    var sp1 = document.createElement("span");
    sp1.setAttribute("id", "level_name");
    sp1.appendChild(document.createTextNode(text));
    var sp2 = document.getElementById("level_name");
    this.infoBoard.replaceChild(sp1, sp2);
};
Display.prototype.displayText = function(text) {
    var sp1 = document.createElement("span");
    sp1.setAttribute("id", "textnode");
    sp1.appendChild(document.createTextNode(text));
    var sp2 = document.getElementById("textnode");
    this.textBoard.replaceChild(sp1, sp2);
};
Display.prototype.setScore = function(score) {
    var sp1 = document.createElement("span");
    sp1.setAttribute("id", "score");
    sp1.appendChild(document.createTextNode(score));
    var sp2 = document.getElementById("score");
    this.scoreBoard.replaceChild(sp1, sp2);
};
Display.prototype.addNewBall = function(tile) {
    var self = this;
    if (tile.isball && tile.istile) {
        var size = {
            width: tile.width - (tile.width * 10 / 100),
            height: tile.height - (tile.height * 10 / 100)
        }
        var g = new createjs.Graphics().beginFill("rgba(255,255,255,1)").drawRoundRect(0, 0, size.width, size.height, 5);
        var s = new createjs.Shape(g);
        var ball = new createjs.Container();
        s.scale = 1;
        s.regX = size.width / 2;
        s.regY = size.height / 2;
        s.x = tile.width / 2;
        s.y = tile.height / 2;
        s.scaleX = 0;
        s.scaleY = 0;
        ball.name = 'ball_' + tile.n;
        ball.x = tile.x;
        ball.y = tile.y;
        ball.n = tile.n;
        if (this.gameStatus) {
            ball.cursor = 'pointer';
        }
        ball.addChild(s);
        this.balls[tile.n] = ball;
        this.pegs.addChild(ball);
        ball.addEventListener("pressup", function(evt) {
            self.pressup(evt)
        });
        ball.addEventListener("mousedown", function(evt) {
            self.mousedown(evt);
        });
        ball.addEventListener("pressmove", function(evt) {
            self.pressmove(evt);
        });
        s.addEventListener("rollover", function(evt) {
            self.rollover(evt);
        });
        s.addEventListener("rollout", function(evt) {
            self.rollout(evt);
        });
        createjs.Tween.get(s).wait(tile.n * 10).to({
            scaleX: 1,
            scaleY: 1
        }, 300, createjs.Ease.bounceOut).call(function() {
            self.drawn_balls++
            if (self.grid.balls == self.drawn_balls) {
                createjs.Ticker.setPaused(true);
            }
        });
    }
};
Display.prototype.addNewTile = function(tile) {
    var square = new createjs.Container();
    square.name = 'square_' + tile.n;
    if (tile.istile) {
        var g = new createjs.Graphics().beginFill("rgba(240,117,110,1)").drawRoundRect(0, 0, tile.width, tile.height, 2);
        var s = new createjs.Shape(g);
        square.x = tile.x;
        square.y = tile.y;
        square.addChild(s);
        this.tiles.addChild(square);
    }
};