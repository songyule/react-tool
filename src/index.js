import React from 'react'
import { render } from 'react-dom'
// import registerServiceWorker from './utils/registerServiceWorker'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import history from 'router/history'
import './styles/index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import CustomRoute from 'router'

render(
  <Provider store={store}>
    <CustomRoute history={history}/>
  </Provider>,
  document.getElementById('root'))

// registerServiceWorker()
