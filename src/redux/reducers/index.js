import { combineReducers } from 'redux'
import * as constants from 'constants'
import { routerReducer } from 'react-router-redux'

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
      const role = JSON.parse(window.localStorage.getItem('ROLE'))
      return role || state
  }
}

const orgList = (state = {}, action) => {
  switch (action.type) {
    case constants.ORG_LIST:
      window.localStorage.setItem('ORG_LIST', JSON.stringify(action.orgList))
      return action.orgList
    default:
      const orgList = JSON.parse(window.localStorage.getItem('ORG_LIST'))
      return orgList || state
  }
}
const rootReducer = combineReducers({
  resultNumber,
  userLogin,
  roleList,
  orgList,
  // 路由
  routing: routerReducer
})

export default rootReducer
