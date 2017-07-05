import React, { PureComponent } from 'react'
import style from './index.css'
import treeData from './attr'
import arrayToTree from 'array-to-tree'
import Title from 'components/title'
import { Tree, Button } from 'antd'
const [ TreeNode, ButtonGroup ] = [ Tree.TreeNode, Button.Group ]

export default class Attributes extends PureComponent {
  constructor () {
    super()

    this.state = {
      expandedKeys: []
    }
  }
  onSelect = (expandedKeys, info) => {
    console.log('selected', expandedKeys, info)
    this.setState({ expandedKeys })
  }
  
  handelAdd (e) {
    e.stopPropagation()
  }

  render() {
    const { expandedKeys } = this.state

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
        <Title title="属性管理" />
        <Tree
          autoExpandParent
          expandedKeys={expandedKeys}
          onSelect={this.onSelect}
        >
          {loop(arrayToTree(treeData.data.attribute))}
        </Tree>
      </div>
    )
  }
}
