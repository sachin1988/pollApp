"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const quiz_1 = require("../quiz");
const app = express();
//initialize a simple http server
const server = http.createServer(app);
let responseMap = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
};
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let adminSock;
wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        const wsMessage = JSON.parse(message);
        console.log('received: ', JSON.parse(message));
        if (wsMessage.start) {
            //send immediatly a feedback to the incoming connection    
            console.log('starting quiz');
            adminSock = ws;
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        data: quiz_1.QuizData
                    }));
                }
            });
            const timer = setTimeout(() => {
                clearTimeout(timer);
                console.log('closing timer');
                wss.clients.forEach(function each(client) {
                    if (client !== adminSock && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            stop: true
                        }));
                    }
                });
            }, 10000);
        }
        else if (wsMessage.stop) {
            ws.terminate();
        }
        else {
            responseMap[message.toString()] = responseMap[message.toString()] + 1;
            adminSock.send(JSON.stringify(responseMap));
            console.log('response received', message);
        }
    });
});
//start our server
server.listen(process.env.PORT || 8999, () => {
    const address = server.address();
    console.log(`Server started on port ${address.port} :)`);
});
//# sourceMappingURL=server.js.map