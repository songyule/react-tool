import React, { Component } from 'react'
import Slider from 'react-slick'

class HomeBanner extends Component {
  render () {
    const bannerSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: 420
    }

    return (
      <div className="home__banner">
        <Slider {...bannerSettings}>
          { this.props.list.map((item, index) => (
          <div key={index}>
            <div className="home__banner-item" onClick={() => this.props.editImage('pc_index_top_banner', index)}>
              <div className="banner__carousel-slide-content" style={{ backgroundImage: `url(${item.image_url})` }}></div>
            </div>
          </div>
          )) }
          <div>
            <div className="home__banner-item">
              <div className="home-box__image-edit" onClick={() => this.props.editImage('pc_index_top_banner', -1)}>
              +
              </div>
            </div>
          </div>
        </Slider>
      </div>
    )
  }
}

export default HomeBanner
