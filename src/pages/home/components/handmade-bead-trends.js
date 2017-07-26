import React, { Component } from 'react'
import HomeBox from './box'

class HandmadeBeadTrends extends Component {
  render () {
    return (
      <HomeBox className="home-box--handmade" title="手工钉珠趋势" subhead="Handmade Bead trends">
        { this.props.list.map((item, index) => (
          <div className="home-box__content-box" key={index}>
            <div className="home-box__image-edit" onClick={() => this.props.editImage('pc_index_category_trend_2', index)}>
            { item.image_url ? <img src={item.image_url} alt=""/> : '+'}
            </div>
            <div className="home-box__introduce-wrapper">
              <div className="home-box__introduce">
                <h3 className="home-box__introduce-title">{item.title}</h3>
                <div className="home-box__introduce-bar-wrapper">
                  <div className="home-box__introduce-bar"></div>
                </div>
                <div className="home-box__introduce-attributes-box">
                  <span className="home-box__introduce-date">
                    <i className="iconfont icon-biaoqian"></i> 18\\07\\22
                  </span>
                </div>
              </div>
            </div>
          </div>
        )) }
      </HomeBox>
    )
  }
}

export default HandmadeBeadTrends
