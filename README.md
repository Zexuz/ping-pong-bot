# ping-pong-bot

## How to run
* Fill in all the values in the `.env.example` file and rename it to `.env`.
* Run `npm install` to install all the dependencies.
* Run `docker run --name my-mongodb -p 27017:27017 -d mongo:latest` to start the mongodb server.
* Run `npm run start` to start the bot.

## Info
* The bot was deployd on block 9808040.
* It's listening on this contract address: `0x19e5352F03667413237D019A9020C0D3a08c3F7d` [here](https://goerli.etherscan.io/address/0x19e5352F03667413237D019A9020C0D3a08c3F7d).


## How it works
* On startup, it checks if we have messages that we received, but didn't process yet, if we do, add them to the queue.
* Check if we missed any messages, if we did, add them to the queue.
* Start listening to the contract for new messages.
* Once we receive a message, save the messages as soon as it is received to mongoDB
* Put the message on the queue.
* Process the message from the queue one by one

## Reflections
This application would be perfect for AWS lambda + SQS architecture, then you don't need a mongodb server, and it would make the whole flow even more scalable and reliable.



