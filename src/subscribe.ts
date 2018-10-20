import * as WebSocket from "ws"
import { WS_ADDRESS } from "./utils/envs"

/**
 * Establish WebSocket Connection with impuAddress in Query
 */
export default async function subscribe(impuAddress: string) {
  return new WebSocket(`${WS_ADDRESS}?impuAddress=${encodeURIComponent(impuAddress)}`)
}
