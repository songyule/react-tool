import fetch from 'api/utils'

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
