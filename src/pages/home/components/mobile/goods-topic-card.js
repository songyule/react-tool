import React, { Component } from 'react'
import './goods-topic-card.css'

class GraduallyTitle extends Component {
  render () {
    return (
      <div className="goods-topic-card" onClick={this.props.onClick}>
        <img src={ this.props.item.image_url } alt="图片" />
        <div className="goods-topic-card__wrapper">
          <h3 className="goods-topic-card__title">{ this.props.item.title }</h3>
          <span className="goods-topic-card__button">进入专题</span>
        </div>
      </div>
    )
  }
}

export default GraduallyTitle
