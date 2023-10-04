import {ethers} from "ethers";
import {setTransactionAsCompleted, setTransactionAsError} from "./database/transactions";
import {retryTransaction} from "./retryTransaction";
import {sleep} from "./utils/utils";

const MAX_RETRIES = 3;

export async function retryOrFailTransaction(txHash: string, eventId: string, provider: ethers.Provider, wallet: ethers.Wallet) {
  const oldTransaction = await provider.getTransaction(txHash);

  if (!oldTransaction) {
    console.error(`Could not fetch old transaction ${txHash}`);
    await setTransactionAsError(eventId);
    return;
  }

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await retryTransaction(wallet, oldTransaction);
      await setTransactionAsCompleted(eventId);
      return;
    } catch (e) {
      console.error(`Failed to retry transaction ${txHash} with error ${e}`);
      await sleep(1000 * 10);
    }
  }

  await setTransactionAsError(eventId);
}
