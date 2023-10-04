import {ethers} from "ethers";
import {PingEvent} from "./types";
import {sendPong} from "./web3/contract";
import {createPongPayload} from "./createPongPayload";
import {setTransactionAsCompleted, setTransactionAsPending} from "./database/transactions";

export function processEventHandler(contractBase: ethers.Contract) {
  return async (pingEvent: PingEvent, nonce: number) => {
    const payload = createPongPayload(pingEvent);
    console.log(`Sending pong for ${payload.id}`)

    const transactionResponse = await sendPong(contractBase, pingEvent.transactionHash, nonce);

    await setTransactionAsPending(payload.id, transactionResponse.hash);

    await transactionResponse.wait();

    await setTransactionAsCompleted(payload.id)
    console.log(`Sent pong for ${payload.id}`)
  }
}
