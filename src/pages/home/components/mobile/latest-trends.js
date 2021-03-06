import React, { Component } from 'react'
import GraduallyTitle from 'components/gradually-title'
import LatestCard from './latest-card'
import './latest-trends.css'

class Topic extends Component {
  render () {
    const cardList = this.props.list.map((item, index) => <LatestCard item={item} onClick={() => this.props.editImage('mobile_index_latest_trends', index)}></LatestCard>)

    return (
      <div className="latest-trends">
        <GraduallyTitle subhead="最新趋势"></GraduallyTitle>
        <div className="latest-trends__content">
          { cardList }
        </div>
      </div>
    )
  }
}

export default Topic
