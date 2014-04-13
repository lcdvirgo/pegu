function Display(grid) {
    this.events = {};
    this.grid = grid;
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
    this.canvas = document.getElementById("testCanvas");
    //check to see if we are running in a browser with touch support
    this.stage = new createjs.Stage(this.canvas);
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true;
    this.container = new createjs.Container();
    this.stage.addChild(this.container);
    this.board = new createjs.Container();
    this.container.addChild(this.board);
    this.balls = new createjs.Container();
    this.container.addChild(this.balls);
    //this.balls.alpha = 0.5;
    //this.fiori = [];
    this.size = 0;
    this.selected;
    self.resize();
    createjs.Touch.enable(this.stage);
    createjs.Ticker.addEventListener("tick", function(event) {
        self.tick(event);
    });
    window.alphaThresh = 0.75;
    $(window).resize(function() {
        self.resize();
    });
}
Display.prototype.resize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;

    this.container.x = 0;
    this.container.y = 0;
    this.w = h / 7;
    this.h = h / 7;
    this.ballw = h / 7 - 6;
    this.ballh = h / 7 - 6;
    this.update = true;
}
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
Display.prototype.moveTile = function(tiles) {
    var middle_tile = this.tiles[tiles.middle_n];
    //var new_tile = this.tiles[tiles.new_n];    
    var old_tile = this.tiles[tiles.old_n];
    this.tiles[tiles.new_n] = old_tile;
    old_tile.n = tiles.new_n;

    // var old_square = this.board.getChildByName('square_' + tiles.old_n);
    // var new_square = this.board.getChildByName('square_' + tiles.new_n);
    // var middle_square = this.board.getChildByName('square_' + tiles.middle_n);
    // old_square.getChildAt(1).text = tiles.old_n + ' empty';
    // new_square.getChildAt(1).text = tiles.new_n + ' ball';
    // middle_square.getChildAt(1).text = tiles.middle_n + ' empty';
    this.balls.removeChild(middle_tile);
};
Display.prototype.setAvailableMoves = function(moves) {
    this.availableMoves = moves;
};
Display.prototype.actuate = function(grid, metadata) {
    var self = this;
    self.size = grid.size;
    // enable touch interactions if supported on the current device:
    window.requestAnimationFrame(function() {
        for (var i = 0; i < grid.cells.length; i++) {
            var column = grid.cells[i];
            for (var c = 0; c < column.length; c++) {
                var tile = column[c];
                var cell = {};
                cell.x = (i) * self.w;
                cell.y = (c) * self.h;
                tile.updatePosition(cell);
                //debugger;
                self.addNewTile(tile);
                self.addNewBall(tile);
            };
        };
        // self.updateScore(metadata.score);
        // self.updateBestScore(metadata.bestScore);
        // if (metadata.terminated) {
        //   if (metadata.over) {
        //     self.message(false); // You lose
        //   } else if (metadata.won) {
        //     self.message(true); // You win!
        //   }
        // }
    });
};
Display.prototype.pressup = function(evt) {
    var self = this;
    if (!self.moved) {
        var o = evt.currentTarget;
        o.x = o.start.x;
        o.y = o.start.y;
    } else {
        self.moved = false;
    }
    self.update = true;
}
Display.prototype.mousedown = function(evt) {
    var self = this;
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
    self.emit("mousedown", {
        x: o.x,
        y: o.y,
        n: o.n
    });
}
Display.prototype.pressmove = function(evt) {
    var self = this;
    var o = evt.currentTarget;
    //var initPosition = o;
    if (self.availableMoves && !self.moved) {
        var move = false;
        if (self.availableMoves.left && o.x <= o.start.x) {
            var tile = self.grid.getTile(self.availableMoves.left);
            o.x = evt.stageX + o.offset.x;
            if (o.x < tile.x + (self.w / 2)) {
                move = true;
            }
        }
        if (self.availableMoves.right && o.x >= o.start.x) {
            var tile = self.grid.getTile(self.availableMoves.right);
            o.x = evt.stageX + o.offset.x;
            if (o.x > tile.x - (self.w / 2)) {
                move = true;
            }
        }
        if (self.availableMoves.down && o.y >= o.start.y) {
            var tile = self.grid.getTile(self.availableMoves.down);
            o.y = evt.stageY + o.offset.y;
            if (o.y > tile.y - (self.h / 2)) {
                move = true;
            }
        }
        if (self.availableMoves.up && o.y <= o.start.y) {
            var tile = self.grid.getTile(self.availableMoves.up);
            o.y = evt.stageY + o.offset.y;
            if (o.y < tile.y + (self.h / 2)) {
                move = true;
            }
        }
        if (move) {
            self.emit("pressup", {
                n: o.n,
                new_n: tile.n
            });
            o.x = tile.x;
            o.y = tile.y;
            self.moved = true;
        }
    }
    self.update = true;
    self.selected = o;
}
Display.prototype.rollover = function(evt) {
    var self = this;
    // debugger;
    var o = evt.target;
    o.scaleX = o.scaleY = o.scale * 1.04;
    self.update = true;
}
Display.prototype.rollout = function(evt) {
    var self = this;
    //debugger;
    var o = evt.target;
    o.scaleX = o.scaleY = o.scale;
    self.update = true;
}
Display.prototype.addNewBall = function(tile) {
    var self = this;
    // create a shape that represents the center of the daisy image:
    // create and populate the screen with random daisies:
    if (tile.isball && tile.istile) {
        var g = new createjs.Graphics().beginFill("rgba(255,255,255,1)").drawRoundRect(0, 0, self.ballw, self.ballh, 5);
        var s = new createjs.Shape(g);
        var text = new createjs.Text(tile.n, "14px Arial", "#ff7700");
        text.x = 30;
        text.y = 30;
        s.x = (self.w) / 2;
        s.y = (self.h) / 2;
        s.scale = 1;
        s.regX = (self.ballw) / 2;
        s.regY = (self.ballh) / 2;
        var ball = new createjs.Container();
        ball.addChild(s);
        ball.name = 'ball_' + tile.n;
        //ball.addChild(text);
        ball.x = tile.x;
        ball.y = tile.y;
        ball.n = tile.n;
        ball.cursor = 'pointer';
        this.tiles[tile.n] = ball;
        self.balls.addChild(ball);
        //self.fiori.push(ball);
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
    var self = this;
    var square = new createjs.Container();
    square.name = 'square_' + tile.n;
    var itxt = '';
    if (tile.isball) {
        itxt = tile.n + ' ball';
    } else {
        itxt = tile.n + ' empty';
    }
    var text = new createjs.Text(itxt, "14px Arial", "#ff7700");
    if (tile.istile) {
        var g = new createjs.Graphics().beginFill("rgba(90,255,24,1)").drawRoundRect(0, 0, self.w, self.h, 2);
        var s = new createjs.Shape(g);
        square.x = tile.x;
        square.y = tile.y;
        square.addChild(s);
        //square.addChild(text);
        self.board.addChild(square);
        //self.stage.update();
    } else {
        // var g = new createjs.Graphics().beginFill("rgba(78,50,210,1)").drawRoundRect(0, 0, self.w, self.h, 2);
        // var s = new createjs.Shape(g);
        // square.x = tile.x;
        // square.y = tile.y;
        // square.addChild(s);
        // square.addChild(text);
        // self.board.addChild(square);
        // // self.stage.update();
    }
    self.update = true;
};