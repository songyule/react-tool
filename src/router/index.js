import React from 'react'
import main from 'pages/main/index'
import notFound from 'pages/404/index'
import ant from 'components/try/antdesign'
import tab from 'components/try/tab'
import Try from 'components/try'
import Crm from 'components/crm'
import Login from 'pages/login/index'
import Goods from 'pages/commodity/index'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import store from '@/redux/store'

const history = syncHistoryWithStore(createBrowserHistory(), store)

const routes =  () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/main' component={main} />
        <Route path='/try' component={Try} />
        <Route path='/antdesign' component={ant} />
        <Route path='/tab' component={tab} />
        <Route path='/crm' component={Crm} />
        <Route path='/goods' component={Goods} />
        <Route path='*' component={notFound} />
      </Switch>
    </div>
  </Router>
)

export default routes
