export function showClasses (classes) {
  return classes ? classes.map(item => {
    if (item.level === 1) return item.name_cn
    if (item.level === 2) return item.lv1_name_cn + ' / ' + item.name_cn
    if (item.level === 3) return item.lv2_name_cn + ' / ' + item.lv1_name_cn + ' / ' + item.name_cn
    return ''
  }).join(',') : ''
}

export function showPrice (skus) {
  if (!skus || skus.length === 0) {
    return '暂无价格'
  }
  let priceList = []
  for (let i = 0; i < skus.length; i++) {
    priceList.push(skus[i].price)
  }
  let maxMoney = Math.max.apply(null, priceList)
  let minMoney = Math.min.apply(null, priceList)
  return '￥' + minMoney + ' ~ ' + maxMoney
}

export function showShelvesStatus (status) {
  switch (status) {
    case 1:
      return '已上架'
    case 2:
      return '未上架'
    default:
      return '未知'
  }
}

export function showReviewStatus (value) {
  switch (value) {
    case 1:
      return '未审核'
    case 2:
      return '审核中'
    case 3:
      return '审核通过'
    case 4:
      return '审核不通过'
    case 5:
      return '免审核'
    default:
      return '未知'
  }
}

/**
 * 时间戳格式化
 * @method format
 * @param  {[type]} time      [description]
 * @param  {[type]} formatStr [description]
 * @return {[type]}           [description]
 * $author kokoro
 * date 2016-08-09
 */
export function format (time, formatStr) {
  var t = new Date(time)
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  }
  return formatStr.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
      default:
        return ''
    }
  })
}

/**
 * 对象转成搜索参数
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function searchParams (params) {
  return Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  }).join('&')
}

export function getAttrTree (data, pid) { // 将属性分解成树形结构
  let result = []
  let temp = []
  for (var i = 0; i < data.length; i++) {
    if ((!data[i].parant_id && !pid) || data[i].parent_id === pid) {
      const obj = { name_cn: data[i].name_cn, id: data[i].id, rgb: data[i].value_str, parent_id: data[i].parent_id, level: data[i].level }
      temp = getAttrTree(data, data[i].id)

      if (temp.length > 0) {
        obj.children = temp
      }
      result.push(obj)
    }
  }
  return result
}

export const has = Object.prototype.hasOwnProperty

/**
 * 倒计时
 *
 * @export
 * @param {any}
 * @returns promise
 */
export function countdown ({
  sec = 60,
  update = () => {}
}) {
  let seconds = sec
  return new Promise(function (resolve, reject) {
    let timer = setInterval(() => {
      if (seconds <= 0) {
        clearInterval(timer)
        resolve(this)
        return
      }
      seconds--
      update && update(seconds)
    }, 1000)
  })
}

export function isEmptyObject(e) {
  var t
  for (t in e)
      return !1
  return !0
}
