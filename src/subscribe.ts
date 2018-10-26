import * as WebSocket from "ws"
import { SERVER_ADDRESS } from "./utils/envs"

/**
 * Establish WebSocket Connection with impuAddress in Query
 */
export default async function subscribe(impuAddress: string) {
  return new WebSocket(
    `ws://${SERVER_ADDRESS}?impuAddress=${encodeURIComponent(impuAddress)}`
  )
}
