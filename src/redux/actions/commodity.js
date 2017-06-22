import fetch from 'api/utils'

export const getSpuList = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/commodity/spu')
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}
