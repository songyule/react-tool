import React, { Component } from 'react'
import GraduallyTitle from 'components/gradually-title'
import CommonCard from './common-card'
import './common-trends.css'

class Topic extends Component {
  render () {
    const cardList = this.props.list.map((item, index) => <CommonCard item={item} onClick={() => this.props.editImage(this.props.label, index)}></CommonCard>)

    return (
      <div className="common-trends">
        <GraduallyTitle subhead={this.props.title}></GraduallyTitle>
        <div className="common-trends__content">
          { cardList }
        </div>
      </div>
    )
  }
}

export default Topic
