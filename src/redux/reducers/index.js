import { combineReducers } from 'redux'
import * as constants from 'constants'
import { routerReducer } from 'react-router-redux'
import arrayToTree from 'array-to-tree'

let offerObj = { list: [], id: '' }
let localOffer = localStorage.getItem('SAVE_OFFER')
if (localOffer) localOffer = JSON.parse(localOffer)
if (localOffer) offerObj = {...offerObj, ...localOffer}

const resultNumber = (state = 1, action) => {
  switch (action.type) {
    case constants.ADD_NUMBER:
      return state + action.number
    default:
      return state
  }
}

const userLogin = (state = {}, action) => {
  switch (action.type) {
    case constants.LOGIN_SUCCESS:
      window.localStorage.setItem('USER', JSON.stringify(action.user))
      return action.user
    default:
      let userLocal = window.localStorage.getItem('USER')
      try {
        const user = (userLocal && JSON.parse(userLocal)) || {}
        return user || state
      } catch (error) {
        return {}
      }
  }
}

const roleList = (state = {}, action) => {
  switch (action.type) {
    case constants.ROLE_LIST:
      window.localStorage.setItem('ROLE', JSON.stringify(action.role))
      return action.role
    default:
      let roleLocal = window.localStorage.getItem('ROLE')
      try {
        const role = (roleLocal && JSON.parse(roleLocal)) || {}
        return role || state
      } catch (error) {
        return {}
      }
  }
}

const orgList = (state = {}, action) => {
  switch (action.type) {
    case constants.ORG_LIST:
      window.localStorage.setItem('ORG_LIST', JSON.stringify(action.orgList))
      return action.orgList
    default:
      let orgLocal = window.localStorage.getItem('ORG_LIST')
      try {
        const orgList = (orgLocal && JSON.parse(orgLocal)) || []
        return orgList || state
      } catch (error) {
        return []
      }
  }
}

const commodityAttributeObj = (state = { originSkuAttributes: [], skuAttributes: [], spuAttributes: [] }, action) => {
  switch (action.type) {
    case constants.GET_COMMODITY_DEFAULT_ATTRIBUTE:
      return handleAttribute(action.attributes)
    default:
      return state
  }
}

const commodityClasses = (state = { originClasses: [], sortClasses: [] }, action) => {
  switch (action.type) {
    case constants.GET_COMMODITY_CLASSES:
      return handleClasses(action.classes)
    default:
      return state
  }
}

const currentAttributeDetail = (state = {}, action) => {
  switch (action.type) {
    case constants.ATTRIBUTE_DETAIL:
      return action.detail
    default:
      return state
  }
}

const offers = (state = { list: [] }, action) => {
  switch (action.type) {
    case constants.SAVE_OFFER:
      if (offerObj.id === action.id) {
        offerObj.list.push(action.offer)
      } else {
        offerObj.id = action.id
        offerObj.list = [action.offer]
      }
      localStorage.setItem('SAVE_OFFER', JSON.stringify(offerObj))
      return offerObj
    case constants.EDIT_OFFERS:
      offerObj.id = action.id
      offerObj.list = [...action.offers]
      localStorage.setItem('SAVE_OFFER', JSON.stringify(offerObj))
      return offerObj
    default:
      return offerObj
  }
}

function handleAttribute (attributes) {
  const skuAttributes = filterSkuAttributes(attributes)
  return {
    originSkuAttributes: skuAttributes,
    skuAttributes: generateAttrTree(skuAttributes).filter(item => item.children),
    spuAttributes: filterSpuAttributes(attributes)
  }
}

function handleClasses (classes) {
  // classes = classes.filter(item => [undefined, 1, 2].indexOf(item.level) > -1)
  classes.forEach(item => {
    item.disabled = item.status !== 1
  })
  classes = classes.map(item => {
    item = { ...item, value: item.id, label: item.name_cn }
    return item
  })
  const matchClass = classes.filter(item => item.parent_id === -1)[0] || {}
  matchClass.parent_id = null
  // let classesTree = generateClassesTree(classes).filter(item => item.children).filter(item => item.label !== '辅料')
  let classesTree = arrayToTree(classes)[0].children
  classesTree.sort((a, b) => b.weight - a.weight)
  classesTree.forEach(item => {
    if (item.children) item.children && item.children.sort((a, b) => b.weight - a.weight)
  })
  return {
    originClasses: classes,
    sortClasses: classesTree
  }
}

function generateAttrTree (data, pid) {
  let result = []
  let temp = []
  for (var i = 0; i < data.length; i++) {
    if ((!data[i].parant_id && !pid) || data[i].parent_id === pid) {
      const obj = { name_cn: data[i].name_cn, id: data[i].id, rgb: data[i].value_str }
      temp = generateAttrTree(data, data[i].id)

      if (temp.length > 0) {
        obj.children = temp
      }
      result.push(obj)
    }
  }
  return result
}

function filterSkuAttributes (attributes) {
  return attributes.filter(attr => attr.lv1_name_cn === '商品类型' || attr.lv1_name_cn === '颜色' || attr.lv1_name_cn === '单位')
}

function filterSpuAttributes (attributes) {
  return attributes.filter(attr => attr.lv1_name_cn !== '商品类型' && attr.lv1_name_cn !== '颜色' && attr.lv1_name_cn !== '单位')
}
const rootReducer = combineReducers({
  resultNumber,
  userLogin,
  roleList,
  orgList,
  commodityAttributeObj,
  commodityClasses,
  currentAttributeDetail,
  offers,
  // 路由
  routing: routerReducer
})

export default rootReducer
