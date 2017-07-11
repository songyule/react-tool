import fetch from 'api/utils'

export const postSamplingSearch = async body => { // 获取打样单接口
  try {
    let response = await fetch.post('sampling/search', { body })
    return response
  } catch (error) {
    console.log('error : ', error)
  }
}
