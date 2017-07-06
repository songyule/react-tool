import React, { PureComponent } from 'react'
import ClassesTree from './classes'
import classes from './classes.json'
import Title from 'components/title'
import arrayToTree from 'array-to-tree'

export default class Classes extends PureComponent {
  componentWillMount () {
    this.getData()
  }

  getData () {
    const matchClass = classes.data.filter(item => item.parent_id === -1)[0] || {}
    matchClass.parent_id = null
    let classesTree = arrayToTree(classes.data)[0].children
    classesTree.sort((a, b) => b.weight - a.weight)
    classesTree.forEach(item => {
      if (item.children) item.children && item.children.sort((a, b) => b.weight - a.weight)
    })
    this.setState({ data: [classesTree]})
  }

  render () {
    const { data } = this.state
    return (
      <div>
        <Title title="商城通用类目" />
        <ClassesTree treeData={data} />
      </div>
    )
  }
}
