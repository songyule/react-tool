import React, { Component } from 'react'
// import { Menu, Icon, Tooltip } from 'antd'
// import { Link, Route } from 'react-router-dom'
// import { asyncComponent } from 'router/utils'

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  onContentStateChange = (contentState) => {
    this.setState({
      contentState
    })
  }

  render() {
    return (
      <div>
        你说什么呢
      </div>
    )
  }
}
