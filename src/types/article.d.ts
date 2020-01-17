export interface ArticleMetadata {
  id: number
  name: string
  publish: string
  title: string
  description: string | null
  author: string | string[] | null
  tags: string[] | null
}

export interface Article {
  metadata: ArticleMetadata
  content: string
}

export interface ArticleGenerated {
  articleIds: number[]
  publishArticles: { [key: number]: { [key: number]: ArticleMetadata[] } }
  authorArticles: { [key: string]: ArticleMetadata[] }
  tagArticles: { [key: string]: ArticleMetadata[] }
  articles: Article[]
}
