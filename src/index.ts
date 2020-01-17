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

  const loadConfig = async (file: string): Promise<Config> => {
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
    const { articlePath, encoding, outputPath } = await loadConfig(
      configFileName
    )
    const result = await build(articlePath, encoding)
    console.info("Generated")
    const path = outputPath + "/aritcle__list.json"
    await mkdirp(dirname(path))
    const { articles, ...list } = result
    console.log(
      articles.map(a => `${a.metadata.id} - ${a.metadata.title}`).join("\n")
    )
    await promisify(writeFile)(path, JSON.stringify(list))
    await Promise.all(
      articles.map(async article => {
        const path = `${outputPath}/article_${(
          "0000" + article.metadata.id
        ).slice(-4)}.json`
        await promisify(writeFile)(path, JSON.stringify(article))
      })
    )
  } catch (error) {
    console.error("Error:", error)
  }
})()
