module maze {
    export type OnNotification<T> = (notific: Notification<T>) => void;
    export class NotificationCenter<T> {
        public static _instance: NotificationCenter<any>;
        public static get<T>(): NotificationCenter<T> {
            if (!this._instance) {
                this._instance = new NotificationCenter();
            }
            return this._instance;
        }
        
        private eventListeners: Map<string, OnNotification<T>[]> = new Map<string, maze.OnNotification<T>[]>();
        
        public addEventListener(eventKey: string, eventListener: OnNotification<T>) {
            if (!this.eventListeners.has(eventKey)) {
                this.eventListeners.set(eventKey, [eventListener]);
            } else {
                this.eventListeners.get(eventKey).push(eventListener);
            }
        }
        
        public removeEventListener(eventKey: string, eventListener: OnNotification<T> = null) {
            if (!this.eventListeners.has(eventKey)) {
                return;
            } else {
                if (eventListener != null) {
                    const val = this.eventListeners.get(eventKey);
                    const index = val.findIndex(t => t == eventListener);
                    val.splice(index, 1);
                } else {
                    this.eventListeners.get(eventKey).length = 0;
                    this.eventListeners.delete(eventKey);
                }
            }
        }
        
        public dispatchEvent(eventKey: string, notific: Notification<T>) {
            if (!this.eventListeners.has(eventKey))
                return;
            this.eventListeners.get(eventKey).forEach(v => v(notific));
        }
        
        public hasEventListener(eventKey: string) {
            return this.eventListeners.has(eventKey);
        }
    }
}