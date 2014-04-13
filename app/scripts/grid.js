function Grid(size, previousState, level) {
    this.size = size;
    this.level = level;
    this.cells = this.build();
}
Grid.prototype.build = function() {
    var cells = [];
    var n = 1;
    for (var x = 0; x < this.size; x++) {
        var row = cells[x] = [];
        for (var y = 0; y < this.size; y++) {
            var obj = {};
            obj['isball'] = $.inArray(n, this.level.currentScheme) >= 0 && $.inArray(n, this.level.emptySpots) < 0 ? true : false;
            obj['istile'] = $.inArray(n, this.level.currentScheme) >= 0 ? true : false;
            obj['n'] = n;
            var tile = new Tile(obj)
            row.push(tile);
            n++;
        }
    }
    return cells;
};
Grid.prototype.movesAvailable = function(n) {
    var availableMoves = {
        up: false,
        right: false,
        down: false,
        left: false
    };
    var self = this;
    var start = self.getTile(n);
    this.eachCell(function(x, y, tile) {
        var cell = self.cells[x][y];
        if (cell.isball == false && cell.istile == true) {
            if (cell.n == n - (self.size * 2) && self.getTile(n - self.size).isball == true && start.y == cell.y) {
                availableMoves.left = n - (self.size * 2);
            } else if (cell.n == n + (self.size * 2) && self.getTile(n + self.size).isball == true && start.y == cell.y) {
                availableMoves.right = n + (self.size * 2);
            } else if (cell.n == n - 2 && self.getTile(n - 1).isball == true && start.x == cell.x) {
                availableMoves.up = n - 2;
            } else if (cell.n == n + 2 && self.getTile(n + 1).isball == true && start.x == cell.x) {
                availableMoves.down = n + 2;
            }
        }
    });
    return availableMoves;
}
Grid.prototype.eachCell = function(callback) {
    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
            callback(x, y, this.cells[x][y]);
        }
    }
};
Grid.prototype.getTile = function(n) {
    var res;
    this.eachCell(function(x, y, tile) {
        if (tile.n == n) {
            res = tile;
        }
    });
    return res;
};
Grid.prototype.moveTile = function(n, new_n) {
    var self = this;
    var tiles = {};
    var dir, middle_n;
    tiles.old_n = this.getTile(n);
    tiles.new_n = this.getTile(new_n);
    tiles.new_n.addBall();
    tiles.old_n.removeBall();
    if (new_n - this.size * 2 == n) {
        //right
        middle_n = new_n - this.size;
        tiles.middle_n = this.getTile(middle_n);
        tiles.middle_n.removeBall();
    }
    if (new_n + this.size * 2 == n) {
        //left
        middle_n = new_n + this.size;
        tiles.middle_n = this.getTile(middle_n);
        tiles.middle_n.removeBall();
    }
    if (new_n + 2 == n) {
        //up
        middle_n = new_n + 1;
        tiles.middle_n = this.getTile(middle_n);
        tiles.middle_n.removeBall();
    }
    if (new_n - 2 == n) {
        //down
        middle_n = new_n - 1;
        tiles.middle_n = this.getTile(middle_n);
        tiles.middle_n.removeBall();
    }
    var res = {
        new_n: tiles.new_n.n,
        old_n: tiles.old_n.n,
        middle_n: tiles.middle_n.n
    }
    return res;
};