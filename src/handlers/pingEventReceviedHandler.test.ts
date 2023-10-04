import {ThreadSafeQueue} from "../queue";
import {PingEvent} from "../types";
import {createPongPayload} from "../createPongPayload";
import {createTransaction} from "../database/transactions";



export function pingEventReceivedHandler(queue: ThreadSafeQueue<PingEvent>) {
  return async (event: PingEvent) => {
    const payload = createPongPayload(event);
    console.log(`received event with id ${payload.id}`)
    await createTransaction(payload.id, event.blockNumber);
    console.log(`Adding event to queue ${event.transactionHash}`)
    await queue.enqueue(event);
  }
}
