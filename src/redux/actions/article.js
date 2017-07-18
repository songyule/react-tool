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
  let response = await fetch.get(`/article/tag/edit/list`)
  return response
}

// 获得所有编辑
export const getEditors = async () => {
  let response = await fetch.get(`/user/editor/list`)
  return response
}

// 获得所有编辑
export const getUpdator = async (params) => {
  let response = await fetch.get(`/article/updator`, { params })
  return response
}

// 新增标签
export const addTag = async (body) => {
  return await fetch.post(`/article/tag/edit/list`, { body })
}

// 新增标签
export const delTag = async (id, body) => {
  return await fetch.delete(`/article/tag/edit/single/${id}`, { body })
}

// 修改标签
export const changeTag = async (id, body) => {
  return await fetch.patch(`/article/tag/edit/single/${id}`, { body })
}
