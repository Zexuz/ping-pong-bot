import {ethers} from "ethers";
import {PingEvent} from "./types";
import {sendPong} from "./web3/contract";
import {createPongPayload} from "./createPongPayload";
import {setTransactionAsCompleted, setTransactionAsPending} from "./database/transactions";

export function processEventHandler(contractBase: ethers.Contract) {
  return async (pingEvent: PingEvent, nonce:number) => {
    const transactionResponse = await sendPong(contractBase, pingEvent.transactionHash, nonce);

    const payload = createPongPayload(pingEvent);
    console.log(`Sending pong for ${payload.id}`)
    await setTransactionAsPending(payload.id);

    await transactionResponse.wait();

    await setTransactionAsCompleted(payload.id)
    console.log(`Sent pong for ${payload.id}`)
  }
}
