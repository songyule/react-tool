import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from 'reducers'

// action 允许异步
const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  // 添加中间件
  middleware.push(createLogger())
}

// 启用redux-devtools
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose

const enhancer = composeEnhancers(
  applyMiddleware(...middleware)
)

const store = createStore(
  reducer,
  enhancer
)

export default store;
