import { stat } from "fs"
import { promisify } from "util"

const isExistsFile = async (file: string): Promise<boolean> => {
  try {
    await promisify(stat)(file)
    return true
  } catch {
    return false
  }
}

const isExistsDirectory = async (file: string): Promise<boolean> => {
  try {
    const stats = await promisify(stat)(file)
    return stats.isDirectory() ? true : false
  } catch {
    return false
  }
}

export { isExistsFile, isExistsDirectory }
