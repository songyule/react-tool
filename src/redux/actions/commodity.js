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

export const originGetClasses = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/class')
    dispatch({ type: constants.GET_COMMODITY_CLASSES, classes: response.data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}
export const getClasses = onceWrapper(originGetClasses)

export const getClassesForClasses = async () => {
  try {
    let response = await fetch.get('/commodity/class')
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

export const createSkuList = (id, list) => async (dispatch, getState) => {
  try {
    let response = await Promise.all(list.map(sku => createSku(id, sku)))
    console.log(response)
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
