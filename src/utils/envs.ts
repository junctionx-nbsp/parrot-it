import { config } from "dotenv"
config()

const {
  SERVER_ADDRESS = ""
} = process.env

if (
  [
    SERVER_ADDRESS
  ].some(a => a === "")
) {
  throw new Error(`Envs not set properly: ${JSON.stringify(process.env)}`)
}

export {
  SERVER_ADDRESS
}
