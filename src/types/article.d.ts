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

