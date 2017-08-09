import React, { Component } from 'react'
import { format } from 'utils'
import './latest-card.css'

class Topic extends Component {
  render () {
    const { item, onClick } = this.props

    return (
      <div className="latest-card" onClick={onClick}>
        <div className="latest-card__background" style={{backgroundImage: `url(${item.image_url})`}}></div>
        <div className="latest-card__wrapper">
          <div className="latest-card__introduce">
            <div className="latest-card__introduce-wrapper">
              <h3 className="latest-card__introduce-title">{ item.title }</h3>
              <div className="latest-card__attributes-box">
                <span className="latest-card__classes">
                  <i className="iconfont icon-dianpu1"></i> { item.article_tag && item.article_tag.map(tag => tag.name).join(' ') }
                </span>
                <span className="latest-card__date">
                  <i className="iconfont icon-dianpu1"></i> { format(item.obj_updated_at * 1000, 'YY\\MM\\dd') }
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
