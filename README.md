# EE 129 Project 3: An MQTT Broker
## How to run the Broker
1. Download [Node.js](https://nodejs.dev/en/) if you don't already have it installed. You can check by running `node --version`. The project was designed to run on Node v20.
2. Clone the repository to your computer (or download all of the files as a zip)
3. Go to the `broker` directory in a command line and run `node broker.js`. This should boot up a broker server on port 4000.


## Running the frontend client
0. Open up another terminal
1. Run the server2.py file (modified from Project 2) to boot up the frontend server.
2. Access the web client interface by going to [http://localhost:3000/client/dist/index.html](http://localhost:3000/client/dist/index.html). If it doesn't work in a normal browser window, try using incognito mode.
3. The broker must be up and running in order for the client to function properly, otherwise it won't be able to connect!

## Testing the system
1. To subscribe to a topic like `weather`, enter just the topic name.
2. To publish a message to a topic, use the format `[TOPIC] [VALUE]`. The topic and value should not contain spaces. To view the sent message, open another client and subscribe to the topic.
3. To unsubscribe from a topic, enter `unsubscribe [TOPIC]`. (Ex: `unsubscribe weather`)


