import fetch from 'api/utils'

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

export const getAttributesList = async (params) => {
  const response = await fetch.get('commodity/opt/attribute')
  return response
}
