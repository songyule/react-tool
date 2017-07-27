import React, { Component } from 'react'
import nav1 from 'assets/home/nav-1.png'
import nav2 from 'assets/home/nav-2.png'
import nav3 from 'assets/home/nav-3.png'
import nav4 from 'assets/home/nav-4.png'
import './nav.css'

class Nav extends Component {
  render () {

    return (
      <div className="nav">
        <div className="nav__wrapper">
          <div className="nav__item">
            <img src={nav1} alt=""/>
            <span>商品</span>
          </div>
          <div className="nav__item">
            <img src={nav2} alt=""/>
            <span>趋势</span>
          </div>
          <div className="nav__item">
            <img src={nav3} alt=""/>
            <span>定制</span>
          </div>
          <div className="nav__item">
            <img src={nav4} alt=""/>
            <span>我的</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Nav
