import React, { PureComponent } from 'react'
import style from './header.css'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
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
          <div className={style.header__logo}>log</div>
          <Menu
            className={style.header__menu}
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="mail">
              <Link to="/main">首页</Link>
            </Menu.Item>
            <Menu.Item key="app">
              <Link to="/sandwiches">Sandwiches</Link>
            </Menu.Item>
            <Menu.Item key="what">
              <Link to="/what/123">what/123</Link>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    )
  }
}

// 组件懒加载

// const Demo = asyncComponent(() => import ('components/demo'))
// const Test = asyncComponent(() => import ('components/test'))
