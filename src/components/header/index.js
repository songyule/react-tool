import React, { PureComponent } from 'react'
import style from './header.css'
// import { Menu } from 'antd'
// import { Link } from 'react-router-dom'
// import { asyncComponent } from 'router/utils'

export default class extends PureComponent {
  state = {
    current: 'mail'
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <div className={style.header}>
          <div className={style.header__logo}><img src={require('assets/logo.png')} alt=""/></div>
          <div>
          </div>
        </div>
      </div>
    )
  }
}
