import { build } from "../src/build"


const _articleIds = [1, 2]

describe('Build', () => {
  test('build method', async () => {
    const { articleIds, publishArticles } = await build("./__test_articles", "utf-8")
    expect(articleIds).toEqual(_articleIds)
    expect(publishArticles[2020][1].length).toEqual(2)
    expect([...publishArticles[2020][1]].sort((e1, e2) => e1.id < e2.id ? -1 : 1)[0].name).toEqual("test 1")
  })
})
