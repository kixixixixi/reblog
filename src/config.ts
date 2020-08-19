import { readFile } from "fs"
import { promisify } from "util"
import { Config } from "~/types/config"
import { isExistsFile } from "./file"

const defaultConfig: Config = {
  articlePath: "./articles",
  encoding: "utf-8",
  outputPath: "./dist",
}
const configFileName = "reblog.config.json"

const loadConfig = async (file: string): Promise<Config> => {
  if (await isExistsFile(file)) {
    const text = await promisify(readFile)(file, "utf-8")
    const { articlePath, encoding, outputPath } = JSON.parse(text)
    return {
      articlePath: articlePath || defaultConfig.articlePath,
      encoding: encoding || defaultConfig.encoding,
      outputPath: outputPath || defaultConfig.outputPath,
    }
  } else {
    return defaultConfig
  }
}

export { defaultConfig, configFileName, loadConfig }
