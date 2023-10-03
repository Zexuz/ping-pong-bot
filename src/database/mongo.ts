import mongoose from "mongoose";
import {getEnvOrThrow} from "../utils/utils";
import TransactionModel, {ITransaction} from '../models/transactions';

export async function connectToMongoDb() {
  const uri = getEnvOrThrow('MONGO_URI');
  await mongoose.connect(uri, {})
}

export async function createTransaction(eventId: string) {
  const newTransaction: ITransaction = new TransactionModel({eventId, status: 'pending'});
  await newTransaction.save();
}

export async function findTransactionByEventId(eventId: string) {
  return TransactionModel.findOne({eventId});
}

export async function setTransactionAsCompleted(eventId: string) {
  await TransactionModel.updateOne({eventId}, {status: 'completed'});
}

