import {ethers} from "ethers";
import {setTransactionAsError} from "./database/transactions";
import {retryTransaction} from "./retryTransaction";


jest.mock('./database/transactions');


const mockSetTransactionAsError = setTransactionAsError as jest.MockedFunction<typeof setTransactionAsError>;

const mockProvider = {
  getTransactionReceipt: jest.fn(),
  getTransaction: jest.fn()
}

const mockWallet = {
  sendTransaction: jest.fn()
}

describe('retryTransaction', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should mark transaction as failed if it does not exist', async () => {
    const txHash = '0xHash';
    const eventId = '1';
    mockProvider.getTransaction.mockResolvedValueOnce(null);


    await retryTransaction(mockProvider as any, mockWallet as any, txHash, eventId);

    expect(mockSetTransactionAsError).toHaveBeenCalledWith('1');
  });

  it('should retry transaction with higher gas price', async () => {
    const txHash = '0xHash';
    const eventId = '1';
    const oldTransaction = {
      nonce: 1,
      to: '0xTo',
      data: '0xData',
      gasPrice: ethers.parseUnits('1', 'gwei'),
    };
    const newTransaction = {
      nonce: 1,
      to: '0xTo',
      data: '0xData',
      gasPrice: ethers.parseUnits('2', 'gwei'),
    };
    mockProvider.getTransaction.mockResolvedValueOnce(oldTransaction);
    mockWallet.sendTransaction.mockResolvedValueOnce({wait: () => Promise.resolve()});

    await retryTransaction(mockProvider as any, mockWallet as any, txHash, eventId);

    expect(mockProvider.getTransaction).toHaveBeenCalledWith(txHash);
    expect(mockWallet.sendTransaction).toHaveBeenCalledWith(newTransaction);
  });
});


