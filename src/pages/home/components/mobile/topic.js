import React, { Component } from 'react'
import GraduallyTitle from 'components/gradually-title'
import GoodsTopicCard from './goods-topic-card'
import './topic.css'

class Topic extends Component {
  render () {
    const $cardList = this.props.list.map((item, index) => <GoodsTopicCard className="goods-topic-card" key={index} item={item}></GoodsTopicCard>)

    return (
      <div className="goods-topic">
        <GraduallyTitle subhead="商品专题"></GraduallyTitle>
        <div className="goods-topic__content">
          { $cardList }
        </div>
      </div>
    )
  }
}

export default Topic
