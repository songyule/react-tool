import { find } from 'lodash'

export const numberObj = {
  pc_index_top_banner: -1,
  pc_index_top_topic: 4,
  pc_index_latest_trends: 3,
  pc_index_category_trend_1: 3,
  pc_index_category_trend_2: 3,
  pc_index_category_trend_3: 4,
  pc_index_category_trend_4: 4,
  pc_index_recommend_product: -1
}

export const mobileNumberObj = {
  mobile_index_top_banner: -1,
  mobile_index_top_topic: 4,
  mobile_index_latest_trends: 3,
  mobile_index_category_trend_1: 3,
  mobile_index_category_trend_2: 3,
  mobile_index_category_trend_3: 4,
  mobile_index_category_trend_4: 4,
  mobile_index_recommend_product: -1
}

export const emptyItem = {
  id: '',
  title: '',
  subtitle: '',
  image_url: '',
  time: [],
  active_at: +new Date() * 0.001,
  deactive_at: +new Date() * 0.001,
  link: '',
  section_code: ''
}

const originDataObj = {}
Object.keys(numberObj).forEach(key => {
  let number = numberObj[key]
  const list = []
  if (number !== -1) {
    while (number--) {
      list.push({
        ...emptyItem,
        weight: numberObj[key] - number,
        link: '',
        section_code: key
      })
    }
  }
  originDataObj[key] = list
})
export const dataObj = originDataObj

const originMobileDataObj = {}
Object.keys(mobileNumberObj).forEach(key => {
  let number = mobileNumberObj[key]
  const list = []
  if (number !== -1) {
    while (number--) {
      list.push({
        ...emptyItem,
        weight: mobileNumberObj[key] - number,
        link: '',
        section_code: key
      })
    }
  }
  originMobileDataObj[key] = list
})
export const mobileDataObj = originMobileDataObj

/* 计算首页数据 */
export function caclDataObj (groupObj) {
  Object.keys(numberObj).forEach(key => {
    if (!groupObj[key]) groupObj[key] = []
    let count = numberObj[key]
    if (count === -1) {
      dataObj[key] = groupObj[key]
    } else {
      const list = []
      while (count--) {
        const matchObj = find(groupObj[key], { 'weight': count + 1 })
        list[count] = matchObj ? {...matchObj} : {...dataObj[key][count]}
      }
      dataObj[key] = list
    }
  })

  return dataObj
}
