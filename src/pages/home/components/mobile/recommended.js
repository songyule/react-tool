import React, { Component } from 'react'
import GraduallyTitle from 'components/gradually-title'
// import CommonCard from './common-card'
// import './topic.css'

class Topic extends Component {
  render () {
    return (
      <div class="home-recommoneded">
        <GraduallyTitle subhead="为你推荐"></GraduallyTitle>
        <div class="home-recommoneded-content">
        </div>
      </div>
    )
  }
}

export default Topic
