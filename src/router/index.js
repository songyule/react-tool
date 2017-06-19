import React from 'react'
import app from 'pages/App'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import store from '@/redux/store'
import { asyncComponent } from './utils'

const history = syncHistoryWithStore(createBrowserHistory(), store)

const routes =  () => (
  <Router history={history}>
    <div>
      <Route path='/' component={app} />
      <Route path='/tacos' component={Test}  />
      <Route path='/sandwiches' component={Demo} />
    </div>
  </Router>
)

export default routes

// 组件懒加载

const Demo = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("components/demo").default)
  }))

const Test = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("components/test").default)
  }))
