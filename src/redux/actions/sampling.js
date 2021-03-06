import fetch from 'api/utils'
import * as constants from '../constants/index'

export const getRequirementList = async (body) => {
  const response = await fetch.post('/sampling/search', { body })
  return response
}

export const editRequirement = async (body) => {
  const response = await fetch.put('/sampling', { body })
  return response
}

export const creatSampling = async (body) => { // 创建询价单
  const response = await fetch.post('/sampling/inquiry', { body })
  return response
}

export const sellerInquirySearch = async (body) => { // 询价列表
  const response = await fetch.post('/sampling/inquiry/seller/search', { body })
  return response
}

export const closeEnquiry = async (body) => { // 销售取消报价
  const response = await fetch.post('/sampling/inquiry/seller/cancel', { body })
  return response
}

export const sellerWithdraw = async (body) => { //销售退回报价单
  const response = await fetch.post('/sampling/inquiry/seller/withdraw', { body })
  return response
}

export const enquiryUpdata = async (body) => { //销售重新编辑询价单
  const response = await fetch.post('/sampling/inquiry/seller/update', { body })
  return response
}

export const sellComplete = async (body) => {
  const response = await fetch.post('/sampling/inquiry/seller/complete', { body })
  return response
}
export const getOfferList = async (body) => {
  const response = await fetch.post('/sampling/inquiry/buyer/search', { body })
  return response
}

export const claimOffer = async (id) => {
  const response = await fetch.post('/sampling/inquiry/buyer/claim', { body: { id } })
  return response
}

export const buyerWithdraw = async (data) => {
  const response = await fetch.post('/sampling/inquiry/buyer/withdraw', { body: data })
  return response
}

export const buyerOffer = async (data) => {
  const response = await fetch.post('/sampling/inquiry/buyer/offer', { body: data })
  return response
}

export const saveOffer = ({ id, offer }) => async (dispatch, getState) => {
  dispatch({ type: constants.SAVE_OFFER, offer, id })
}

export const editOffers = ({ id, offers }) => async (dispatch, getState) => {
  dispatch({ type: constants.EDIT_OFFERS, offers, id })
}

export const kd100 = async (data) => {
  const response = await fetch.get('/sampling/kd100')
  return response
}
