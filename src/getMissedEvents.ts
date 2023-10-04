import {Contract} from "ethers";
import {getLastProcessedBlock} from "./database/status";

async function getEventsSinceLastBlock(contract: Contract, lastProcessedBlock: number) {
  const filter = contract.filters.Ping();
  return await contract.queryFilter(filter, lastProcessedBlock + 1);
}

export async function getMissedEvents(contract: Contract) {
  const lastProcessedBlock = await getLastProcessedBlock();

  return await getEventsSinceLastBlock(contract, lastProcessedBlock);
}
