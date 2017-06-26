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
      return action.user
    default:
      return state
  }
}

const rootReducer = combineReducers({
  resultNumber,
  userLogin,
  // 路由
  routing: routerReducer
})

export default rootReducer
