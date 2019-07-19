import { Injectable } from "@angular/core";

const DefaultHandler = (data?: any) => { };

@Injectable()
export class WebSocketSvc {
    connection: WebSocket;

    onOpenFn: Function[] = [DefaultHandler];
    onErrorFn: Function[] = [DefaultHandler];;
    onMsgFn: Function[] = [DefaultHandler];;

    constructor() {
        this.init();
    }

    registerOnOpen(onOpen: Function) {
        this.onOpenFn.push(onOpen);
    }
    registerOnErrror(onError: Function) {
        this.onErrorFn.push(onError);
    }

    registerOnMsg(onMessage: Function) {
        this.onMsgFn.push(onMessage);
    }

    sendMsg(msg: string) {
        this.connection.send(msg);
    }

    private init() {
        this.connection = new WebSocket('ws://127.0.0.1:8999');

        this.connection.onopen = () => {
            this.onOpenFn.forEach(fn => fn());
        };

        this.connection.onerror = (error) => {
            this.onErrorFn.forEach(fn => fn(error));
        };

        this.connection.onmessage = (message) => {
            this.onMsgFn.forEach(fn => fn(message));
        };
    }
}