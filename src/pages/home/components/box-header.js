import React, { Component } from 'react'

class BoxHeader extends Component {
  render () {
    return (
      <div className="box-header">
        <h3 className="box-header__title">{this.props.title}</h3>
        <div className="box-header__subhead">
          <div className="box-header__subhead-left">
            <span className="box-header__subhead-dot"></span>
          </div>
          <span className="box-header__subhead-content">{this.props.subhead}</span>
          <div className="box-header__subhead-right">
            <span className="box-header__subhead-dot"></span>
          </div>
        </div>
      </div>
    )
  }
}

export default BoxHeader
