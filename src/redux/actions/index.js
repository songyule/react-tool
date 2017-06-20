import * as constants from 'constants'
import fetch from 'api/utils'

export const add = (number) => ({
  type: constants.ADD_NUMBER,
  number
})

// 获取自己的信息
export function getHomeData (data) {
  return fetch.get('/shop/index')
}
