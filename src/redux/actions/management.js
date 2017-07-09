import fetch from 'api/utils'

export const getOrgList = async (params) => {
  const response = await fetch.get('/management/org', { params })
  return response
}

export const createAttribute = async (body) => {
  const response  = await fetch.post('management/attribute', { body })
  return response
}

export const editAttribute = async (id, body) => {
  const response = await fetch.patch(`/management/attribute/${id}`, { body })
  return response
}

export const deleteAttribute = async (id) => {
  const response = await fetch.delete(`/management/attribute/${id}`)
  return response
}
