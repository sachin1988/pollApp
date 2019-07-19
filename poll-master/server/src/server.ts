import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { QuizData } from '../quiz';

const app = express();

//initialize a simple http server
const server = http.createServer(app);
// this has to come from db
let responseMap: { [key: string]: number } = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
}

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let adminSock: WebSocket;

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        const wsMessage = JSON.parse(message);
        if (wsMessage.start) {
            //send immediatly a feedback to the incoming connection    
            console.log('starting quiz');
            // need to add id to admin socket
            adminSock = ws;
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        data: QuizData
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
            }, 10000)
        } else if (wsMessage.stop) {
            ws.terminate();
        } else {
            responseMap[message.toString()] = responseMap[message.toString()] + 1;
            adminSock.send(JSON.stringify(responseMap));
            console.log('response received', message);
        }
    });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    const address = server.address() as { port: number; family: string; address: string; };
    console.log(`Server started on port ${address.port} :)`);
});