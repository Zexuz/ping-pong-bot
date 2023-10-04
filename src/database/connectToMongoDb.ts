import {getEnvOrThrow} from "../utils/utils";
import mongoose from "mongoose";

export async function connectToMongoDb() {
  const uri = getEnvOrThrow('MONGO_URI');
  await mongoose.connect(uri, {})
}
