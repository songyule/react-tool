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
