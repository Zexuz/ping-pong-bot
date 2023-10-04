import {ethers} from "ethers";
import {getPendingTransactions, setTransactionAsCompleted} from "./database/transactions";
import {sleep} from "./utils/utils";
import {retryOrFailTransaction} from "./retryOrFailTransaction";

export async function checkOldTransactions(provider: ethers.Provider, wallet: ethers.Wallet) {

  const pendingTransactions = await getPendingTransactions();

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
