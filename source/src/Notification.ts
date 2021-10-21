module maze {
    export class Notification<T> {
        public sender: any;
        public param: T;
        
        constructor(sender: any = null, param: T) {
            this.sender = sender;
            this.param = param;
        }
    }
}