import TransactionModel from '../models/transactions';

export async function createTransaction(eventId: string) {
  const newTransaction = new TransactionModel({eventId, status: 'received'});
  await newTransaction.save();
}

export async function setTransactionAsPending(eventId: string) {
  await TransactionModel.updateOne({eventId}, {status: 'pending'});

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

