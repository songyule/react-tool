import React, { Component } from 'react'
import BoxHeader from './box-header'
import Slider from 'react-slick'

class RibbonTrends extends Component {
  render () {
    const recommendedSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: 420
    }

    return (
      <div className="home__recommended">
        <BoxHeader title="推荐商品" subhead="Recommended products"></BoxHeader>
        <Slider {...recommendedSettings}>
          { this.props.list.map((item, index) => (
          <div key={index}>
            <div className="home__recommended-item" onClick={() => this.props.editImage('pc_index_recommend_product', index)}>
              <img src={item.image_url} alt=""/>
            </div>
          </div>
          )) }
          <div>
            <div className="home__recommended-item">
              <div className="home-box__image-edit" onClick={() => this.props.editImage('pc_index_recommend_product', -1)}>
              +
              </div>
            </div>
          </div>
        </Slider>
      </div>
    )
  }
}

export default RibbonTrends
