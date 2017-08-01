import React, { Component } from 'react'
import GraduallyTitle from 'components/gradually-title'
import GoodsCard from '../goods-card'
import style from './recommended.css'

class Topic extends Component {
  render () {
    const list = this.props.list

    return (
      <div className={style['home-recommended']}>
        <GraduallyTitle subhead="为你推荐"></GraduallyTitle>
        <div className={style['home-recommended__content']}>
          { list.map((goods, index) => <GoodsCard className={style['home-recommended__goods-card']} title={goods.title} price={goods.subtitle} image={goods.image_url} onClick={() => this.props.editImage('mobile_index_recommend_product', index)}></GoodsCard>) }

          <div className="home-recommended__goods-card home-box__image-edit" onClick={() => this.props.editImage('mobile_index_recommend_product', -1)}>
          +
          </div>
        </div>
      </div>
    )
  }
}

export default Topic
