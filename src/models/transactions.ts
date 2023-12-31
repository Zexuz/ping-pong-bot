import mongoose, {Schema, Document} from 'mongoose';

export interface ITransaction extends Document {
  eventId: string;
  status: 'received' | 'pending' | 'completed' | 'error';
  receivedAtBlock: number;
  txHash?: string;
}

const TransactionSchema: Schema = new Schema({
  eventId: {type: String, required: true, unique: true},
  status: {type: String, enum: ['received', 'pending', 'completed', 'error',], required: true},
  receivedAtBlock: {type: Number, required: true},
  txHash: {type: String},
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
