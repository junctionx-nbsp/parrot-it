import { join } from "path"
import { platform, homedir } from "os"

function getFolder() {
  switch (platform()) {
    case "win32":
      return join(homedir(), "AppData", "Roaming")
    case "darwin":
      return join(homedir(), "Library", "Application Support")
    default:
      return join(homedir(), ".config")
  }
}

const appFolder = join(getFolder(), "parrot-it")
export default appFolder
