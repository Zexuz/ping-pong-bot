import {ethers} from "ethers";
import {retryTransaction} from "./retryTransaction";


jest.mock('./database/transactions');

const mockWait = jest.fn();
const mockWallet = {
  sendTransaction: jest.fn()
}

describe('retryTransaction', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retry transaction with higher gas price', async () => {
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

    mockWallet.sendTransaction.mockResolvedValueOnce({wait: mockWait});

    await retryTransaction(mockWallet as any, oldTransaction as any);

    expect(mockWallet.sendTransaction).toHaveBeenCalledWith(newTransaction);
    expect(mockWait).toHaveBeenCalledTimes(1);
  });
});


