#! /usr/bin/env node

import fs from "fs"
import mkdirp from "mkdirp"
import { promisify } from "util"
import { dirname } from "path"
import { build } from "./build"

const articlePath = "./articles"
const encoding = "utf-8"
const outputPath = "./dist"

build(articlePath, encoding)
  .then(async result => {
    const { articles } = result
    console.info("Generated")
    console.log(
      articles.map(a => `${a.metadata.id} - ${a.metadata.title}`).join("\n")
    )
    const path = outputPath + "/reblog.json"
    await mkdirp(dirname(path))
    await promisify(fs.writeFile)(path, JSON.stringify(result))
  })
  .catch(error => {
    console.error("Error:", error)
  })
