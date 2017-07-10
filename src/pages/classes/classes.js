import React, { PureComponent } from 'react'
import ClassesList from './classes-list'
import Card from './card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as attributesActions from 'actions/attributes'
import PropTypes from 'prop-types'
import style from './classes.css'
import { isEmptyObject, format } from 'utils/index'
import { Button } from 'antd'
const ButtonGroup = Button.Group

@connect(
  state => state,
  dispatch => bindActionCreators(attributesActions, dispatch)
)

export default class ClassesTree extends PureComponent {
  constructor () {
    super()

    this.state = {
      tree: [],
      attr: {}
    }
  }

  static propTypes = {
    treeData: PropTypes.array
  }

  componentWillReceiveProps (nextProps) {
    this.firstRender(nextProps)
  }

  firstRender (props) {
    if (!props.reRender) return
    const { treeData } = props
    treeData.forEach(item => item.active = false)
    this.setState({ tree: [...treeData] })
  }

  treeRender (attr, receiveTree, idx) {
    let { tree } = this.state
    const isArray = Array.isArray(receiveTree)
    const { level } = receiveTree[0] || receiveTree

    isArray && receiveTree.forEach(each => each.active = false)

    const index = isArray ? level - 1 : level
    const length = tree.length - level + 1
    if (isArray) {
      level <= tree.length
        ? tree.splice(index, length, receiveTree)
        : tree = [...tree, receiveTree]

    } else {
      if (index < 3) tree.splice(index, length, [])
      else tree.splice(index, length)
    }

    tree[index - 1].forEach(each => each.active = false)
    tree[index - 1][idx].active = true

    this.setState({ tree: [...tree], attr: {...attr} })
  }

  render () {
    const { tree, attr } = this.state
    const { editable, attributesList, refreshList } = this.props

    return (
      <div>
        <div className={style['view']}>
          <div className={style['tree']}>
          {
            tree.map((item, idx) => (
              <div key={idx} className={style['tree__list']}>
                <ClassesList
                  level={idx}
                  editable={editable}
                  treeItemData={item}
                  attr={attr}
                  tree={tree}
                  attributesList={attributesList}
                  refreshList={() => refreshList()}
                  treeRender={(attr, next, idx) => this.treeRender(attr, next, idx)}
                />
              </div>
            ))
          }
          </div>
          <div style={{paddingTop: '10px'}}>
            {
              !isEmptyObject(attr)
                ? (
                  <Card title={`属性 - ${attr.name_cn}`}>
                    <div className={style['attr']}>
                      {
                        attr.image_url
                          ? (
                            <div className={style['attr__image']}>
                              <img src={attr.image_url} />
                            </div>
                          )
                          : null
                      }
                      <div className={style['attr__content']}>
                        <span> 是否显示： </span>
                        <span>{attr.status === 1 ? '显示' : '不显示'}</span>
                      </div>
                      <div className={style['attr__content']}>
                        <span> 权重： </span>
                        <span>{attr.weight}</span>
                      </div>
                      <div className={style['attr__content']}>
                        <span> 创建时间： </span>
                        <span>{format(attr.created_at * 1000, 'yyyy-MM-dd HH:mm:ss')}</span>
                      </div>
                    </div>
                  </Card>
                )
                : null
            }
          </div>
        </div>
      </div>
    )
  }
}
