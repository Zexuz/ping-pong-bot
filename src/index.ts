import {getWallet} from "./web3/wallet";
import {getContractBase, onPing, sendPong} from "./web3/contract";
import {configDotenv} from "dotenv";
import {processEventHandler} from "./handlers/processEventHandler";
import {connectToMongoDb, disconnectFromMongoDb} from "./database/connectToMongoDb";
import {processMissedEvents} from "./sync/processMissedEvents";
import {PingEvent} from "./types";
import {ThreadSafeQueue} from "./queue";
import {checkOldTransactions} from "./sync/checkOldTransactions";
import {pingEventReceivedHandler} from "./handlers/pingEventReceviedHandler.test";

async function main() {
  configDotenv()
  await connectToMongoDb();
  let isRunning = true;

  const wallet = getWallet();
  const provider = wallet.provider;
  if (!provider)
    throw new Error('Provider not found');

  const contractBase = getContractBase(wallet);
  const queue = new ThreadSafeQueue<PingEvent>();

  process.on('SIGINT', async () => {
    console.log('Received SIGINT, stopping queue consumption');
    isRunning = false;
    setTimeout(() => {
      console.log('Forcefully closing application');
      process.exit(0);
    }, 1000 * 10);
  });



  await checkOldTransactions(provider, wallet, queue);
  await processMissedEvents(contractBase, pingEventReceivedHandler(queue));
  await onPing(contractBase, pingEventReceivedHandler(queue));

  const startProcessingFromQueue = async () => {
    console.log('Starting processing queue');
    const handler = processEventHandler(contractBase);
    const walletNonce = await wallet.getNonce();
    let count = 0;
    while (isRunning) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const event = await queue.dequeue();
      if (!event)
        continue;

      handler(event, walletNonce + count);
      count++;
    }

    await shutdown();
  }

  const shutdown = async () => {
    await contractBase.removeAllListeners();
    await disconnectFromMongoDb();
    console.log('Closing application');
  }

  await startProcessingFromQueue();
}

(async () => {
  await main();
})()
