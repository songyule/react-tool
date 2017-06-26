import fetch from 'isomorphic-fetch'
import { API_ROOT } from './config'
import {
  message,
  // Modal
} from 'antd'
import StandardError from 'standard-error'
import store from '../redux/store/index'

require('es6-promise').polyfill()

const errorMessages = (res) => `${res.status} ${res.statusText}`

/**
 * 请求401
 *
 * @param {any} res
 * @returns promise
 */
function check401(res) {
  // 登陆界面不需要做401校验
  if (res.status === 401) {
    // Modal.error({
    //   title: "登陆验证过期",
    //   content: "您的登陆验证已过期，请重新登陆",
    //   onOk: () => {
        // cookie.remove('access_token')
        // location.href = '/'
      // }
    // })

    return Promise.reject(errorMessages(res))
  }
  return res
}

/**
 * 请求404
 *
 * @param {any} res
 * @returns promise
 */
function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res))
  }
  return res
}

/**
 * 正常请求
 *
 * @param {any} response
 * @returns promise
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    // 这里补充更多错误参数
    return response.text().then(errorMsg => {
      return new StandardError({
        statusCode: response.status,
        msg: errorMsg
      })
    }).then(err => { throw err })
  }
}

/**
 * json化
 *
 * @param {any} res
 * @returns Promise
 */
function jsonParse(res) {
  return res.json()
}

/**
 * 设置param
 *
 * @param {any} keys
 * @param {any} value
 * @param {any} keyPostfix
 * @returns
 */
function setUriParam(keys, value, keyPostfix) {
  let keyStr = keys[0]

  keys.slice(1).forEach((key) => {
    keyStr += `[${key}]`
  })

  if (keyPostfix) {
    keyStr += keyPostfix
  }

  return `${encodeURIComponent(keyStr)}=${encodeURIComponent(value)}`
}

/**
 *
 * 获取param
 *
 * @param {any} keys
 * @param {any} object
 * @returns
 */
function getUriParam(keys, object) {
  const array = []

  if (object instanceof(Array)) {
    object.forEach((value) => {
      array.push(setUriParam(keys, value, '[]'))
    })
  } else if (object instanceof(Object)) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key]

        array.push(getUriParam(keys.concat(key), value))
      }
    }
  } else {
    if (object !== undefined) {
      array.push(setUriParam(keys, object))
    }
  }

  return array.join('&')
}

/**
 * params 转 String
 *
 * @param {object} params
 * @returns String
 */
function toQueryString(object) {
  const array = []

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const str = getUriParam([key], object[key])

      if (str !== '') {
        array.push(str)
      }
    }
  }

  return array.join('&')
}

/**
 * 获取数据 && 拦截
 *
 * @param {any} url
 * @param {any} opts
 * @returns
 */
function fetchData (url, opts) {
  opts.headers = {
    ...opts.headers,
    'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI5ZTc2MWEwMmY1ZDc0ZDM0OTQzOTVhM2U0NmM4MjRlNyIsInVpZCI6ImQyMDEzMTNiMWE3ZTQwMjY4NDBlNTVkMDUwYzhiZDIwIiwiZXhwIjoxNTAwNzE0ODExfQ.8QbK03MFByCTsUI0sHl-bJ2BqMCpj44HKRvzGVpnO48'
    // 'Authorization': cookie.get('access_token') || ''
  }
  if (store.getState().userLogin.token) opts.headers['x-token'] = store.getState().userLogin.token

  return fetch(url, opts)
    .then(check401)
    .then(check404)
    .then(checkStatus)
    .then(jsonParse)
    .catch(err => {
      console.log('%c' + err, 'color: red');
    })
}

/**
 * fetch请求
 *
 * @class cFetch
 */
class cFetch {

  /**
   * get请求
   *
   * @static
   * @param {any} url
   * @param {any} options
   * @returns promise
   * @memberof cFetch
   */
  static get (url, options) {
    let mergeUrl = API_ROOT + url
    const defaultOptions = {
      method: 'GET'
    }

    const opts = Object.assign({}, defaultOptions, {...options})

    // add query params to url when method is GET
    if (opts && opts.method === "GET" && opts['params']) {
      mergeUrl = mergeUrl + '?' + toQueryString(opts['params'])
    }

    return fetchData(mergeUrl, opts)
  }

  /**
   * post 请求
   *
   * @static
   * @param {any} url
   * @param {any} options
   * @returns promise
   * @memberof cFetch
   */
  static post (url, options) {
    let mergeUrl = API_ROOT + url
    const defaultOptions = {
      method: 'POST'
    }

    const opts = Object.assign({}, defaultOptions, {...options})

    // add query params to url when method is GET
    if (opts && opts.method === "POST" && opts['body']) {
      opts['body'] = JSON.stringify(opts['body'])
    }

    return fetchData(mergeUrl, opts)
  }
}

//catch all the unhandled exception
window.addEventListener("unhandledrejection", function(err) {
  const ex = err.reason
  if (ex.constructor && (ex.constructor === StandardError || ex.msg)) {
    message.error(ex.msg, 2.5)
  }
})

export default cFetch
