import React, { Component } from 'react'
import './common-card.css'
import img from 'assets/home/font-1.png'

class Topic extends Component {
  render () {
    const { item, onClick } = this.props

    return (
      <div className="home-common-card" onClick={onClick}>
        <div className="home-common-card__image-box">
          <div className="home-common-card__backgroud" style={{ backgroundImage: `url(${item.image_url})` }}></div>
          <div className="home-common-card__label">
            <img className="home-common-card__label-img" src={img} alt="图片"/>
          </div>
        </div>
        <h3 className="home-common-card__title">{ item.title }</h3>
      </div>
    )
  }
}

export default Topic
