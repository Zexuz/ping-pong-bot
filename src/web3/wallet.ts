import {ethers} from "ethers";
import {getEnvOrThrow} from "../utils/utils";

export function getWallet() {
  const provider = new ethers.WebSocketProvider(getEnvOrThrow('INFURA_URL'));
  return new ethers.Wallet(getEnvOrThrow('PRIVATE_KEY'), provider)
}
