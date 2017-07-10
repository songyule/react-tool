import React, { PureComponent } from 'react'
import store from '@/redux/store'
import style from './header.css'
import { Avatar, Popover } from 'antd'
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

  logout = () => {
    window.localStorage.removeItem('USER')
    window.location.href = '/login'
  }

  render() {
    const name = store.getState().userLogin.name_cn
    const content = (
      <div className={style.popover}>
        <p>{name}</p>
        <p><a onClick={this.logout} >退出</a></p>
      </div>
    )
    return (
      <div>
        <div className={style.header}>

          <div className={style.header__logo}>
            <img src={require('assets/logo.png')} alt=""/>
          </div>

          <div className={style.header__right}>
            <Popover
              content={content}
              trigger="hover"
              arrowPointAtCenter
              placement="bottomRight"
              overlayStyle={{width: '120px'}}
            >
              <Avatar icon="user" style={{ backgroundColor: '#373d41', border: '1px solid #666' }} />
            </Popover>
          </div>

        </div>
      </div>
    )
  }
}
