import { writeFile } from "fs"
import mkdirp from "mkdirp"
import { promisify } from "util"
import { dirname } from "path"
import { defaultConfig, configFileName } from "./config"
import { isExistsFile, isExistsDirectory } from "./file"
;(async (): Promise<void> => {
  if (!isExistsFile(configFileName)) {
    console.log("Config file exists")
  } else {
    await promisify(writeFile)(configFileName, JSON.stringify(defaultConfig))
    console.log("Created", configFileName)
  }
  if (isExistsDirectory(defaultConfig.articlePath)) {
    console.log("Aritcles directory exists")
  } else {
    await mkdirp(dirname(defaultConfig.articlePath))
    console.log("Created", defaultConfig.articlePath)
  }
})()
