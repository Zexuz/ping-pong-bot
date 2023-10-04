import {PingEvent} from "./types";

export function createPongPayload(pingEvent: PingEvent) {
  return {
    blockNumber: pingEvent.blockNumber,
    transactionHash: pingEvent.transactionHash,
    id: `${pingEvent.transactionHash}-${pingEvent.index.toString()}`
  }
}
