import { IS_DEV } from '../config'

export const API_ROOT = IS_DEV ? 'https://test.fuliaoyi.com/tool/api' : 'https://tool.fuliaoyi.com/api/'

export const QINIU_API = IS_DEV ? 'https://up.qbox.me' : 'http://upload.qiniu.com'

export const QINIU_PREFIX = IS_DEV ? 'https://timage.fuliaoyi.com/' : 'https://image.fuliaoyi.com/'