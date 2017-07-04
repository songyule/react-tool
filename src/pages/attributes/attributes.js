import React, { PureComponent } from 'react'
import AttributeList from './attributes-list'
import PropTypes from 'prop-types'
import style from './attributes.css'

export default class AttributesTree extends PureComponent {
  constructor () {
    super()

    this.state = {
      tree: [],
      editable: false
    }
  }

  static propTypes = {
    treeData: PropTypes.array
  }

  componentWillMount () {
    this.firstRender()
  }

  handleEdit () {

  }

  firstRender () {
    const { treeData } = this.props
    treeData.forEach(item => item.active = false)
    this.setState({ tree: treeData })
  }

  treeRender (receiveTree, idx) {
    let { tree } = this.state
    const isArray = Array.isArray(receiveTree)
    const { level } = receiveTree[0] || receiveTree

    isArray && receiveTree.forEach(each => each.active = false)

    const SPLICE_INDEX = isArray ? level - 1 : level
    const SPLICE_LENGTH = tree.length - level + 1
    if (isArray) {
      level <= tree.length
        ? tree.splice(SPLICE_INDEX, SPLICE_LENGTH, receiveTree)
        : tree = [...tree, receiveTree]

    } else {
      tree.splice(SPLICE_INDEX, SPLICE_LENGTH)
    }

    tree[SPLICE_INDEX - 1].forEach(each => each.active = false)
    tree[SPLICE_INDEX - 1][idx].active = true

    this.setState({ tree: [...tree] })
  }

  render () {
    const { tree, editable } = this.state
    return (
      <div>
        <div onClick={::this.handleEdit}></div>
        <div className={style['tree']}>
        {
          tree.map((item, idx) => (
            <div key={idx} className={style['tree__list']}>
              <AttributeList
                editable={editable}
                treeItemData={item}
                treeRender={(next, idx) => this.treeRender(next, idx)}
              >
              </AttributeList>
            </div>
          ))
        }
        </div>
      </div>
    )
  }
}
