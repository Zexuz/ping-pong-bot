import {
  setTransactionAsCompleted,
  setTransactionAsError
} from "../database/transactions";
import {retryTransaction} from "./retryTransaction";
import {sleep} from "../utils/utils";
import {retryOrFailTransaction} from "./retryOrFailTransaction";


jest.mock('./database/transactions');
jest.mock('./utils/utils')
jest.mock('./retryTransaction')

const mockSetTransactionAsCompleted = setTransactionAsCompleted as jest.MockedFunction<typeof setTransactionAsCompleted>;
const mockSetTransactionAsError = setTransactionAsError as jest.MockedFunction<typeof setTransactionAsError>;
const mockRetryTransaction = retryTransaction as jest.MockedFunction<typeof retryTransaction>;

const mockSleep = sleep as jest.MockedFunction<typeof sleep>;

const mockProvider = {
  getTransaction: jest.fn()
}


describe('retryOrFailTransaction', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set transaction to error if the transaction does not exists', async () => {
    mockProvider.getTransaction.mockResolvedValueOnce(null);

    await retryOrFailTransaction('0xHash', '1', mockProvider as any, {} as any);

    expect(mockSetTransactionAsError).toHaveBeenCalledWith('1');
  });

  it('should retry transaction if it fails', async () => {
    mockProvider.getTransaction.mockResolvedValueOnce({gasPrice: 1, gasLimit: 1, nonce: 1});
    mockRetryTransaction.mockRejectedValueOnce(new Error('Failed to retry transaction'));

    await retryOrFailTransaction('0xHash', '1', mockProvider as any, {} as any);

    expect(mockProvider.getTransaction).toHaveBeenCalledTimes(1);
    expect(mockRetryTransaction).toHaveBeenCalledTimes(2);
    expect(mockSleep).toHaveBeenCalledTimes(1);
    expect(mockSetTransactionAsCompleted).toHaveBeenCalledWith('1');
  });

  it('should set transaction to error if it fails to retry', async () => {
    mockProvider.getTransaction.mockResolvedValueOnce({gasPrice: 1, gasLimit: 1, nonce: 1});
    mockRetryTransaction.mockRejectedValue(new Error('Failed to retry transaction'));

    await retryOrFailTransaction('0xHash', '1', mockProvider as any, {} as any);

    expect(mockProvider.getTransaction).toHaveBeenCalledTimes(1);
    expect(mockRetryTransaction).toHaveBeenCalledTimes(3);
    expect(mockSleep).toHaveBeenCalledTimes(3);
    expect(setTransactionAsError).toHaveBeenCalledWith('1');
  });

});
