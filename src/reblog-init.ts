import { writeFile } from "fs"
import mkdirp from "mkdirp"
import { promisify } from "util"
import { defaultConfig, configFileName } from "./config"
import { isExistsFile, isExistsDirectory } from "./file"
;(async (): Promise<void> => {
  if (await isExistsFile(configFileName)) {
    console.log("Config file exists")
  } else {
    await promisify(writeFile)(
      configFileName,
      JSON.stringify(defaultConfig, null, 2)
    )
    console.log("Created", configFileName)
  }
  if (await isExistsDirectory(defaultConfig.articlePath)) {
    console.log("Articles directory exists")
  } else {
    await promisify(mkdirp)(defaultConfig.articlePath)
    console.log("Created", defaultConfig.articlePath)
  }
})()
