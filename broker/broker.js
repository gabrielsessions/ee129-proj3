// Package Imports
import { WebSocketServer } from 'ws';
import 'dotenv/config';

// Initialize the Web Socket Server
// PORT must be specified in a .env file
const wss = new WebSocketServer({ port: 4000 });


// Storing the clients that have an active connection to the server
const topics = {
    "weather": [],
    "weather/temperature": [],
    "weather/humidity": [],
}

const clients = {};

// Websocket logic
wss.on('connection', (ws) => {
    ws.on('error', console.error);
    ws.send("Send_Client_ID");
    let clientID = null;

    ws.on('message', (data) => {
        if (!data.toString()) return;

        if (clientID === null) {
            console.log(data.toString())
            const uuid = data.toString().match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
            console.log(uuid)
            if (!data || !uuid) {
                ws.send("Invalid_Client_UUID");
                ws.close();
                return;
            }
            clientID = data.toString();
            if (clients[clientID]) {
                clientID = clientID + "_" + Math.round(Math.random() * 10000);
            }

            clients[clientID] = ws;
            return;
        }

        if (!clients[clientID]) {
            clients[clientID] = ws;
        }

        console.log(clientID + " " + data.toString());

        const splitMessage = data.toString().split(" ");

        // If no spaces, then it's a subscribe, not a publish
        if (splitMessage.length === 1) {
            const topic = data.toString();
            if (topics[topic]) {
                topics[topic].push(clientID);
            };
            return;
        }
        if (splitMessage[0] === "unsubscribe") {
            if (!topics[splitMessage[1]]) return;
            const subscribed = topics[topic].indexOf(clientID);
            if (subscribed !== -1) {
                topics[topic].splice(subscribed, 1);
            }
        }

        // Send message to all clients that are connected to the topic 
        // being published to or any parent topics.
        Object.keys(topics).filter(topic => topic.startsWith(splitMessage[0]))
            .forEach(topic =>
                topics[topic].forEach(client => {
                    try {
                        clients[client].send(topic + " " + splitMessage[1]);
                    }
                    catch (e) {
                        console.error(e);
                    }
                })
            )



    });
    ws.on('close', () => {
        clients[clientID] = undefined;
        // Remove all subscriptions
        Object.keys(topics).forEach((topic => {
            const subscribed = topics[topic].indexOf(clientID);
            if (subscribed !== -1) {
                topics[topic].splice(subscribed, 1);
            }
        }))
    })
});


console.log("Running server on port " + 4000)