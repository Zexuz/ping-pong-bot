import BlockModel from '../models/status';
import {getEnvOrThrow} from "../utils/utils";

export async function createOrUpdateLastProcessedBlock(lastProcessedBlock: number) {
  const lastBlock = await BlockModel.findOne().sort({lastProcessedBlock: -1});

  if (lastBlock) {
    lastBlock.lastProcessedBlock = lastProcessedBlock;
    await lastBlock.save();
  } else {
    await BlockModel.create({lastProcessedBlock});
  }
}

export async function getLastProcessedBlock() {
  const lastBlock = await BlockModel.findOne().sort({lastProcessedBlock: -1});
  return lastBlock ? lastBlock.lastProcessedBlock : parseInt(getEnvOrThrow('START_BLOCK'), 10);
}
