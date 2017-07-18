import React, { Component } from 'react'
import BoxHeader from './box-header'

class HomeBox extends Component {
  render () {
    return (
      <div className={this.props.className ? `home-box ${this.props.className}` : 'home-box'}>
        <BoxHeader title={this.props.title} subhead={this.props.subhead}></BoxHeader>
        <div className="home-box__content-wrapper">
          { this.props.children }
        </div>
        <div className="home-box__footer">
          { this.props.link ? <a className="home-box__footer-more">查看更多<i className="el-icon-arrow-right"></i></a> : '' }
        </div>
      </div>
    )
  }
}

export default HomeBox
