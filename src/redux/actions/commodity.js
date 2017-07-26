import fetch from 'api/utils'
import * as constants from '../constants/index'
import { onceWrapper } from 'utils'

export const getSpuList = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.get(`/commodity/spu`, { params: data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

//获取分类
export const getClass = async params => { // 根据category查询所有tag
  try {
    let response = await fetch.get('/commodity/class', { params })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

// 设置供应商业务
export const editOrgClass = async body => { // 修改组织信息
  try {
    let response = await fetch.patch(`/management/org/${body.id}`, {body})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const originGetClasses = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/class', { params })
    dispatch({ type: constants.GET_COMMODITY_CLASSES, classes: response.data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

// wr在文章中使用
export const getClassesInArticle = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/class', { params })
    // dispatch({ type: constants.GET_COMMODITY_CLASSES, classes: response.data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getClasses = onceWrapper(originGetClasses)

export const getClassesForClasses = async (params) => {
  try {
    let response = await fetch.get('/commodity/class', { params })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getAttributesOfClass = async (params) => {
  try {
    let response = await fetch.get('/commodity/class', { params })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

const originGetGoodsAttributes = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/opt/attribute')
    dispatch({ type: constants.GET_COMMODITY_DEFAULT_ATTRIBUTE, attributes: response.data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}
export const getAttributesList = async (params) => {
  const response = await fetch.get('commodity/opt/attribute')
  return response
}

export const getGoodsAttributes = onceWrapper(originGetGoodsAttributes)

export const getAttributeList = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/attribute', { params })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const createSpu = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post('/commodity/spu', { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const createSku = async (id, data) => {
  try {
    let response = await fetch.post('/commodity/sku', { headers: { 'Content-type': 'application/json' }, body: {spu_id: id, ...data} })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const removeSku = (id, data) => async (dispatch, getState) => {
  try {
    let response = await fetch.delete(`/commodity/sku/${id}`)
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const createSkuList = (id, list) => async (dispatch, getState) => {
  try {
    let response = await Promise.all(list.map(sku => createSku(id, sku)))
    console.log(response)
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const getAccess = (id) => async (dispatch, getState) => {
  try {
    let response = await fetch.get(`/commodity/access/spu/${id}`)
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const saveAccess = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post('/commodity/access/spu', { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const getSpuText = (id) => async (dispatch, getState) => {
  try {
    let response = await fetch.get(`/commodity/spu/text/${id}`)
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const createSpuText = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post('/commodity/spu/text', { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const updateSpuText = (id, data) => async (dispatch, getState) => {
  try {
    let response = await fetch.patch(`/commodity/spu/text/${id}`, { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const getSpuInfo = (id) => async (dispatch, getState) => {
  try {
    let response = await fetch.get(`/commodity/spu/${id}`)
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const getSkuList = (id) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/sku', { params: { spu_id: id } })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const updateSpu = (id, data) => async (dispatch, getState) => {
  try {
    let response = await fetch.patch(`commodity/spu/${id}`, { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const updateSpuStatus = (id, data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post(`commodity/status/spu/${id}`, { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const updateSku = (id, data) => async (dispatch, getState) => {
  try {
    let response = await fetch.patch(`commodity/sku/${id}`, { headers: { 'Content-type': 'application/json' }, body: data })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}
