import React from 'react'
import {
  // BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
// import Demo from '../pages/demo'
// import Test from '../pages/test'

const Tacos = ({ routes }) => (
  <div>
    <h2>Tacos</h2>
    <ul>
      <li><Link to="/tacos/bus">Bus</Link></li>
      <li><Link to="/tacos/cart">Cart</Link></li>
    </ul>
  </div>
)

const What = (route) => (
  <div>
    <h2>What</h2>
    {console.log(route.match)}
    <div>{route.match.params.id}</div>
  </div>
)


const RouteConfigExample = () => (
    <div>
      <Route exact path='/' component={Tacos} />
      <Route path='/tacos' component={Test}/>
      <Route path='/sandwiches' component={Demo}/>
      <Route path='/what/:id' component={What} />
    </div>
)

export default RouteConfigExample

/**
 *
 * 组件懒加载
 *
 * @param {any} 组件引入的func
 * @returns 懒加载的组件
 */
function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null
    state = { Component: AsyncComponent.Component }

    componentWillMount() {
      if (!this.state.Component) {
        getComponent(Component => {
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return <div>loading</div>
    }
  }
}

const Demo = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("../pages/demo").default)
  }))

const Test = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("../pages/test").default)
  }))
