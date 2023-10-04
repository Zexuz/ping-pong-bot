import {Contract} from "ethers";
import {getLastReceivedBlockNumber} from "./database/transactions";

async function getEventsSinceLastBlock(contract: Contract, lastProcessedBlock: number) {
  const filter = contract.filters.Ping();
  return await contract.queryFilter(filter, lastProcessedBlock + 1);
}

export async function getMissedEvents(contract: Contract) {
  const lastProcessedBlock = await getLastReceivedBlockNumber();

  return await getEventsSinceLastBlock(contract, lastProcessedBlock);
}
