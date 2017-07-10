import fetch from 'api/utils'

export const getOrgList = (params) => async (dispatch, getState) => {
  const response = await fetch.get('/management/org', { params })
  if (response) dispatch({ type: 'ORG_LIST', orgList: response.data.org })
  return response
}

export const getOrgListOnce = async (params) => {
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

export const createCommodityAttribute = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post(`/management/attribute`, { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const changeCommodityAttribute = (id, data) => async (dispatch, getState) => {
  try {
    let response = await fetch.patch(`/management/attribute/${id}`, { params: data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getCommodityAttributeList = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/management/attribute', { params: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const multiCreateCommodityAttribute = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post('/commodity/multi/attribute', { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }

export const classesBindAttributes = async (body) => {
  const response = await fetch.post('/management/commodity_class/bind/attribute', { body })
  return response
}

export const createClass = async (body) => {
  const response = await fetch.post('/management/commodity_class', { body })
  return response
}

export const deleteClass = async (id) => {
  const response = await fetch.delete(`/management/commodity_class/${id}`)
  return response
}

export const editClass = async (body, id) => {
  const response = await fetch.patch(`/management/commodity_class/${id}`, { body })
  return response
}
