import {ethers} from "ethers";
import {PingEvent} from "./asd.test";
import {sendPong} from "./web3/contract";
import {createPongPayload} from "./createPongPayload";
import {createTransaction, setTransactionAsCompleted} from "./database/mongo";

export function processEventHandler(contractBase: ethers.Contract) {
  return async (pingEvent: PingEvent) => {
    const transactionResponse = await sendPong(contractBase, pingEvent.transactionHash);

    const payload = createPongPayload(pingEvent);
    await createTransaction(payload.id);

    await transactionResponse.wait();

    await setTransactionAsCompleted(payload.id)
  }
}
