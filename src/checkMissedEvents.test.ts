import {ethers} from "ethers";
import {getUnprocessedEvents} from "./getUnprocessedEvents";
import {checkMissedEvents} from "./checkMissedEvents";


jest.mock('./getUnprocessedEvents');

const mockedGetUnprocessedEvents = getUnprocessedEvents as jest.MockedFunction<typeof getUnprocessedEvents>;

describe('checkMissedEvents', () => {

  it('should get missed events after block', async () => {
    mockedGetUnprocessedEvents.mockResolvedValueOnce([
      {blockNumber: 1} as ethers.EventLog,
      {blockNumber: 2} as ethers.EventLog,
      ]);
    const mockCallback = jest.fn();

    await checkMissedEvents({} as any, (event) => mockCallback(event));

    expect(mockedGetUnprocessedEvents).toBeCalledTimes(1);
    expect(mockCallback).toBeCalledTimes(2);
  });
});



