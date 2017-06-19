import React from 'react'
import { render } from 'react-dom'
import App from './pages/App'
import registerServiceWorker from './utils/registerServiceWorker'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import './styles/index.css'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))

registerServiceWorker()
