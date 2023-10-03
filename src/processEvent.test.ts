import {createTransaction, setTransactionAsCompleted} from "./database/mongo";
import {PingEvent} from "./asd.test";
import {processEventHandler} from "./processEventHandler";


jest.mock('./web3/contract', () => ({
  sendPong: jest.fn(() => Promise.resolve({wait: () => Promise.resolve()}))
}));

jest.mock('./database/mongo', () => ({
  createTransaction: jest.fn(),
  setTransactionAsCompleted: jest.fn()
}));

describe('processEvent', () => {

  it('should save transaction to database', async () => {
    const handler = processEventHandler(jest.fn() as any);

    const pingEvent: PingEvent = {
      blockNumber: 1,
      transactionHash: '0x123',
      index: 1
    }

    await handler(pingEvent);

    expect(createTransaction).toBeCalledWith('0x123-1');
    expect(setTransactionAsCompleted).toBeCalledWith('0x123-1');
  });

});


