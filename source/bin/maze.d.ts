declare module maze {
    /**
     * 迷宫的墙壁
     */
    class MazeWall {
        row: boolean[][];
        col: boolean[][];
        private readonly _wallArea;
        /**
         * 区域是否打通,true为打通
         * @param rowIndex
         * @param colindex
         */
        get(rowIndex: number, colindex: number): boolean;
        readonly wallArea: WallArea;
        readonly rowLength: number;
        readonly colLength: number;
        constructor(rowLength: number, colLength: number);
        closedAllWall(): void;
        openArea(area1: WallArea, area2: WallArea): void;
        randomOpenStartAndPoint(): void;
    }
    /**
     * 用来表示行列数或迷宫区域
     */
    class WallArea {
        rowLength: number;
        colLength: number;
        constructor(row: number, col: number);
    }
    enum WallType {
        row = 0,
        col = 1
    }
    class DestroyWall {
        wallType: WallType;
        row: number;
        col: number;
        constructor(wallType: WallType, row: number, col: number);
    }
}
declare module maze {
    class Notification<T> {
        sender: any;
        param: T;
        constructor(sender: any, param: T);
    }
}
declare module maze {
    type OnNotification<T> = (notific: Notification<T>) => void;
    class NotificationCenter<T> {
        static _instance: NotificationCenter<any>;
        static get<T>(): NotificationCenter<T>;
        private eventListeners;
        addEventListener(eventKey: string, eventListener: OnNotification<T>): void;
        removeEventListener(eventKey: string, eventListener?: OnNotification<T>): void;
        dispatchEvent(eventKey: string, notific: Notification<T>): void;
        hasEventListener(eventKey: string): boolean;
    }
}
