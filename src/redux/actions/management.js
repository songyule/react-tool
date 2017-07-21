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

export const getManagementAttributes = async (params) => {
  const response = await fetch.get('management/attribute', { params})
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

export const setIndexConfig = (data) => async (dispatch, getState) => {
  try {
    const response = await fetch.post('/management/index/config', { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getIndexConfig = (data) => async (dispatch, getState) => {
  try {
    const response = await fetch.get('/management/index/config', { params: data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const updateIndexConfig = (id, data) => async (dispatch, getState) => {
  try {
    const response = await fetch.patch(`/management/index/config/${id}`, { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error ', error)
  }
}

export const removeIndexConfig = (id) => async (dispatch, getState) => {
  try {
    const response = await fetch.delete(`/management/index/config/${id}`)
    return response
  } catch (error) {
    console.log('error ', error)
  }
}
