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
      const user = (userLocal && JSON.parse(userLocal)) || {}
      return user || state
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

const rootReducer = combineReducers({
  resultNumber,
  userLogin,
  roleList,
  // 路由
  routing: routerReducer
})

export default rootReducer
