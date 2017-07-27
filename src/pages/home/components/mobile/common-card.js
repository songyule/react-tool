import React, { Component } from 'react'
import './common-card.css'

class Topic extends Component {
  render () {

    return (
      <div className="home-common-card">
        <div className="home-common-card__image-box">
          <img className="home-common-card__img" src={this.props.item.image_url} alt="图片"/>
          <div className="home-common-card__label">
            <img className="home-common-card__label-img" src="~assets/home/font-1.png" alt="图片"/>
          </div>
        </div>
        <h3 className="home-common-card__title">{ this.props.item.title }</h3>
      </div>
    )
  }
}

export default Topic
