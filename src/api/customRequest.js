// 七牛云文件上传
import { QINIU_API } from './config'

const fetch = function fetch(url, options = {}, onProgress) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open(options.method || 'get', url)
		Object.keys(options.headers || {}).forEach((key) => {
			xhr.setRequestHeader(key, options.headers[key])
		})
		xhr.onload = (ev) => {
			try { resolve(JSON.parse(ev.target.responseText)) }
			catch (err) { reject(err) }
		}
		xhr.onerror = reject
		if (xhr.upload && onProgress) {
			xhr.upload.onprogress = onProgress
		}
		xhr.send(options.body)
	})
}

export const qiniuRequest = async (file, options = {}) => {
	const { onProgress } = options
	const token = options.token

	const formData = new FormData()
	formData.append('token', token)
	formData.append('file', file)
	return fetch(QINIU_API, {
		method: 'POST',
		body: formData
	}, onProgress)
}
