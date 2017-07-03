import React, { PureComponent } from 'react'
import AttributeList from './attributes-list'
import PropTypes from 'prop-types'
import has from 'utils/index'

export default class AttributesTree extends PureComponent {
  constructor () {
    super()

    this.state = {
      tree: []
    }
  }

  static propTypes = {
    treeData: PropTypes.array
  }

  componentWillMount () {
    this.firstRender()
  }

  firstRender () {
    const { treeData } = this.props
    this.setState({ tree: treeData })
  }

  treeRender (receiveTree, idx) {
    let { tree, activeItemIdx } = this.state
    const isArray = Array.isArray(receiveTree)
    const { level } = receiveTree[0] || receiveTree

    const SPLICE_INDEX = isArray ? level - 1 : level
    const SPLICE_LENGTH = tree.length - level + 1
    if (Array.isArray(receiveTree)) {
      level <= tree.length
        ? tree.splice(SPLICE_INDEX, SPLICE_LENGTH, receiveTree)
        : tree = [...tree, receiveTree]

    } else {
      tree.splice(SPLICE_INDEX, SPLICE_LENGTH)
    }

    this.setState({ tree: [...tree] })
  }

  render () {
    const { tree } = this.state
    return (
      <div>
      {
        tree.map((item, idx) => (
          <AttributeList key={idx}
            treeItemData={item}
            level={idx}
            activeItemIdx={this.state.activeItemIdx}
            treeRender={next => this.treeRender(next)}
          >
          </AttributeList>
        ))
      }
      </div>
    )
  }
}
