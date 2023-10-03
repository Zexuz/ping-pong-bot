import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  eventId: string;
  status: 'pending' | 'completed';
}

const TransactionSchema: Schema = new Schema({
  eventId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'completed'], required: true },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
