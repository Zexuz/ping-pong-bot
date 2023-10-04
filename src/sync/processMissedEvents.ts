import {Contract, ethers} from "ethers";
import {getMissedEvents} from "./getMissedEvents";

export async function processMissedEvents(contract: Contract, callback: (event: ethers.EventLog | ethers.Log) => Promise<void>) {
  const events = await getMissedEvents(contract);

  console.log(`Found ${events.length} events to process`);

  for (const event of events) {
    await callback(event)
  }
}
