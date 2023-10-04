import {ethers} from "ethers";
import {getMissedEvents} from "./getMissedEvents";
import {processMissedEvents} from "./processMissedEvents";


jest.mock('./getMissedEvents');

const mockedGetUnprocessedEvents = getMissedEvents as jest.MockedFunction<typeof getMissedEvents>;

describe('processMissedEvents', () => {

  it('should get missed events after block', async () => {
    mockedGetUnprocessedEvents.mockResolvedValueOnce([
      {blockNumber: 1} as ethers.EventLog,
      {blockNumber: 2} as ethers.EventLog,
      ]);
    const mockCallback = jest.fn();

    await processMissedEvents({} as any, (event) => mockCallback(event));

    expect(mockedGetUnprocessedEvents).toBeCalledTimes(1);
    expect(mockCallback).toBeCalledTimes(2);
  });
});



