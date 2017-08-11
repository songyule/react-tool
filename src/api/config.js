import { IS_DEV, IS_DEPLOY_DEV } from '../config'

export const API_ROOT = IS_DEV ? 'https://test.fuliaoyi.com/tool/api' : 'https://tool.fuliaoyi.com/api'

export const QINIU_API = IS_DEV ? 'http://upload.qiniu.com' : 'https://up.qbox.me'

export const QINIU_PREFIX = IS_DEV ? 'https://timage.fuliaoyi.com/' : 'https://image.fuliaoyi.com/'
// export const API_ROOT = IS_DEV ? 'https://test.fuliaoyi.com/mrp/api' : 'https://tool.fuliaoyi.com/api'

export const PC_URL = IS_DEV ? 'http://mp.fuliaoyi.com' : 'https://www.fuliaoyi.com'

export const MOBILE_URL = IS_DEPLOY_DEV ? 'https://dev.fuliaoyi.com' : 'https://shop.fuliaoyi.com/'

export const CUSTOM_ATTRIBUTE_PARENT_ID = IS_DEPLOY_DEV ? '1942' : '219'
