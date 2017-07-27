import React, { Component } from 'react'
import './latest-card.css'

class Topic extends Component {
  render () {
    return (
      <div className="latest-card">
        <img src={this.props.item.image_url} alt="图片" />
        <div className="latest-card__wrapper">
          <div className="latest-card__introduce">
            <div className="latest-card__introduce-wrapper">
              <h3 className="latest-card__introduce-title">{ this.props.item.title }</h3>
              <div className="latest-card__attributes-box">
                <span className="latest-card__classes">
                  <i className="iconfont icon-dianpu1"></i> 贴布绣 自然
                </span>
                <span className="latest-card__date">
                  <i className="iconfont icon-dianpu1"></i> 18\\07\\22
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Topic
