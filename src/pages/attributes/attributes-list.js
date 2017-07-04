import React, { PureComponent } from 'react'
import cs from 'classnames'
import style from './attributes-list.css'
import PropTypes from 'prop-types'
import { Button } from 'antd'
const ButtonGroup = Button.Group

export default class AttributeList extends PureComponent {

  static propTypes = {
    treeItemData: PropTypes.array,
    treeRender: PropTypes.func,
    editable: PropTypes.bool,
    level: PropTypes.number
  }

  handleClick (attr, idx) {
    if (attr.active) return

    this.props.treeRender(attr.children || attr, idx)
  }

  handleDelete (e) {
    e.stopPropagation()
  }

  handleAdd (e) {

  }

  handleEdit (e) {
    e.stopPropagation()
  }

  render () {
    const { treeItemData, level, editable } = this.props
    const levelMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

    const listStyle = (active) => cs({
      [style['list__item']]: true,
      [style['list__item--active']]: active
    })

    return (
      <div className={style['list']}>
        <h3 className={style['list__title']}>{levelMap[level]}级类目</h3>
        <ul className={style['list__content']}>
          {
            treeItemData.length !== 0
              ? treeItemData.map((attr, idx) => (
                <li
                  key={idx}
                  onClick={() => this.handleClick(attr, idx)}
                  className={listStyle(treeItemData[idx].active)}
                >
                  {attr.name_cn}
                  {
                    editable
                      ? (
                        <div className={style['list__action-box']}>
                          <ButtonGroup>
                            {
                              !attr.children
                                ? (
                                  <Button
                                    size="small"
                                    onClick={(e) => this.handleDelete(e)}
                                  >
                                    删除
                                  </Button>
                                )
                                : null
                            }
                            <Button
                              type="primary"
                              size="small"
                              onClick={(e) => this.handleEdit(e)}
                            >
                              编辑
                            </Button>
                          </ButtonGroup>
                        </div>
                      )
                      : null
                  }
                </li>
              ))
              : (<li>暂无数据</li>)
          }
          {
            editable
              ? (
                <li className={style['list__item']}>
                  <Button onClick={(e) => this.handleAdd(e)}>增加</Button>
                </li>
              )
              : null
          }
        </ul>
      </div>
    )
  }
}
