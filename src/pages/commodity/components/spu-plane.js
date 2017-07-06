import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity';
import ScopePlane from './scope-plane';
import { Form, Input, Cascader, Button, Modal, Checkbox, Upload } from 'antd'
import arrayToTree from 'array-to-tree'
import { uniqBy } from 'lodash'
import { generateAttrTree } from 'utils'
import PropTypes from 'prop-types'
import style from './spu-plane.css'
import { find } from 'lodash'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
class SpuPlane extends PureComponent {
  static propTypes = {
    spu: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      originClasses: [],
      classes: [],
      attributesVisible: false,
      attributes: {},
      attributeList: [],
      attrOptions: []
    }
  }

  getClasses = async () => {
    const res = await this.props.getClasses()
    let classes = res.data.filter(item => [undefined, 1, 2].indexOf(item.level) > -1)
    classes = classes.map(item => {
    item = { ...item, value: item.id, label: item.name_cn }
    return item
    })
    classes.forEach(item => {
      item.disabled = item.status !== 1
    })
    const matchClass = classes.filter(item => item.parent_id === -1)[0] || {}
    matchClass.parent_id = null
    this.setState({
      originClasses: classes,
      classes: arrayToTree(classes)[0].children
    })
  }

  componentWillMount = () => {
    this.getClasses()
    this.calcAttributes()
  }

  changeName = (e) => {
    this.props.changeName(e.target.value)
  }

  getSpuAttributes = async () => {
    let list = await this.props.getGoodsAttributes()
    return list.data
  }

  getLinkageAttributes = async () => {
    let list = await this.props.getAttributeList()
    return list.data
  }

  async calcAttributes () {
    const spuAttributes = await this.getSpuAttributes()
    const linkageAttributes = await this.getLinkageAttributes()
    const existAttrs = []
    const attributes = {}
    // 判断 children 是因为 generateArrtTree 函数还存在问题
    let attributeList = uniqBy([...linkageAttributes, ...spuAttributes], 'id')
    attributeList = attributeList.filter(item => item.level === 1 || item.level === 2)
    const attrOptions = generateAttrTree(attributeList).filter(item => item.children)

    attrOptions.forEach(attr => {
      const matchAttrs = this.props.spu.attributes.filter(item => item.lv1_id === attr.id)
      attributes[attr.id] = matchAttrs.map(item => item.id)
      existAttrs.push(...matchAttrs)
    })
    this.setState({
      attributes,
      attrOptions,
      attributeList
    })

    this.props.changeSpu({ ...this.props.spu, attributes: existAttrs })
    // this.spu.attributes = existAttrs
    // this.attributes = attributes
  }

  handleUpload () {}

  handleAddClass = () => {
    const classesSelected = this.props.spu.classesSelected
    classesSelected.push([])
    this.props.changeClass(classesSelected)
  }

  changeClass = (value, index) => {
    const classesSelected = this.props.spu.classesSelected
    classesSelected[index] = value
    const matchClass = find(this.state.originClasses, { id: value.slice(-1)[0] })
    this.props.changeClass({classesSelected, matchClass}, index)
  }

  renderClassBtn (index) {
    if (index === 0 && this.props.spu.classesSelected.length < 3) {
      return <span className={style['spu-plane__form-class-btn']} onClick={this.handleAddClass}>添加分类</span>
    } else {
      return <span className={style['spu-plane__form-class-btn']} onClick={() => this.handleDeleteClass(index)}>删除</span>
    }
  }

  handleDeleteClass (index) {
    const classesSelected = this.props.spu.classesSelected
    classesSelected.splice(index, 1)

    this.props.changeSpu({...this.props.spu, classesSelected})
  }

  showAttributesModal = () => {
    this.setState({
      attributesVisible: true
    })
  }

  handleAttributesCancel = () => {
    this.setState({
      attributesVisible: false
    })
  }

  changeAttributes = (value, id) => {
    const attributes = {...this.state.attributes}
    attributes[id] = value
    this.setState({
      attributes
    })
    // const attributes = [...this.props.spu.attributes]
    // this.props.changeSpu({ ...this.props.spu, attributes: attributes.map(id => find(this.state.attributes, { id })) })
  }

  confirmAttributes = () => {
    const list = []
    console.log(this.state.attributes)
    Object.keys(this.state.attributes).forEach(item => list.push(...this.state.attributes[item]))
    this.setState({
      attributesVisible: false
    })
    this.props.changeSpu({ ...this.props.spu, attributes: list.map(id => find([...this.state.attributeList], { id })) })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      }
    }

    return (
      <div className="spu-plane">
        <Form className="spu-plane__form">
          <FormItem
            {...formItemLayout}
            label="名称">
            {getFieldDecorator('title', {
              rules: [{
                required: true, message: '名称为必填项',
              }],
            })(
              <Input onChange={this.changeName}></Input>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="分类">
            {
              this.props.spu.classesSelected.map((selected, index) => getFieldDecorator('classesSelected', {
                rules: [{
                    required: true, message: '分类为必选项',
                }]
              })(
                <div className={style['spu-plane__form-class']}>
                  <Cascader value={this.props.spu.classesSelected[index]} options={this.state.classes} onChange={(value) => this.changeClass(value, index)}></Cascader>
                  { this.renderClassBtn(index) }
                </div>
              ))
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="属性">
            <Button onClick={this.showAttributesModal}>添加属性</Button>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="上传图片">
            <Upload onChange={this.handleUpload}>
              <Button>点击上传</Button>
            </Upload>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="可见范围">
            <ScopePlane spu={this.props.spu} changeSpu={this.props.changeSpu}></ScopePlane>
          </FormItem>
        </Form>

        <Modal visible={this.state.attributesVisible} title="添加属性" width={800} onCancel={this.handleAttributesCancel} onOk={this.confirmAttributes}>
          <Form>
            {this.state.attrOptions.map((attrOption, index) =>
              <FormItem label={attrOption.name_cn}>
                <CheckboxGroup options={attrOption.children.map(attr => ({ label: attr.name_cn, value: attr.id }))} onChange={value => this.changeAttributes(value, attrOption.id)} />
              </FormItem>
            )}
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(SpuPlane)
