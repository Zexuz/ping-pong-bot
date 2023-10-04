import {getPendingTransactions, setTransactionAsCompleted,} from "./database/transactions";
import {sleep} from "./utils/utils";
import {retryOrFailTransaction} from "./retryOrFailTransaction";
import {checkOldTransactions} from "./checkOldTransactions";

jest.mock('./database/transactions');
jest.mock('./utils/utils');
jest.mock('./retryOrFailTransaction');

const mockGetPendingTransactions = getPendingTransactions as jest.MockedFunction<typeof getPendingTransactions>;
const mockSetTransactionAsCompleted = setTransactionAsCompleted as jest.MockedFunction<typeof setTransactionAsCompleted>;
const mockRetryOrFailTransaction = retryOrFailTransaction as jest.MockedFunction<typeof retryOrFailTransaction>;

const mockSleep = sleep as jest.MockedFunction<typeof sleep>;

const mockProvider = {
  getTransactionReceipt: jest.fn(),
  getTransaction: jest.fn()
}

const mockWallet = {
  sendTransaction: jest.fn()
}
describe('checkOldTransactions', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if hash is not set', async () => {
    mockGetPendingTransactions.mockResolvedValueOnce([
        {eventId: '1', status: 'pending'} as any,
      ]
    );

    expect(checkOldTransactions(mockProvider as any, mockWallet as any))
      .rejects
      .toThrowError('Transaction hash not found');
  });

  it('should set already done transactions to completed', async () => {
    mockGetPendingTransactions.mockResolvedValueOnce([
        {eventId: '1', status: 'pending', txHash: '0xHash'} as any,
      ]
    );
    mockProvider.getTransactionReceipt.mockResolvedValue({status: 1});

    await checkOldTransactions(mockProvider as any, mockWallet as any);

    expect(mockGetPendingTransactions).toHaveBeenCalledTimes(1);
    expect(mockProvider.getTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(mockSetTransactionAsCompleted).toHaveBeenCalledWith('1');
  });


  it('should update transaction to completed when done', async () => {
    mockGetPendingTransactions.mockResolvedValueOnce([
        {eventId: '1', status: 'pending', txHash: '0xHash'} as any,
      ]
    );
    mockProvider.getTransactionReceipt.mockResolvedValueOnce(null).mockResolvedValueOnce({status: 1});


    await checkOldTransactions(mockProvider as any, mockWallet as any);

    expect(mockGetPendingTransactions).toHaveBeenCalledTimes(1);
    expect(mockProvider.getTransactionReceipt).toHaveBeenCalledTimes(2);
    expect(mockSetTransactionAsCompleted).toHaveBeenCalledWith('1');
    expect(mockSleep).toHaveBeenCalledTimes(1);
  });

  it('should retry transaction if it failed', async () => {
    mockGetPendingTransactions.mockResolvedValueOnce([
        {eventId: '1', status: 'pending', txHash: '0xHash'} as any,
      ]
    );
    mockProvider.getTransactionReceipt.mockResolvedValueOnce({status: -1});

    await checkOldTransactions(mockProvider as any, mockWallet as any);

    expect(mockRetryOrFailTransaction).toHaveBeenCalledTimes(1);
  });
});


