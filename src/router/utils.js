import React from 'react'

/**
 *
 * 组件懒加载
 *
 * @param {any} 组件引入的func
 * @returns 懒加载的组件
 */
export function asyncComponent(getComponent) {
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
