import fetch from 'api/utils'

export const createArticle = async (body) => {
  let response = await fetch.post('/article/list', { body })
  return response
}

export const getArticles = async (params) => {
  let response = await fetch.get('/article/list', { params })
  return response
}
