// import { QiniuAxios, PictureAxios } from './axios'
import fetch from 'api/utils'
import { qiniuRequest } from 'api/customRequest'
import { QINIU_PREFIX } from './config'

// 七牛上传
export function uploadQiniu ({ file, token }) {
  const formData = new FormData()
  formData.append('file', formData)
  formData.append('token', token)
  return qiniuRequest(file, { token })
}

// 获取七牛token
export function getQiniuToken () {
  return fetch.get('/pic/upload_token')
}

export function wrapperUploadQiniu (file) {
  return getQiniuToken()
  .then(res => uploadQiniu({ file, token: res.data.token }))
  .then(res => `${QINIU_PREFIX}${res.key}`)
}

export function wrapperUploadQiniuImages (files) {
  let list = []

  return getQiniuToken()
  .then(res => {
    list = [...files].map(file => uploadQiniu({ file, token: res.data.token }))

    return Promise.all(list)
  })
  .then(resList => resList.map(res => `${QINIU_PREFIX}${res.key}`))
}
