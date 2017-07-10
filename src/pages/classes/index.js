import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ClassesTree from './classes'
import ClassesDetail from './detail'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as commodityActions from 'actions/commodity'
import style from './index.css'
import Title from 'components/title'
import arrayToTree from 'array-to-tree'
import { Button } from 'antd'
const ButtonGroup = Button.Group

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)

export default class Classes extends PureComponent {

  static childContextTypes = {
    ref: PropTypes.object
  }

  constructor () {
    super()

    this.state = {
      editable: false,
      reRender: true
    }
  }

  getChildContext () {
    return {
      ref: this.props
    }
  }

  componentWillMount () {
    this.getClassesList()
  }

  handleEdit = () => {
    this.setState({
      editable: true,
      reRender: false
    })
  }

  handleComplete = () => {
    this.setState({
      editable : false,
      reRender: false
   })
  }

  format (classes) {
    const matchClass = classes.filter(item => item.parent_id === -1)[0] || {}
    matchClass.parent_id = null
    let classesTree = arrayToTree(classes)[0].children
    classesTree.sort((a, b) => b.weight - a.weight)
    classesTree.forEach(item => {
      if (item.children) item.children && item.children.sort((a, b) => b.weight - a.weight)
    })
    return classesTree
  }

  getClassesList = async () => {
    const res = await this.props.getClasses()
    const { data } = await commodityActions.getAttributesList()
    this.setState({
      data: [...[this.format(res.data)]],
      attributesList: data,
      reRender: true
    })
  }

  render () {
    const { data, editable, reRender, attributesList } = this.state

    return (
      <div>
        <Title title="商城通用类目">
          <div className={style['title-single-button']}>
          {
            editable
             ? <Button onClick={this.handleComplete}> 完成 </Button>
             : <Button type="primary" onClick={this.handleEdit}> 编辑 </Button>
          }
          </div>
        </Title>
        <div className={style['view']}>
          <ClassesTree
            treeData={data}
            editable={editable}
            reRender={reRender}
            attributesList={attributesList}
            refreshList={this.getClassesList}
            />
          <ClassesDetail />
        </div>
      </div>
    )
  }
}
