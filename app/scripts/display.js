function Display() {
    this.events = {};
    this.availableMoves = {
        up: false,
        right: false,
        down: false,
        left: false
    }
    this.moved = false;
    this.tiles = [];
    this.score = 0;
    this.init();
}
Display.prototype.tick = function(event) {
    if (this.update) {
        this.update = false; // only update once
        this.stage.update(event);
    }
}
Display.prototype.init = function(event) {
    var self = this;
    var canvas = document.createElement('canvas');
    canvas.id = "pegu";
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    $("#canvasHolder").html(canvas);
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerWidth;
    this.stage = new createjs.Stage(this.canvas);
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true;
    this.container = new createjs.Container();
    this.stage.addChild(this.container);
    //this.balls.alpha = 0.5;
    //this.fiori = [];
    createjs.Touch.enable(this.stage);
    createjs.Ticker.addEventListener("tick", function(event) {
        self.tick(event);
    });
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
    var w = window.innerWidth;
    var h = window.innerHeight;
    var m = Math.min(w, h);
    var unit = m / (this.size + 1 || 8);
    this.container.removeAllChildren();
    this.container.removeAllEventListeners();
    this.board = new createjs.Container();
    this.container.addChild(this.board);
    this.balls = new createjs.Container();
    this.container.addChild(this.balls);
    this.canvas.width = w;
    this.canvas.height = h;
    for (var i = 0; i < this.grid.cells.length; i++) {
        var column = this.grid.cells[i];
        for (var c = 0; c < column.length; c++) {
            var tile = column[c];
            var cell = {};
            cell.x = i * unit;
            cell.y = c * unit;
            cell.width = unit;
            cell.height = unit;
            tile.updateState(cell);
            this.addNewTile(tile);
            this.addNewBall(tile);
        };
    };
    this.container.x = w / 2 - (this.size * unit / 2);
    this.container.y = h / 2 - (this.size * unit / 2);
    this.update = true;
};
Display.prototype.render = function(grid, metadata) {
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
Display.prototype.moveTile = function(move) {
    var b = this.tiles[move.eaten];
    var t1 = this.tiles[move.from_n];
    this.tiles[move.to_n] = t1;
    t1.n = move.to_n;
    this.balls.removeChild(b);
};
Display.prototype.setAvailableMoves = function(moves) {
    this.availableMoves = moves;
};
Display.prototype.pressup = function(evt) {
    var t = evt.target;
    t.scaleX = t.scaleY = t.scale;
    if (!this.moved) {
        var o = evt.currentTarget;
        o.x = o.start.x;
        o.y = o.start.y;
    } else {
        this.moved = false;
    }
    this.update = true;
}
Display.prototype.mousedown = function(evt) {
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
Display.prototype.pressmove = function(evt) {
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
    this.update = true;
}
Display.prototype.rollover = function(evt) {
    evt.target.scaleX = evt.target.scaleY = evt.target.scale;
    this.update = true;
}
Display.prototype.rollout = function(evt) {
    evt.target.scaleX = evt.target.scaleY = evt.target.scale;
    this.update = true;
}
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
        ball.name = 'ball_' + tile.n;
        ball.x = tile.x;
        ball.y = tile.y;
        ball.n = tile.n;
        ball.cursor = 'pointer';
        ball.addChild(s);
        this.tiles[tile.n] = ball;
        this.balls.addChild(ball);
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
        this.board.addChild(square);
    }
    this.update = true;
};