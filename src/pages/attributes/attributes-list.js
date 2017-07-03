import React, { PureComponent } from 'react'
import style from './index.css'
import PropTypes from 'prop-types'

export default class AttributeList extends PureComponent {
  constructor () {
    super()

    this.state = {
      activeItemIdx: null
    }
  }

  // componentWillUpdate () {
  //   this.setState({ activeItemIdx: null })
  // }

  static propTypes = {
    treeItemData: PropTypes.array,
    level: PropTypes.number,
    treeRender: PropTypes.func
  }

  handleClick (attr, idx) {
    const { activeItemIdx } = this.state
    if (idx === activeItemIdx) return
    this.setState({ activeItemIdx: idx })

    this.props.treeRender(attr.children || attr)
  }

  render () {

    const { activeItemIdx } = this.state
    const { treeItemData, level } = this.props

    const levelMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

    return (
      <div className="list">
        <h3>{levelMap[level]}级类目</h3>
        <ul>
        {
          treeItemData.map((attr, idx) => (
            <li
              key={idx}
              onClick={() => this.handleClick(attr, idx)}
              className={
                activeItemIdx === idx
                  ? style['list__item--active']
                  : style['list__item']
              }
            >
              {attr.name_cn}
            </li>
          ))
        }
        </ul>
      </div>
    )
  }
}
