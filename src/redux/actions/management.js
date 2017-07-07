import fetch from 'api/utils'

export const getOrgList = async (params) => {
  const response = await fetch.get('/management/org', { params })
  return response
}
