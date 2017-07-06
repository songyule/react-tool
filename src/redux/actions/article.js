import fetch from 'api/utils'

export const createArticle = async (body) => {
  let response = await fetch.post('/article/list', { body })
  return response
}

export const getArticles = async (body) => {
  let response = await fetch.post('/article/search', { body })
  return response
}

export const getArticleDetail = async (id, params) => {
  let response = await fetch.get(`/article/edit/${id}`, { params })
  return response
}

export const changeArticle = async (id, body) => {
  let response = await fetch.patch(`/article/edit/${id}`, { body })
  return response
}

// 获得tags
export const getTags = async () => {
  let response = await fetch.get(`/article/tag/list`)
  return response
}

// 获得所有编辑
export const getEditors = async () => {
  let response = await fetch.get(`/user/editor/list`)
  return response
}

