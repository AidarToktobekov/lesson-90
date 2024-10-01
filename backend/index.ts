import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {ActiveConnections, IncomingMessage} from "./types";
import {WebSocket} from 'ws';

const activeConnections: ActiveConnections = {};

const app = express();
expressWs(app);
const port = 8000;
app.use(cors());
const router = express.Router();

const coordinates:WebSocket[] = [];

router.ws('/chat',  (ws, req) => {
    const id = crypto.randomUUID();
    console.log('client connected! id=', id);
    activeConnections[id] = ws;
    coordinates.push(ws);
  
    ws.on('close', () => {
      console.log('client disconnected! id=', id);
      delete activeConnections[id];
    });  
    let username = {
        x: "0",
        y: "0",
    };
    
    ws.on('message', (msg) => {
        try{
            const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
          
            switch (decodedMessage.type) {
              case 'SET_COORDINATES':
                username = decodedMessage.payload;
                break;
              default:
                console.log('Unknown message type:', decodedMessage.type);
            }

            coordinates.forEach((client)=>{
                client.send(msg)
            })
        }catch(e){
            ws.send(JSON.stringify({error: 'Invalid coordinates'}))   
        }
    });
});


app.use(router);

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});