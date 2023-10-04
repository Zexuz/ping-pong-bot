import {createPongPayload} from "./createPongPayload";
import {PingEvent} from "./types";

describe('PongPayloadFactory', () => {

  it('should create a PongPayload', () => {
    const pingEvent: PingEvent = {
      blockNumber: 1,
      transactionHash: '0x123',
      index: 1
    };

    const payload = createPongPayload(pingEvent);

    expect(payload).toEqual({
      blockNumber: 1,
      transactionHash: '0x123',
      id: '0x123-1'
    });
  });

});
