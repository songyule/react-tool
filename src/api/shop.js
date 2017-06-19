import fetch from './utils'

// 获取自己的信息
export function getHomeData (data) {
  return fetch.get('/shop/index')
}
