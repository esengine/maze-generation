module maze {
    /**
     * 迷宫的墙壁
     */
    export class MazeWall {
        // true为存在墙壁
        public row: boolean[][];
        public col: boolean[][];
        private readonly _wallArea: WallArea;

        /**
         * 区域是否打通,true为打通
         * @param rowIndex
         * @param colindex
         */
        public get(rowIndex: number, colindex: number): boolean {
            if (rowIndex >= this.rowLength || colindex >= this.colLength)
                es.Debug.error("越界");
            if (rowIndex < 0 || colindex < 0)
                es.Debug.error("越界");
            
            return !(this.row[rowIndex][colindex] && this.row[rowIndex][colindex + 1] &&
                this.col[colindex][rowIndex] && this.col[colindex][rowIndex + 1]);
        }
        
        public get wallArea() {
            return this._wallArea;
        }
        
        public get rowLength() {
            return this.wallArea.rowLength;
        }
        
        public get colLength() {
            return this.wallArea.colLength;
        }
        
        constructor(rowLength: number, colLength: number) {
            this.row = new Array(rowLength);
            this.row.fill(new Array(colLength + 1).fill(false));
            this.col = new Array(colLength);
            this.col.fill(new Array(rowLength + 1).fill(false));
            this._wallArea = new WallArea(rowLength, colLength);
            this.closedAllWall();
        }
        
        public closedAllWall() {
            for (let i = 0; i < this.rowLength; i ++) {
                for (let j = 0; j < this.colLength + 1; j ++) {
                    this.row[i][j] = true;
                }
            }
            
            for (let i = 0; i < this.colLength; i ++) {
                for (let j = 0; j < this.rowLength + 1; j ++) {
                    this.col[i][j] = true;
                }
            }
        }
        
        public openArea(area1: WallArea, area2: WallArea) {
            if (area1.rowLength == area2.rowLength) {
                this.row[area1.rowLength][Math.max(area1.colLength, area2.colLength)] = false;
                NotificationCenter.get<DestroyWall>().dispatchEvent("destroyWall", new Notification(null, 
                    new DestroyWall(WallType.row, area1.rowLength, Math.max(area1.colLength, area2.colLength))));
                return;
            }
            
            if (area1.colLength == area2.colLength) {
                this.col[area1.colLength][Math.max(area1.rowLength, area2.rowLength)] = false;
                NotificationCenter.get<DestroyWall>().dispatchEvent("destroyWall", new Notification(null,
                    new DestroyWall(WallType.col, area1.colLength, Math.max(area1.rowLength, area2.rowLength))));
            }
        }
        
        public randomOpenStartAndPoint() {
            let arr = [
                {
                    "indexMax": this.rowLength - 1,
                    "rightIndex": 0,
                    "wallType": WallType.row,
                    "wallArr": this.row
                },{
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
            
            let r = es.RandomUtils.randint(0, 3);
            let choose = arr[r];
            let index = es.RandomUtils.randint(0, choose.indexMax);
            while (!choose.wallArr[index][choose.rightIndex]) {
                index = es.RandomUtils.randint(0, choose.indexMax);
            }
            
            choose.wallArr[index][choose.rightIndex] = false;
            NotificationCenter.get<DestroyWall>().dispatchEvent("destroyWall", new Notification(null, 
                new DestroyWall(choose.wallType, index, choose.rightIndex)));
        }
    }

    /**
     * 用来表示行列数或迷宫区域
     */
    export class WallArea {
        public rowLength: number = 0;
        public colLength: number = 0;
        constructor(row: number, col: number) {
            this.rowLength = row;
            this.colLength = col;
        }
    }

    export enum WallType {
        row, col
    }

    export class DestroyWall {
        public wallType: WallType;
        public row: number = 0;
        public col: number = 0;
        constructor(wallType: WallType, row: number, col: number) {
            this.wallType = wallType;
            this.row = row;
            this.col = col;
        }
    }
}