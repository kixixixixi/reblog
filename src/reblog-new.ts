import { readdir, writeFile } from "fs"
import mkdirp from "mkdirp"
import { promisify } from "util"
import dayjs from "dayjs"
import { configFileName, loadConfig } from "./config"
import { isExistsDirectory } from "./file"
;(async (): Promise<void> => {
  const { articlePath } = await loadConfig(configFileName)
  if (!isExistsDirectory(articlePath)) {
    await mkdirp(articlePath)
    console.log("Created", articlePath)
  }
  const files = await promisify(readdir)(articlePath, {
    withFileTypes: true,
  })
  const markdownFiles = files.filter(
    (f) => !f.isDirectory() && /.*\.(md|MD)$/.test(f.name)
  )
  let articleId = 1
  if (markdownFiles.length > 0) {
    const lastFileName = [...markdownFiles].sort().reverse()[0].name
    const articleIdStr = lastFileName.split("_")[0]
    articleId = parseInt(articleIdStr) + 1
  }
  const index = process.argv.findIndex((a) => /reblog-new\.js$/.test(a))
  const title = process.argv.slice(index + 1).join(" ")
  const nospaceTitle = title.replace(/ /g, "_")
  const path = `${articlePath}/${("0000" + articleId).slice(
    -4
  )}_${nospaceTitle}.md`
  const content = `---
publish: ${dayjs().format("YYYY-MM-DD")}
title: ${title}
author:
description:
tags:
 - tag1
 - tag2
---
# Conetent Section Title
Content
`
  await promisify(writeFile)(path, content)
  console.log("Created", path)
})()
