import {ethers, Provider, Wallet} from "ethers";
import {getPendingTransactions, getReceivedTransactions, setTransactionAsCompleted} from "./database/transactions";
import {sleep} from "./utils/utils";
import {retryOrFailTransaction} from "./retryOrFailTransaction";
import {ThreadSafeQueue} from "./queue";
import {PingEvent} from "./types";

export async function checkOldTransactions(provider: Provider, wallet: Wallet, queue: ThreadSafeQueue<PingEvent>) {
  await checkReceivedTransaction(queue);
  await checkPendingTransactions(provider, wallet);
}
async function checkPendingTransactions(provider: Provider, wallet: Wallet) {
  const pendingTransactions = await getPendingTransactions();
  console.log(`Found ${pendingTransactions.length} pending transactions`)

  const promises = pendingTransactions.map(async (transaction) => {
    const {txHash, eventId} = transaction;
    if (!txHash)
      throw new Error('Transaction hash not found');

    while (true) {
      const receipt = await provider.getTransactionReceipt(txHash);

      if (receipt == null) {
        await sleep(1000 * 10);
        continue;
      }

      if (receipt.status === 1) {
        await setTransactionAsCompleted(transaction.eventId);
        return;
      }

      await retryOrFailTransaction(txHash, eventId, provider, wallet);
    }
  });

  await Promise.all(promises);
}

export async function checkReceivedTransaction(queue: ThreadSafeQueue<PingEvent>) {
  const receivedTransactions = await getReceivedTransactions();
  for (const transaction of receivedTransactions) {
    await queue.enqueue({
      blockNumber: transaction.receivedAtBlock,
      transactionHash: transaction.eventId.split('-')[0],
      index: Number(transaction.eventId.split('-')[1])
    });
  }
}
