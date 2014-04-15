window.bkStorage = {
    _data: {},
    setItem: function(id, val) {
        return this._data[id] = String(val);
    },
    getItem: function(id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },
    removeItem: function(id) {
        return delete this._data[id];
    },
    clear: function() {
        return this._data = {};
    }
};

function LocalStorage() {
    //this.bestScoreKey     = "bestScore";
    this.levelID = "levelID";
    var supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : window.bkStorage;
}
LocalStorage.prototype.localStorageSupported = function() {
    var testKey = "test";
    var storage = window.localStorage;
    try {
        storage.setItem(testKey, "1");
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};
// Best score getters/setters
LocalStorage.prototype.getBestScore = function() {
    return this.storage.getItem(this.bestScoreKey) || 0;
};
LocalStorage.prototype.setBestScore = function(score) {
    this.storage.setItem(this.bestScoreKey, score);
};
LocalStorage.prototype.setLevelID = function(levelID) {
    this.storage.setItem(this.levelID, levelID);
};
LocalStorage.prototype.getLevelID = function() {
    return this.storage.getItem(this.levelID) || 0;
};
LocalStorage.prototype.clearLevel = function() {
    this.storage.removeItem('game_level_' + this.getLevelID());
};
// Game state getters/setters and clearing
LocalStorage.prototype.getLevel = function(levelID) {
    var stateJSON = this.storage.getItem('game_level_' + levelID);
    return stateJSON ? JSON.parse(stateJSON) : null;
};
LocalStorage.prototype.setLevel = function(gameState) {
    var stateKey = 'game_level_' + gameState.level;
    this.storage.setItem(stateKey, JSON.stringify(gameState));
};
LocalStorage.prototype.setGameStatus = function(status) {
    this.storage.setItem('gameStatus', status);
};
LocalStorage.prototype.getGameStatus = function() {
    return this.storage.getItem('gameStatus') || 0;
};


