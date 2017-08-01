import React, { Component } from 'react'
import './index.css'

class GraduallyTitle extends Component {
  render () {
    return (
      <div className="gradually-title">
        <div className="gradually-title__subhead">
          <div className="gradually-title__subhead-left">
            <span className="gradually-title__subhead-dot"></span>
          </div>
          <span className="gradually-title__subhead-content">{this.props.subhead}</span>
          <div className="gradually-title__subhead-right">
            <span className="gradually-title__subhead-dot"></span>
          </div>
        </div>
      </div>
    )
  }
}

export default GraduallyTitle
