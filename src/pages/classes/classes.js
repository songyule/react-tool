import React, { PureComponent } from 'react'
import ClassesList from './classes-list'
import PropTypes from 'prop-types'
import style from './classes.css'
import { Button } from 'antd'
const ButtonGroup = Button.Group

export default class ClassesTree extends PureComponent {
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
    const { editable } = this.state
    this.setState({ editable: !editable })
  }

  handleSave () {
    const { editable } = this.state
    this.setState({ editable: !editable })
  }

  handleCancel () {
    const { editable } = this.state
    this.setState({ editable: !editable })
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

    const index = isArray ? level - 1 : level
    const length = tree.length - level + 1
    if (isArray) {
      level <= tree.length
        ? tree.splice(index, length, receiveTree)
        : tree = [...tree, receiveTree]

    } else {
      tree.splice(index, length, [])
    }

    tree[index - 1].forEach(each => each.active = false)
    tree[index - 1][idx].active = true

    this.setState({ tree: [...tree] })
  }

  render () {
    const { tree, editable } = this.state
    return (
      <div>
        <div>
        {
          editable
           ? (
             <ButtonGroup>
               <Button onClick={::this.handleSave}> 保存 </Button>
               <Button onClick={::this.handleCancel}> 取消 </Button>
             </ButtonGroup>
           )
           : (<Button onClick={::this.handleEdit}> 编辑 </Button>)
        }
        </div>
        <div className={style['tree']}>
        {
          tree.map((item, idx) => (
            <div key={idx} className={style['tree__list']}>
              <ClassesList
                level={idx}
                editable={editable}
                treeItemData={item}
                treeRender={(next, idx) => this.treeRender(next, idx)}
              />
            </div>
          ))
        }
        </div>
      </div>
    )
  }
}
