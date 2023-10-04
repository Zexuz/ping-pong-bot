import mongoose, {Schema, Document} from 'mongoose';

interface ITransaction extends Document {
  eventId: string;
  status: 'received' | 'pending' | 'completed';
}

const TransactionSchema: Schema = new Schema({
  eventId: {type: String, required: true, unique: true},
  status: {type: String, enum: ['received', 'pending', 'completed',], required: true},
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
