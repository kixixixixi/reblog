import { writeFile } from "fs"
import mkdirp from "mkdirp"
import { promisify } from "util"
import { dirname } from "path"
import { build } from "./build"
import { configFileName, loadConfig } from "./config"
;(async (): Promise<void> => {
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
