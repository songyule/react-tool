import fetch from 'api/utils'
import * as constants from '../constants/index'

export const getSpuList = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.get(`/commodity/spu`, { params: data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getClasses = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/class')
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getGoodsAttributes = (params) => async (dispatch, getState) => {
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

export const createSku = (id, data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post('/commodity/sku', { headers: { 'Content-type': 'application/json' }, body: {spu_id: id, ...data} })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export function createSkuList (id, list) {
  return Promise.all(list.map(sku => createSku(id, sku)))
}
