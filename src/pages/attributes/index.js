import React, { PureComponent } from 'react'
import style from './index.css'
import treeData from './attr'
import arrayToTree from 'array-to-tree'
import Title from 'components/title'
import AttributesForm from './form'
import { Tree, Button, Icon, Modal } from 'antd'
const [ TreeNode, ButtonGroup ] = [ Tree.TreeNode, Button.Group ]

export default class Attributes extends PureComponent {
  constructor () {
    super()

    this.state = {
      expandedKeys: [],
      visible: true,
      confirmLoading: false
    }
  }
  onSelect = (expandedKeys, info) => {
    this.setState({ expandedKeys })
  }

  handelAdd (e) {
    e.stopPropagation()
  }

  handleAddRoot (e) {
    this.setState({ visible: true })
  }

  handleOk () {

  }

  handleCancel () {
    this.setState({ visible: false })
  }

  render() {
    const { expandedKeys, visible, confirmLoading } = this.state

    const titleItem = (title, canDelete) => {
      return (
        <div className={style['tree__title']}>
          <span>{title}</span>
          <ButtonGroup>
            <Button size="small" onClick={(e) => this.handelAdd(e) }> 添加 </Button>
            <Button size="small" type="primary"> 编辑 </Button>
            {canDelete ? <Button size="small"> 删除 </Button> : null}
          </ButtonGroup>
        </div>
      )
    }

    const loop = data => data.map((item) => {
     if (item.children) {
       return (
         <TreeNode
           key={item.id}
           title={titleItem(item.name_cn, false)}
         >
           {loop(item.children)}
         </TreeNode>
       )
     }
     return <TreeNode key={item.id} title={titleItem(item.name_cn, true)} />
    })

    return (
      <div>
        <Title title="属性管理">
          <div className={style['attributes__add-button']}>
            <Button type="primary" onClick={::this.handleAddRoot}>
              <Icon type="plus" />
              添加属性
            </Button>
          </div>
        </Title>
        <Tree
          autoExpandParent
          expandedKeys={expandedKeys}
          onSelect={this.onSelect}
        >
          {loop(arrayToTree(treeData.data.attribute))}
        </Tree>
        <Modal
          title="添加属性"
          wrapClassName="vertical-center-modal"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={::this.handleCancel}
        >
          <AttributesForm name="asd" checked ref="attributesForm"/>
        </Modal>
      </div>
    )
  }
}
