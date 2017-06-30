import React, { PureComponent } from 'react'
import style from './title.css'
// import { Menu } from 'antd'
// import { Link } from 'react-router-dom'
// import { asyncComponent } from 'router/utils'

export default class extends PureComponent {
  componentDidMount() {
  }

  render() {
    return (
      <div className={style.title}>
        <h3 className={style.title__text}>{this.props.title}</h3>
        <div className={style.title__content}>{this.props.children}</div>
      </div>
    )
  }
}
