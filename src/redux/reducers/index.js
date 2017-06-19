import { combineReducers } from 'redux'
import * as constants from 'constants'

const resultNumber = (state = 1, action) => {
  switch (action.type) {
    case constants.ADD_NUMBER:
      return state + action.number
    default:
      return state
  }
}

const rootReducer = combineReducers({
  resultNumber
})

export default rootReducer
