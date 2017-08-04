// import { QiniuAxios, PictureAxios } from './axios'
import fetch from 'api/utils'
import { qiniuRequest } from 'api/customRequest'
import { QINIU_PREFIX } from './config'

// 七牛上传
export function uploadQiniu ({ file, token, onProgress }) {
  const formData = new FormData()
  formData.append('file', formData)
  formData.append('token', token)
  return qiniuRequest(file, { token, onProgress })
}

// 获取七牛token
export function getQiniuToken () {
  return fetch.get('/pic/upload_token')
}

export function wrapperUploadQiniu (file, onProgress) {
  return getQiniuToken()
  .then(res => uploadQiniu({ file, token: res.data.token, onProgress }))
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

export function uploadQiniuBase64 (base64, onProgress) {
  return getQiniuToken()
  .then(res => uploadQiniu({ file: convertToBlob(base64), token: res.data.token, onProgress }))
  .then(res => `${QINIU_PREFIX}${res.key}`)
}

export function convertToBlob (dataURI) {
  var mimeString =  dataURI.split(',')[0].split(':')[1].split(';')[0] // mime类型
  var byteString = atob(dataURI.split(',')[1]) //base64 解码
  var arrayBuffer = new ArrayBuffer(byteString.length) //创建缓冲数组
  var intArray = new Uint8Array(arrayBuffer) //创建视图
  for (var i = 0; i < byteString.length; i += 1) {
      intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([intArray], { type:  mimeString }); //转成blob
}
