import fetch from 'api/utils'

export const getRequirementList = async (body) => {
  const response = await fetch.post('/sampling/search', { body })
  return response
}

export const editRequirement = async (body) => {
  const response = await fetch.put('/sampling', { body })
  return response
}

export const creatSampling = async (body) => {
  const response = await fetch.post('/sampling/inquiry', { body })
  return response
}

export const sellerInquirySearch = async (body) => {
  const response = await fetch.post('/sampling/inquiry/seller/search', { body })
  return response
}

export const closeEnquiry = async (body) => {
  const response = await fetch.post('/sampling/inquiry/seller/cancel', { body })
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
