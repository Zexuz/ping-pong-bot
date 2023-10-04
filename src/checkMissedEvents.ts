import {Contract, ethers} from "ethers";
import {getUnprocessedEvents} from "./getUnprocessedEvents";

export async function checkMissedEvents(contract: Contract, callback: (event: ethers.EventLog | ethers.Log) => Promise<void>) {
  const events = await getUnprocessedEvents(contract);

  console.log(`Found ${events.length} events to process`);

  for (const event of events) {
    await callback(event)
  }
}
