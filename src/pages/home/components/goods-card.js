import React, { Component } from 'react'
// import CommonCard from './common-card'
import './goods-card.css'

class Topic extends Component {
  render () {
    const { image, title, price, className } = this.props
    const classList = ['goods-card', className]
    console.log(image)
    return (
      <div className={classList.join(' ')} onClick={this.props.onClick}>
        <div className="img" style={{ backgroundImage: `url(${image})` }}></div>
        <div className="title">
          { title }
        </div>
        <div className="price">
          <div className="price-content">
            ¥ { price } <span>起</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Topic
