import React, { PureComponent } from 'react'
import ClassesForm from './form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cs from 'classnames'
import style from './classes-list.css'
import PropTypes from 'prop-types'
import * as attributesActions from 'actions/attributes'
import * as commodityActions from 'actions/commodity'
import { createClass, classesBindAttributes, deleteClass, editClass } from 'actions/management'
import { getAttributesOfClass } from 'actions/commodity'
import { Button, Modal, Cascader, message } from 'antd'
const ButtonGroup = Button.Group

@connect(
  state => state,
  dispatch => bindActionCreators(
    {
      ...attributesActions,
      ...commodityActions
    },
    dispatch
  )
)

export default class ClassesList extends PureComponent {

  constructor () {
    super()

    this.state = {
      current: {},
      isCreate: true,
      visible: false,
      visibleMove: false,
      isRoot: true,
      attrEdit: {}
    }
  }

  static propTypes = {
    treeItemData: PropTypes.array,
    treeRender: PropTypes.func,
    editable: PropTypes.bool,
    level: PropTypes.number,
    attr: PropTypes.object
  }

  handleClick (attr, idx) {
    this.setState({ current: attr })
    if (attr.active) return
    this.props.treeRender(attr, attr.children || attr, idx)
  }

  handleDelete = async (e, id) => {
    e.stopPropagation()

    const res = await deleteClass(id)

    if (res.code === 200 ) {
      message.success('删除成功')
    }
  }

  handleAdd = (e, level, attr) => {
    e.stopPropagation()
    this.setState({
      visible: true,
      isCreate: true,
      isRoot: level === 0,
      id: attr.id
    })
  }

  handleEdit = async (e, level, attr) => {
    e.stopPropagation()
    console.log('列表点击编辑事件所获得的当前attr 并更改state 用于form的props', attr)
    const { data } = await getAttributesOfClass({
      class_id: attr.id,
      with_offspring: 0
    })

    data && this.setState({
      attrEdit: { ...attr },
      visible: true,
      isRoot: level === 0,
      isCreate: false,
      seletedData: data
    })
  }

  handleMove = (e, id) => {
    e.stopPropagation()
    this.setState({
      id,
      visibleMove: true
    })
  }

  handleOk = () => {
    this.classesForm.validateFields(async (err, fieldsValue) => {
      if (err) return

      const res = await createClass(this.getParams(fieldsValue))

      if (res.code === 200) {
        if (fieldsValue.selectedAttributes) {
          this.bindAttribute(fieldsValue.selectedAttributes.map(Number), res.data.id)
        } else {
          message.success('创建成功')
          this.setState({ visible: false })
          this.props.refreshList()
        }
      }
    })
  }

  handleEditOk = () => {
    this.classesForm.validateFields(async (err, fieldsValue) => {
      if (err) return

      const { attrEdit } = this.state
      const res = await editClass(this.getParams(fieldsValue), attrEdit.id)

      if (res.code === 200) {
        if (fieldsValue.selectedAttributes) {
          this.bindAttribute(fieldsValue.selectedAttributes.map(Number), res.data.id)
        } else {
          message.success('保存成功')
          this.setState({ visible: false })
          this.props.refreshList()
        }
      }
    })
  }

  onCascaderChange = async (v) => {
    const parentId = v[v.length - 1]
    this.setState({ parentId })
  }

  handleMoveOk = async () => {
    const { id, parentId } = this.state
    const res = await editClass({ parent_id: parentId }, id)

    if (res.code === 200) {
      message.success('移动成功')
      this.setState({ visibleMove: false })
      this.props.refreshList()
    }
  }

  async bindAttribute (arr, id) {
    const bindRes = await classesBindAttributes({
      attribute_ids: arr,
      class_id: id
    })

    if (bindRes.code === 200) {
      message.success('创建成功')
      this.setState({ visible: false })
      this.props.refreshList()
    }
  }

  getParams (fieldsValue) {
    const { isRoot, id } = this.state
    const { name, isShow, weight, img } = fieldsValue

    const params = {
      name_cn: name,
      status: isShow
    }

    if (weight) params['weight'] = weight
    if (img) params['image_url'] = img[0].response
    params['parent_id'] = isRoot ? 1 : id

    return params
  }

  handleCancel = () => {
    this.setState({
      visible : false,
      visibleMove: false
    })
  }

  render () {
    const { treeItemData, level, editable, attr, attributesList, tree } = this.props
    const levelMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    const { isCreate, visible, visibleMove, isRoot, attrEdit, seletedData } = this.state

    const options = [{ value: 1, label: '根节点', children: treeToOption(tree[0]) }]

    const listStyle = (active) => cs({
      [style['list__item']]: true,
      [style['list__item--active']]: active
    })

    return (
      <div>
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
                              <Button size="small" onClick={(e, id) => this.handleMove(e, attr.id)}> 移动 </Button>
                              <Button type="primary" size="small" onClick={(e, _level, _attr) => this.handleEdit(e, level, attr)}> 编辑 </Button>
                              {
                                !attr.children
                                  ? (<Button size="small" type="danger" onClick={(e, id) => this.handleDelete(e, attr.id)}> 删除 </Button>)
                                  : null
                              }
                            </ButtonGroup>
                          </div>
                        )
                        : null
                    }
                  </li>
                ))
                : (<li style={{padding: '5px 10px', textAlign: 'center'}}>暂无数据</li>)
            }
            {
              editable
                ? (
                  <div style={{padding: '5px 10px', textAlign: 'center'}}>
                    <Button size="small" onClick={(e, _level, _attr) => this.handleAdd(e, level, attr)}>增加</Button>
                  </div>
                )
                : null
            }
          </ul>
        </div>
        <Modal
          title={isCreate ? '添加分类' : '编辑分类'}
          wrapClassName="vertical-center-modal"
          visible={visible}
          onCancel={this.handleCancel}
          onOk={isCreate ? this.handleOk : this.handleEditOk}
        >
          {
            visible
              ? (
                <ClassesForm
                  ref={(ref) => {this.classesForm = ref}}
                  isCreate={isCreate}
                  isRoot={isRoot}
                  attributesList={attributesList}
                  rewrite={attrEdit}
                  seletedData={seletedData}
                />
              )
              : null
          }
        </Modal>

        <Modal
          title="选择移动的位置"
          wrapClassName="vertical-center-modal"
          visible={visibleMove}
          onCancel={this.handleCancel}
          onOk={this.handleMoveOk}
        >
          <Cascader options={options} onChange={this.onCascaderChange} changeOnSelect />
        </Modal>
      </div>
    )
  }
}

function treeToOption (tree) {
  return tree.map (item => {
    if (item.children) {
      return {
        value: item.id,
        label: item.name_cn,
        children: treeToOption (item.children)
      }
    }
    return {
      value: item.id,
      label: item.name_cn
    }
  })
}
