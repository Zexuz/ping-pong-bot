import {ContractEventPayload, ethers} from "ethers";
import {getEnvOrThrow} from "../utils/utils";

const ABI = [
  {
    "anonymous": false,
    "inputs": [],
    "name": "Ping",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "txHash",
        "type": "bytes32"
      }
    ],
    "name": "Pong",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ping",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_txHash",
        "type": "bytes32"
      }
    ],
    "name": "pong",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "pinger",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "testing",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export function getContractBase(wallet: ethers.Wallet) {
  const contractAddress = getEnvOrThrow("CONTRACT_ADDRESS");
  return new ethers.Contract(contractAddress, ABI, wallet);
}

export function sendPong(contract: ethers.Contract, txHash:string, nonce:number):Promise<ethers.TransactionResponse> {
  return contract.pong(txHash, {nonce: nonce});
}

export function onPing(contract: ethers.Contract, callback: (event: ethers.EventLog | ethers.Log) => Promise<void>) {
  return contract.on("Ping", (event:ContractEventPayload) => callback(event.log));
}

