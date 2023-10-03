const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  // TODO:
  //  Check database for pending transactions (Transaction that have been sent to the blockchain but not yet mined)
  //  Wait for them to complete, or retry them if they fail
  //  Get last processed block from database
  //  Get events since last processed block
  //  Process events
  //  Listen for new events
  await sleep(1000);
}

(async () => {
  await main();
})()
