import { config } from "dotenv"
config()

const {
  WS_ADDRESS = ""
} = process.env

if (
  [
    WS_ADDRESS
  ].some(a => a === "")
) {
  throw new Error(`Envs not set properly: ${JSON.stringify(process.env)}`)
}

export {
  WS_ADDRESS
}
