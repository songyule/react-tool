import fetch from 'api/utils'
import { searchParams } from 'utils/index'

export const getSpuList = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.get(`/commodity/spu?${searchParams(data)}`)
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}
