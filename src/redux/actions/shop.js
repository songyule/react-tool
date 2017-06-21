import fetch from 'api/utils'

export const getHomeData = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/shop/index')
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}
