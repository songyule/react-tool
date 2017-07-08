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

const rootReducer = combineReducers({
  resultNumber,
  userLogin,
  // 路由
  routing: routerReducer
})

export default rootReducer
