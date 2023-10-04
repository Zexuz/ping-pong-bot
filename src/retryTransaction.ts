import {ethers} from "ethers/lib.esm";
import {setTransactionAsCompleted, setTransactionAsError} from "./database/transactions";

const GAS_PRICE_INCREMENT = 1; // in Gwei

export async function retryTransaction(provider: ethers.Provider, wallet: ethers.Wallet, txHash: string, eventId: string) {
  const oldTransaction = await provider.getTransaction(txHash);
  if (!oldTransaction) {
    console.error(`Could not fetch old transaction ${txHash}`);
    await setTransactionAsError(eventId);
    return;
  }

  const newGasPrice = oldTransaction.gasPrice + ethers.parseUnits(GAS_PRICE_INCREMENT.toString(), 'gwei');

  const tx = {
    nonce: oldTransaction.nonce,
    to: oldTransaction.to,
    data: oldTransaction.data,
    gasPrice: newGasPrice,
  };

  const newTransactionResponse = await wallet.sendTransaction(tx);
  await newTransactionResponse.wait();

  await setTransactionAsCompleted(eventId);
}
