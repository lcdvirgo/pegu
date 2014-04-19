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
        //console.log('update');
        this.update = false;
    }
}
Display.prototype.pauseTicker = function(time) {
    setTimeout(function() {
        createjs.Ticker.setPaused(true);
    }, time || 100);
}
Display.prototype.playTicker = function(time) {
    createjs.Ticker.setPaused(false);
}
Display.prototype.updateStage = function() {
    this.update = true;
}
Display.prototype.tutorial = function() {
    this.playTicker();
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
        self.pauseTicker();
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
    this.pauseTicker();
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
    this.playTicker();
    this.emit("draw_board");
    this.displayText(' ');
    this.drawn_balls = 0;
    this.ratio = window.devicePixelRatio || 1;
    createjs.Tween.removeAllTweens();
    var w = window.innerWidth;
    var h = window.innerHeight;
    var m = Math.min(w, h);
    var unit = Math.floor(m / (this.size + 3 || 8));
    this.container.removeAllChildren();
    this.container.removeAllEventListeners();
    this.board = new createjs.Container();
    this.container.addChild(this.board);
    this.tiles = new createjs.Container();
    this.board.addChild(this.tiles);
    this.pegs = new createjs.Container();
    this.board.addChild(this.pegs);
    this.canvas.width = w * this.ratio;
    this.canvas.height = h * this.ratio;
    this.canvas.setAttribute('width', Math.round(w * this.ratio));
    this.canvas.setAttribute('height', Math.round(h * this.ratio));
    // force the canvas back to the original size using css
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    // set CreateJS to render scaled
    this.board.x = Math.floor(w * this.ratio / 2 - (this.size * this.ratio * unit / 2));
    this.board.y = Math.floor(h * this.ratio / 2 - (this.size * this.ratio * unit / 2));
    this.stage.scaleX = this.stage.scaleY = 1;
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
    this.playTicker();
    var self = this;
    var b = this.balls[move.eaten];
    var t1 = this.balls[move.from_n];
    this.balls[move.to_n] = t1;
    t1.n = move.to_n;
    this.is_short = is_short;
    if (this.is_short) {
        createjs.Tween.get(t1).to({
            x: move.final_position.x,
            y: move.final_position.y
        }, 100, createjs.Ease.linear).call(function() {
            self.pauseTicker(200);
            t1.start.x = move.final_position.x;
            t1.start.y = move.final_position.y;
            this.moved = true;
        });
    }
    this.pegs.removeChild(b);
};
Display.prototype.autoMoveTile = function(move) {
    var self = this;
    var target = this.grid.getTile(move.from_n);
    var to = this.grid.getTile(move.to_n);
    var s = this.balls[move.from_n];
    createjs.Tween.get(s).to({
        x: to.x,
        y: to.y
    }, 200).wait(1000).call(function() {
        self.emit("automoved", {
            from_n: move.from_n,
            to_n: move.to_n,
            x: move.final_position.x,
            y: move.final_position.y
        });
        // self.updateStage();
    });
}
Display.prototype.setAvailableMoves = function(moves) {
    this.availableMoves = moves;
};
Display.prototype.pressup = function(evt) {
    if (this.gameStatus) {
        var o = evt.currentTarget;
        var t = evt.target;
        t.scaleX = t.scaleY = t.scale;
        if (!this.moved) {
            o.x = o.start.x;
            o.y = o.start.y;
            this.pauseTicker(200);
        } else {
            var helperContainer = o.getChildByName('helper');
            if (helperContainer) {
                helperContainer.removeAllChildren();
            }
            this.pauseTicker(200);
            this.moved = false;
        }
    }
    this.updateStage();
}
Display.prototype.mousedown = function(evt) {
    if (this.gameStatus) {
        this.is_short = false;
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
            n: o.n,
            touch: createjs.Touch.isSupported()
        });
    }
}
Display.prototype.pressmove = function(evt) {
    if (this.gameStatus) {
        var o = evt.currentTarget;
        if (this.availableMoves && !this.moved && !this.is_short) {
            this.playTicker();
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
                this.pauseTicker(20);
            }
            if (move) {
                this.emit("pressup", {
                    n: o.n,
                    to_n: tile.n
                });
                o.x = tile.x;
                o.y = tile.y;
                this.moved = true;
                this.pauseTicker(20);
            }
        } else {}
    }
}
Display.prototype.getHoverHelper = function(n, dir) {
    var tile = this.grid.getTile(n);
    var arrow = new createjs.Shape();
    arrow.mouseEnabled = false;
    var size = {
        width: this.getPercent(tile.width, 10),
        height: this.getPercent(tile.height, 10)
    }
    arrow.regX = size.width / 2;
    arrow.regY = size.height / 2;
    arrow.x = tile.width / 2;
    arrow.y = tile.height / 2;
    arrow.alpha = 1;
    arrow.name = 'arrow_' + dir;
    arrow.graphics.beginFill("rgba(240,142,118,0.4)");
    if (dir == 'up') {
        arrow.graphics.drawRoundRect(0, 0, size.width, size.height / 4, 5);
    } else if (dir == 'down') {
        arrow.graphics.drawRoundRect(0, size.height - size.height / 4, size.width, size.height / 4, 5);
    } else if (dir == 'left') {
        arrow.graphics.drawRoundRect(0, 0, size.width / 4, size.height, 5);
    } else if (dir == 'right') {
        arrow.graphics.drawRoundRect(size.width - size.width / 4, 0, size.width / 4, size.height, 5);
    }
    return arrow;
};
Display.prototype.rollover = function(evt) {
    var o = evt.currentTarget;
    this.emit("rollover", {
        n: o.parent.n
    });
    var helperContainer = o.parent.getChildByName('helper');
    if (this.availableMoves.down) {
        var arrow = this.getHoverHelper(this.availableMoves.down, 'down');
        helperContainer.addChild(arrow);
    }
    if (this.availableMoves.up) {
        var arrow = this.getHoverHelper(this.availableMoves.up, 'up');
        helperContainer.addChild(arrow);
    }
    if (this.availableMoves.right) {
        var arrow = this.getHoverHelper(this.availableMoves.right, 'right');
        helperContainer.addChild(arrow);
    }
    if (this.availableMoves.left) {
        var arrow = this.getHoverHelper(this.availableMoves.left, 'left');
        helperContainer.addChild(arrow);
    }
    // createjs.Tween.get(arrow).wait(100).to({
    //     alpha: 1
    // }, 100, createjs.Ease.linear).call(function(){
    // });
    this.updateStage();
};
Display.prototype.rollout = function(evt) {
    var o = evt.currentTarget;
    var helperContainer = o.parent.getChildByName('helper');
    helperContainer.removeAllChildren();
    this.updateStage();
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
Display.prototype.getPercent = function(n, p) {
    return n - n * p / 100;
}
Display.prototype.addNewBall = function(tile) {
    var self = this;
    if (tile.isball && tile.istile) {
        var ball = new createjs.Container();
        var size = {
            width: this.getPercent(tile.width, 10),
            height: this.getPercent(tile.height, 10)
        }
        var g = new createjs.Graphics().beginFill("rgba(255,255,255,1)").drawRoundRect(0, 0, size.width, size.height, 5);
        var s = new createjs.Shape(g);
        s.scale = 1;
        s.regX = size.width / 2;
        s.regY = size.height / 2;
        s.x = tile.width / 2;
        s.y = tile.height / 2;
        s.scaleX = 0;
        s.scaleY = 0;
        ball.addChild(s);
        ball.name = 'ball_' + tile.n;
        ball.x = tile.x;
        ball.y = tile.y;
        ball.n = tile.n;
        var helperContainer = new createjs.Container();
        helperContainer.name = "helper"
        ball.addChild(helperContainer);
        s.cache(s.x - tile.height - 10, s.y - tile.height + 10, tile.width * 2 + 10, tile.height * 2 + 10);
        if (this.gameStatus) {
            ball.cursor = 'pointer';
        }
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
                self.pauseTicker();
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
        s.cache(s.x - tile.height - 10, s.y - tile.height + 10, tile.width * 2 + 10, tile.height * 2 + 10);
        square.addChild(s);
        this.tiles.addChild(square);
    }
};