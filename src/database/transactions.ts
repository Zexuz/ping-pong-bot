import TransactionModel from '../models/transactions';
import {getEnvOrThrow} from "../utils/utils";

export async function createTransaction(eventId: string, receivedAtBlock: number) {
  const newTransaction = new TransactionModel({eventId, status: 'received', receivedAtBlock});
  await newTransaction.save();
}

export async function setTransactionAsPending(eventId: string, transactionHash: string) {
  await TransactionModel.updateOne({eventId}, {status: 'pending', txHash: transactionHash});

}

export async function findTransactionByEventId(eventId: string) {
  return TransactionModel.findOne({eventId});
}

export async function setTransactionAsCompleted(eventId: string) {
  await TransactionModel.updateOne({eventId}, {status: 'completed'});
}

export async function getPendingTransactions() {
  return TransactionModel.find({status: 'pending'});
}

export async function getReceivedTransactions() {
  return TransactionModel.find({status: 'received'});
}

export async function getLastReceivedBlockNumber() {
  const lastBlock = await TransactionModel.findOne().sort({receivedAtBlock: -1});
  return lastBlock ? lastBlock.receivedAtBlock : parseInt(getEnvOrThrow('START_BLOCK'), 10);
}

