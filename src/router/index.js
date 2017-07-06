import React from 'react'
import main from 'pages/main/index'
import notFound from 'pages/404/index'
import Login from 'pages/login/index'
import Goods from 'pages/commodity/index'

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import store from '@/redux/store'

const history = syncHistoryWithStore(createBrowserHistory(), store)

function homeRedirect () {
  return store.getState().userLogin.token ? (
    <main></main>
  ) : (
    <Redirect to="/login"></Redirect>
  )
}

const routes =  () => (
  <Router history={history}>
    <div>
      <Route path='' exact strict component={homeRedirect} />
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/main' component={main} />
        <Route path='/goods' component={Goods} />
        <Route path='*' component={notFound} />
      </Switch>
    </div>
  </Router>
)

export default routes
