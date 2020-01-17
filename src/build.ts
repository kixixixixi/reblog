import fs from "fs"
import { promisify } from "util"
import parseMD from "parse-md"
import dayjs from "dayjs"
import { Article, ArticleMetadata } from "~/types/article"

const build = async (articlePath: string, encoding: string) => {
  const files = await promisify(fs.readdir)(articlePath, { withFileTypes: true })
  const markdownFiles = files.filter(f => !f.isDirectory() && /.*\.(md|MD)$/.test(f.name))
  console.log("File count is", markdownFiles.length)
  let articleIds: number[] = []
  const publishArticles: { [key:number]: { [key:number]: ArticleMetadata[] } } = {}
  const authorArticles: { [key:string]: ArticleMetadata[] } = {}
  const tagArticles: { [key:string]: ArticleMetadata[] } = {}
  const articles = await Promise.all(markdownFiles.map(async (file) => {
    const [ fileName , ..._ ] = file.name.split(".")
    console.log("Loading...", fileName)
    const [ articleIdStr, ...names ] = fileName.split("_")
    const articleId = parseInt(articleIdStr)
    const articleName = names.join(" ")
    const text = await promisify(fs.readFile)(articlePath + "/" + file.name, encoding)
    const { metadata, content } = parseMD(text)
    const { author, publish, tags, description, title } = metadata

    const article: ArticleMetadata = {
      id: articleId,
      name: articleName,
      publish: publish,
      title: title,
      description: description,
      author: author,
      tags: [tags].flat()
    }

    if (publish) {
      const year = dayjs(publish).year()
      const month = dayjs(publish).month() + 1
      if (!publishArticles[year]) publishArticles[year] = {}
      if (!publishArticles[year][month]) publishArticles[year][month] = []
      publishArticles[year][month] = [...publishArticles[year][month], article]
    }
    if (author) {
      const authorArticle: ArticleMetadata[] = authorArticles[author] || []
      authorArticles[author] = [...authorArticle, article]
    }
    [tags].flat().forEach((tag: string) => {
      const tagArticle: ArticleMetadata[] = tagArticles[tag] || []
      tagArticles[tag] = [...tagArticle, article]
    })

    articleIds = [...articleIds, articleId]
    return {
      metadata: article,
      content: content
    }
  }))

  if ((new Set(articleIds)).size != articleIds.length) throw "Duplicated article Id"

  return {
    articleIds: [...articleIds].sort(),
    publishArticles,
    authorArticles,
    tagArticles,
    articles
  }
}

export { build }
