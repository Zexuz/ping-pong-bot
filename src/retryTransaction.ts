import {ethers} from "ethers";

const GAS_PRICE_INCREMENT = 1; // in Gwei

export async function retryTransaction( wallet: ethers.Wallet, oldTransaction: ethers.TransactionResponse) {
  const newGasPrice = oldTransaction.gasPrice + ethers.parseUnits(GAS_PRICE_INCREMENT.toString(), 'gwei');

  const tx = {
    nonce: oldTransaction.nonce,
    to: oldTransaction.to,
    data: oldTransaction.data,
    gasPrice: newGasPrice,
  };

  const newTransactionResponse = await wallet.sendTransaction(tx);
  await newTransactionResponse.wait();
}
