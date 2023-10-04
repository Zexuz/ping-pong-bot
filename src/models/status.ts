import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessedBlock extends Document {
  lastProcessedBlock: number;
}

const ProcessedBlockSchema: Schema = new Schema({
  lastProcessedBlock: { type: Number, required: true, unique: true },
});

export default mongoose.model<IProcessedBlock>('ProcessedBlock', ProcessedBlockSchema);
