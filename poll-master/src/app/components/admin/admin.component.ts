import { Component } from "@angular/core";
import { WebSocketSvc } from "./../../services/ws.service";

@Component({
    selector: 'admin',
    styleUrls: ['./admin.component.scss'],
    templateUrl: './admin.component.html'
})
export class AdminComponent {
    respnose;
    constructor(private wsSvc: WebSocketSvc) {
        this.wsSvc.registerOnMsg((msg) => {
            this.respnose = JSON.stringify(JSON.parse(msg.data), null, 4);
        })
    }
    startQuiz() {
        this.wsSvc.sendMsg(JSON.stringify({
            start: true
        }));
    }
}