import React, { PureComponent } from 'react'
import style from './index.css'
import treeData from './attr'
import arrayToTree from 'array-to-tree'
import Title from 'components/title'
import AttributesForm from './form'
import { createAttribute, editAttribute, deleteAttribute } from 'actions/management'
import { getAttributesList } from 'actions/commodity'
import { Tree, Button, Icon, Modal, message } from 'antd'
const [ TreeNode, ButtonGroup ] = [ Tree.TreeNode, Button.Group ]

export default class Attributes extends PureComponent {
  constructor () {
    super()

    this.state = {
      expandedKeys: [],
      visible: false,
      isCreate: true,
      confirmLoading: false,
      data: [],
      item: {
        name_cn: '',
        attr_type: 1,
        org_id: '',
        weight: '',
        value_num: '',
        value_str: ''
      }
    }
  }

  componentWillMount () {
    this.getAttributes()
  }

  onSelect = (expandedKeys) => {
    this.setState({ expandedKeys })
  }

  handelAdd = (e, id) => {
    e.stopPropagation()
    this.setState({
      visible: true,
      isRoot: false,
      isCreate: true,
      id
    })
  }

  handelEdit = (e, item) => {
    e.stopPropagation()
    this.setState({
      visible: true,
      isCreate: false,
      id: item.id,
      item
    })
  }

  handleAddRoot (e) {
    this.setState({
      visible: true,
      isRoot: true,
      isCreate: true
    })
  }

  handleOk = (id) => {
    this.attributesForm.validateFields(async (err, fieldsValue) => {
      if (err) return
      console.log(fieldsValue)
      const { name, org, isExclusive, weight, value, type } = fieldsValue

      const formData = {
        name_cn: name,
        attr_type: type,
        weight
      }

      type === '1'
        ? formData['value_num'] = value
        : formData['value_str'] = value

      if (isExclusive) formData['org_id'] = org
      if (id) formData['parent_id'] = id

      const res = await createAttribute(formData)

      if (res.code === 200) {
        message.success('创建成功')
        this.setState({ visible: false })
        this.getAttributes()
      }
    })
  }

  handleEditOk = (id) => {
    this.attributesForm.validateFields(async (err, fieldsValue) => {
      if (err) return
      console.log(fieldsValue)
      const { name, org, isExclusive, weight, value, type } = fieldsValue

      const formData = {
        name_cn: name,
        attr_type: type,
        weight
      }

      type === '1'
        ? formData['value_num'] = value
        : formData['value_str'] = value

      if (isExclusive) formData['org_id'] = org

      const res = await editAttribute(id, formData)

      if (res.code === 200) {
        message.success('保存成功')
        this.setState({ visible: false })
        this.getAttributes()
      }
    })
  }

  handelDelete = async (e, id) => {
    e.stopPropagation()
    const res = await deleteAttribute(id)

    if (res.code === 200) {
      message.success('删除成功')
      this.setState({ visible: false }, this.getAttributes)
    }
  }

  handleCancel () {
    this.setState({ visible: false })
  }

  async getAttributes () {
    const { data } = await getAttributesList()
    this.setState({ data })
  }

  render() {
    const { expandedKeys, visible, confirmLoading, data, isRoot, id, isCreate, item } = this.state

    const titleItem = (item, canDelete) => {
      return (
        <div className={style['tree__title']}>
          <span>{item.name_cn}</span>
          <ButtonGroup>
            <Button size="small" onClick={(e, id) => this.handelAdd(e, item.id) }> 添加 </Button>
            <Button size="small" type="primary" onClick={(e, _item) => this.handelEdit(e, item)}> 编辑 </Button>
            {canDelete ? <Button size="small" onClick={(e, id) => this.handelDelete(e, item.id)}> 删除 </Button> : null}
          </ButtonGroup>
        </div>
      )
    }

    const loop = data => data.map((item) => {
     if (item.children) {
       return (
         <TreeNode
           key={item.id}
           title={titleItem(item, false)}
         >
           {loop(item.children)}
         </TreeNode>
       )
     }
     return <TreeNode key={item.id} title={titleItem(item, true)} />
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
          {loop(arrayToTree(data))}
        </Tree>
        <Modal
          title={isCreate ? '添加属性' : '编辑属性'}
          wrapClassName="vertical-center-modal"
          visible={visible}
          onOk={isCreate ? () => this.handleOk(!isRoot && id) : () => this.handleEditOk(id)}
          confirmLoading={confirmLoading}
          onCancel={::this.handleCancel}
        >
          {
            visible
             ? (
               <AttributesForm
                 ref={(ref) => {this.attributesForm = ref}}
                 isCreate={isCreate}
                 item={!isCreate ? item : {}}
               />
             )
             : null
          }
        </Modal>
      </div>
    )
  }
}
