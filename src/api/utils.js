import fetch from 'isomorphic-fetch'
import { API_ROOT } from './config'
import { message } from 'antd'
import StandardError from 'standard-error'
import store from '@/redux/store'
import progress from 'nprogress'
import 'nprogress/nprogress.css'
require('es6-promise').polyfill()
const queryString = require('query-string')
const errorMessages = (res) => `${res.code} ${res.descr}`

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
 * 清算error
 *
 * @param {any} err
 * @returns promise (resolved)
 */
function catchError (err) {
  if (['1040013', '1040014', '1040017', '1040018', '1040019'].indexOf(err.code) > -1) {
    message.error(`${err.descr}, 需重新登录`, 2)
    setTimeout(() => {
      window.localStorage.removeItem('USER')
      window.location.href = '/login'
    }, 2000)
    return
  }

  message.error(err.descr)
  console.log('%c' + errorMessages(err), 'color: red')
  return err
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
    message.error('账号无权限, 需重新登录', 2)
    setTimeout(() => {
      window.localStorage.removeItem('USER')
      window.location.href = '/login'
    }, 2000)
    return Promise.reject(res)
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
    return Promise.reject(res)
  }
  return res
}

/**
 * 正常请求
 *
 * @param {any} response
 * @returns promise
 */
function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  }

  return res.json().then(Promise.reject.bind(Promise))
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
  opts.headers = Object.assign({
      'content-type': 'application/json',
      // 'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI5ZTc2MWEwMmY1ZDc0ZDM0OTQzOTVhM2U0NmM4MjRlNyIsInVpZCI6ImUxMTVkMzQ5MTFhNTRhYjBiYWQ3ZTliODMzODlhYzcxIiwiZXhwIjoxNTAxNDAxMDUxfQ.lFJxExZvzARQu-TUnD5tt6P1ktARYqB99EKPMdAt744'
    },
    opts.headers
  )
  // add x-token
  if (store.getState().userLogin.token) opts.headers['x-token'] = store.getState().userLogin.token

  progress.start()
  apiConfig.count++

  return fetch(mergeUrl, opts)
    .then(changeApiCount)
    .then(check401)
    .then(check404)
    .then(checkStatus)
    .then(jsonParse)
    .catch(catchError)
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
