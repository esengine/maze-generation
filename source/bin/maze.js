"use strict";
var maze;
(function (maze) {
    /**
     * 迷宫的墙壁
     */
    var MazeWall = /** @class */ (function () {
        function MazeWall(rowLength, colLength) {
            this.row = new Array(rowLength);
            this.row.fill(new Array(colLength + 1).fill(false));
            this.col = new Array(colLength);
            this.col.fill(new Array(rowLength + 1).fill(false));
            this._wallArea = new WallArea(rowLength, colLength);
            this.closedAllWall();
        }
        /**
         * 区域是否打通,true为打通
         * @param rowIndex
         * @param colindex
         */
        MazeWall.prototype.get = function (rowIndex, colindex) {
            if (rowIndex >= this.rowLength || colindex >= this.colLength)
                es.Debug.error("越界");
            if (rowIndex < 0 || colindex < 0)
                es.Debug.error("越界");
            return !(this.row[rowIndex][colindex] && this.row[rowIndex][colindex + 1] &&
                this.col[colindex][rowIndex] && this.col[colindex][rowIndex + 1]);
        };
        Object.defineProperty(MazeWall.prototype, "wallArea", {
            get: function () {
                return this._wallArea;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MazeWall.prototype, "rowLength", {
            get: function () {
                return this.wallArea.rowLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MazeWall.prototype, "colLength", {
            get: function () {
                return this.wallArea.colLength;
            },
            enumerable: true,
            configurable: true
        });
        MazeWall.prototype.closedAllWall = function () {
            for (var i = 0; i < this.rowLength; i++) {
                for (var j = 0; j < this.colLength + 1; j++) {
                    this.row[i][j] = true;
                }
            }
            for (var i = 0; i < this.colLength; i++) {
                for (var j = 0; j < this.rowLength + 1; j++) {
                    this.col[i][j] = true;
                }
            }
        };
        MazeWall.prototype.openArea = function (area1, area2) {
            if (area1.rowLength == area2.rowLength) {
                this.row[area1.rowLength][Math.max(area1.colLength, area2.colLength)] = false;
                maze.NotificationCenter.get().dispatchEvent("destroyWall", new maze.Notification(null, new DestroyWall(WallType.row, area1.rowLength, Math.max(area1.colLength, area2.colLength))));
                return;
            }
            if (area1.colLength == area2.colLength) {
                this.col[area1.colLength][Math.max(area1.rowLength, area2.rowLength)] = false;
                maze.NotificationCenter.get().dispatchEvent("destroyWall", new maze.Notification(null, new DestroyWall(WallType.col, area1.colLength, Math.max(area1.rowLength, area2.rowLength))));
            }
        };
        MazeWall.prototype.randomOpenStartAndPoint = function () {
            var arr = [
                {
                    "indexMax": this.rowLength - 1,
                    "rightIndex": 0,
                    "wallType": WallType.row,
                    "wallArr": this.row
                }, {
                    "indexMax": this.rowLength - 1,
                    "rightIndex": this.colLength,
                    "wallType": WallType.row,
                    "wallArr": this.row
                }, {
                    "indexMax": this.colLength - 1,
                    "rightIndex": 0,
                    "wallType": WallType.col,
                    "wallArr": this.col
                }, {
                    "indexMax": this.colLength - 1,
                    "rightIndex": this.rowLength,
                    "wallType": WallType.col,
                    "wallArr": this.col
                }
            ];
            var r = es.RandomUtils.randint(0, 3);
            var choose = arr[r];
            var index = es.RandomUtils.randint(0, choose.indexMax);
            while (!choose.wallArr[index][choose.rightIndex]) {
                index = es.RandomUtils.randint(0, choose.indexMax);
            }
            choose.wallArr[index][choose.rightIndex] = false;
            maze.NotificationCenter.get().dispatchEvent("destroyWall", new maze.Notification(null, new DestroyWall(choose.wallType, index, choose.rightIndex)));
        };
        return MazeWall;
    }());
    maze.MazeWall = MazeWall;
    /**
     * 用来表示行列数或迷宫区域
     */
    var WallArea = /** @class */ (function () {
        function WallArea(row, col) {
            this.rowLength = 0;
            this.colLength = 0;
            this.rowLength = row;
            this.colLength = col;
        }
        return WallArea;
    }());
    maze.WallArea = WallArea;
    var WallType;
    (function (WallType) {
        WallType[WallType["row"] = 0] = "row";
        WallType[WallType["col"] = 1] = "col";
    })(WallType = maze.WallType || (maze.WallType = {}));
    var DestroyWall = /** @class */ (function () {
        function DestroyWall(wallType, row, col) {
            this.row = 0;
            this.col = 0;
            this.wallType = wallType;
            this.row = row;
            this.col = col;
        }
        return DestroyWall;
    }());
    maze.DestroyWall = DestroyWall;
})(maze || (maze = {}));
var maze;
(function (maze) {
    var Notification = /** @class */ (function () {
        function Notification(sender, param) {
            if (sender === void 0) { sender = null; }
            this.sender = sender;
            this.param = param;
        }
        return Notification;
    }());
    maze.Notification = Notification;
})(maze || (maze = {}));
var maze;
(function (maze) {
    var NotificationCenter = /** @class */ (function () {
        function NotificationCenter() {
            this.eventListeners = new Map();
        }
        NotificationCenter.get = function () {
            if (!this._instance) {
                this._instance = new NotificationCenter();
            }
            return this._instance;
        };
        NotificationCenter.prototype.addEventListener = function (eventKey, eventListener) {
            if (!this.eventListeners.has(eventKey)) {
                this.eventListeners.set(eventKey, [eventListener]);
            }
            else {
                this.eventListeners.get(eventKey).push(eventListener);
            }
        };
        NotificationCenter.prototype.removeEventListener = function (eventKey, eventListener) {
            if (eventListener === void 0) { eventListener = null; }
            if (!this.eventListeners.has(eventKey)) {
                return;
            }
            else {
                if (eventListener != null) {
                    var val = this.eventListeners.get(eventKey);
                    var index = val.findIndex(function (t) { return t == eventListener; });
                    val.splice(index, 1);
                }
                else {
                    this.eventListeners.get(eventKey).length = 0;
                    this.eventListeners.delete(eventKey);
                }
            }
        };
        NotificationCenter.prototype.dispatchEvent = function (eventKey, notific) {
            if (!this.eventListeners.has(eventKey))
                return;
            this.eventListeners.get(eventKey).forEach(function (v) { return v(notific); });
        };
        NotificationCenter.prototype.hasEventListener = function (eventKey) {
            return this.eventListeners.has(eventKey);
        };
        return NotificationCenter;
    }());
    maze.NotificationCenter = NotificationCenter;
})(maze || (maze = {}));
