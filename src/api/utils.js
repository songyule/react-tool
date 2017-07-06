import fetch from 'isomorphic-fetch'
import { API_ROOT } from './config'
import { message } from 'antd'
import StandardError from 'standard-error'
import store from '../redux/store/index'
import progress from 'nprogress'
import 'nprogress/nprogress.css'

require('es6-promise').polyfill()
const queryString = require('query-string')

const errorMessages = (res) => `${res.status} ${res.statusText}`

export const apiConfig = {
  count: 0
}

/**
 * 清算加载进度条
 *
 * @param {any} res
 * @returns promise
 */
function changeApiCount (res) {
  apiConfig.count--
  if (!apiConfig.count) progress.set(1 / (apiConfig.count + 1))
  return res
}

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
 * 获取数据 && 拦截
 *
 * @param {any} url
 * @param {any} opts
 * @returns
 */
function fetchData (url, opts) {
  let baseUrl = opts.base_url ? opts.base_url : API_ROOT
  let mergeUrl = baseUrl + url
  // add query params to url when method is GET
  if (opts && opts.method === "GET" && opts['params']) {
    mergeUrl = mergeUrl + '?' + queryString.stringify(opts['params'])
  }
  // add api body when method is not GET
  if (opts && opts.method !== "GET" && opts['body']) {
    opts['body'] = JSON.stringify(opts['body'])
  }
  // add headers
    // 'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI5ZTc2MWEwMmY1ZDc0ZDM0OTQzOTVhM2U0NmM4MjRlNyIsInVpZCI6ImUxMTVkMzQ5MTFhNTRhYjBiYWQ3ZTliODMzODlhYzcxIiwiZXhwIjoxNTAxNDAxMDUxfQ.lFJxExZvzARQu-TUnD5tt6P1ktARYqB99EKPMdAt744'},
  opts.headers = Object.assign({
      'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI5ZTc2MWEwMmY1ZDc0ZDM0OTQzOTVhM2U0NmM4MjRlNyIsInVpZCI6IjkwYmI4YjI5MjliNDQ2YjQ4OGU2ZGRmMDA5Nzc1MzQ2IiwiZXhwIjoxNTAxNjM5MjM5fQ.M0wUIGduWMoVgjJOrkWADazmHDCr-9rohiYymiLz5Qo',
      'content-type': 'application/json'
    },
    opts.headers
  )

  if (store.getState().userLogin.token) opts.headers['x-token'] = store.getState().userLogin.token

  progress.start()
  apiConfig.count++

  return fetch(mergeUrl, opts)
    .then(changeApiCount)
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

const cFetch = {}
const API_METHODS = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']

/**
 * 请求的构造函数
 *
 * @param {any} url
 * @param {any} options
 * @returns function
 */
API_METHODS.forEach(method => {
  cFetch[method.toLowerCase()] = (url, options) => {
    const defaultOptions = {
      method
    }

    const opts = Object.assign({}, defaultOptions, {...options})

    return fetchData(url, opts)
  }
})

//catch all the unhandled exception
window.addEventListener("unhandledrejection", function(err) {
  const ex = err.reason
  if (ex.constructor && (ex.constructor === StandardError || ex.msg)) {
    message.error(ex.msg, 2.5)
  }
})

export default cFetch