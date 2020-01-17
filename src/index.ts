#! /usr/bin/env node

import { writeFile, readFile, stat } from "fs"
import mkdirp from "mkdirp"
import { promisify } from "util"
import { dirname } from "path"
import { build } from "./build"
import { Config } from "~/types/config"
;(async (): Promise<void> => {
  const configFileName = "reblog.config.json"
  const defaultConfig: Config = {
    articlePath: "./articles",
    encoding: "utf-8",
    outputPath: "./dist"
  }
  const isExistsFile = async (file: string): Promise<boolean> => {
    try {
      await promisify(stat)(file)
      return true
    } catch {
      return false
    }
  }

  const loadConfig = async (
    file: string
  ): Promise<Config> => {
    if (await isExistsFile(file)) {
      const text = await promisify(readFile)(file, "utf-8")
      const { articlePath, encoding, outputPath } = JSON.parse(text)
      return {
        articlePath: articlePath || defaultConfig.articlePath,
        encoding: encoding || defaultConfig.encoding,
        outputPath: outputPath || defaultConfig.outputPath
      }
    } else {
      return defaultConfig
    }
  }

  try {
    const { articlePath, encoding, outputPath } = await loadConfig(configFileName)
    const result = await build(articlePath, encoding)
    const { articles } = result
    console.info("Generated")
    console.log(
      articles.map(a => `${a.metadata.id} - ${a.metadata.title}`).join("\n")
    )
    const path = outputPath + "/reblog.json"
    await mkdirp(dirname(path))
    await promisify(writeFile)(path, JSON.stringify(result))
  } catch (error) {
    console.error("Error:", error)
  }
})()
