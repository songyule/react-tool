import React, { PureComponent } from 'react'

/**
 *
 * 组件懒加载
 *
 * @param {any} 组件引入的func
 * @returns 懒加载的组件
 */
export const asyncComponent = loadComponent => (
  class AsyncComponent extends PureComponent {
    state = {
      Component: null,
    }

    componentWillMount() {
      if (this.hasLoadedComponent()) {
        return
      }
      loadComponent()
        .then(module => module.default)
        .then((Component) => {
          this.setState({ Component })
        })
        .catch((err) => {
          console.error(`Cannot load component in <AsyncComponent />`)
          throw err
        })
    }

    hasLoadedComponent() {
      return this.state.Component !== null
    }

    render() {
      const { Component } = this.state
      return (Component) ? <Component {...this.props} /> : null
    }
  }
)
