import React from 'react'
import Main from 'pages/main/index'
import notFound from 'pages/404/index'
import Login from 'pages/login/index'
import Goods from 'pages/commodity/index'
import GoodsEdit from 'pages/commodity/edit'

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import store from '@/redux/store'

function homeRedirect () {
  return store.getState().userLogin.token ? (
    <Redirect to="/main/topic"></Redirect>
  ) : (
    <Redirect to="/login"></Redirect>
  )
}

const routes =  ({history}) => (
  <Router history={{...history}}>
    <div>
      <Route path='/' exact strict component={homeRedirect} />
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/main' component={Main} />
        <Route path='/goods' component={Goods} />
        <Route path='/goods-edit' component={GoodsEdit} />
        <Route path='*' component={notFound} />
      </Switch>
    </div>
  </Router>
)

export default routes
