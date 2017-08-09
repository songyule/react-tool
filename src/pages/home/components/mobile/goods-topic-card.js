import React, { Component } from 'react'
import './goods-topic-card.css'

class GraduallyTitle extends Component {
  render () {
    const { item, onClick } = this.props
    return (
      <div className="goods-topic-card" onClick={onClick}>
        <div className="goods-topic-card__backgroud" style={{ backgroundImage: `url(${item.image_url})` }}></div>
        <div className="goods-topic-card__wrapper">
          <h3 className="goods-topic-card__title">{ item.title }</h3>
          <span className="goods-topic-card__button">进入专题</span>
        </div>
      </div>
    )
  }
}

export default GraduallyTitle
