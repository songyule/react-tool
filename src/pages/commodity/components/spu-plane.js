import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity';
import ScopePlane from './scope-plane';
import { Form, Input, Cascader, Button, Modal, Checkbox, Tag } from 'antd'
import MyUpload from 'components/img-upload'
// import arrayToTree from 'array-to-tree'
import { uniqBy } from 'lodash'
import { generateAttrTree, isRepeat } from 'utils'
import PropTypes from 'prop-types'
import style from './spu-plane.css'
import { find, flatten } from 'lodash'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
class SpuPlane extends PureComponent {
  static propTypes = {
    spu: PropTypes.object,
    selecteds: PropTypes.array
  }

  constructor (props) {
    super(props)
    this.state = {
      attributesVisible: false,
      attributes: {},
      fileList: [],
      attributeList: [],
      attrOptions: []
    }
  }

  // getClasses = async () => {
  //   const res = await this.props.getClasses()
  //   let classes = res.data.filter(item => [undefined, 1, 2].indexOf(item.level) > -1)
  //   classes = classes.map(item => {
  //   item = { ...item, value: item.id, label: item.name_cn }
  //   return item
  //   })
  //   classes.forEach(item => {
  //     item.disabled = item.status !== 1
  //   })
  //   const matchClass = classes.filter(item => item.parent_id === -1)[0] || {}
  //   matchClass.parent_id = null
  //   this.setState({
  //     originClasses: classes,
  //     classes: arrayToTree(classes)[0].children
  //   })
  // }

  componentWillMount = () => {
    this.props.getClasses()
    this.calcAttributes()
  }

  changeName = (e) => {
    this.props.changeName(e.target.value)
  }

  getSpuAttributes = async () => {
    await this.props.getGoodsAttributes()
    return this.props.commodityAttributeObj.spuAttributes
  }

  getLinkageAttributes = async () => {
    let list = await this.props.getAttributeList({ class_id: flatten(this.props.spu.classesSelected) })
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
  }

  handleUpload = (fileList) => {
    fileList = fileList || []
    this.setState({ fileList })
    this.props.form.setFieldsValue({ imgList: fileList.map(item => item.response) })
    this.props.changeSpu({ ...this.props.spu, imgList: fileList.map(item => item.response) })
  }

  handleAddClass = () => {
    const classesSelected = this.props.spu.classesSelected
    classesSelected.push([])
    this.props.form.setFieldsValue({ classesSelected: classesSelected })
    this.props.changeClass({classesSelected})
  }

  changeClass = (value, index) => {
    const classesSelected = this.props.spu.classesSelected
    classesSelected[index] = value
    const matchClass = find(this.props.commodityClasses.originClasses, { id: value.slice(-1)[0] })
    this.props.form.setFieldsValue({ classesSelected: classesSelected })
    this.props.changeClass({classesSelected, matchClass}, index)
    this.calcAttributes()
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
    this.props.form.setFieldsValue({ classesSelected: classesSelected })
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
  }

  confirmAttributes = () => {
    const list = []
    Object.keys(this.state.attributes).forEach(item => list.push(...this.state.attributes[item]))
    this.setState({
      attributesVisible: false
    })
    this.props.form.setFieldsValue({ attributes: list.map(id => find([...this.state.attributeList], { id })) })
    this.props.changeSpu({ ...this.props.spu, attributes: list.map(id => find([...this.state.attributeList], { id })) })
  }

  // renderClasses () {
  //   return this.props.spu.classesSelected.map((selected, index) => (
  //     <div className={style['spu-plane__form-class']}>
  //       <Cascader value={this.props.spu.classesSelected[index]} options={this.props.commodityClasses.sortClasses} onChange={(value) => this.changeClass(value, index)}></Cascader>
  //       { this.renderClassBtn(index) }
  //     </div>))
  // }

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
              initialValue: this.props.spu.title,
              rules: [{
                required: true,
                message: '名称为必填项'
              }]
            })(
              <Input onChange={this.changeName} placeholder="请输入商品名称"></Input>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="分类">
            {getFieldDecorator('classesSelected', {
              initialValue: this.props.spu.classesSelected,
              rules: [{
                type: 'array',
                required: true,
                message: '分类为必选项',
                validator: (rule, value, callback) => {
                  if (value.length === 0 || value[0].length === 0) {
                    callback('请选择分类')
                  }
                  callback()
                }
              }, {
                message: '每个分类只可选择一次',
                validator: (rule, value, callback) => {
                  if (isRepeat(value.map(item => JSON.stringify(item)))) {
                    callback('每个分类只可选择一次')
                  }
                  callback()
                }
              }]
            })(
              <div>
                { this.props.spu.classesSelected.map((selected, index) => (
                  <div key={index} className={style['spu-plane__form-class']}>
                    <Cascader value={this.props.spu.classesSelected[index]} options={this.props.commodityClasses.sortClasses} onChange={(value) => this.changeClass(value, index)} placeholder="请选择商品分类"></Cascader>
                    { this.renderClassBtn(index) }
                  </div>)) }
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="属性">
            <div className="spu-plane__attributes-button-row">
              {getFieldDecorator('attributes', {
                initialValue: this.props.spu.classesSelected,
                rules: [{
                  type: 'array',
                  required: true,
                  message: '属性为必选项'
                }]
              })(
                <div className="spu-plane__show-attributes-row">
                  { this.props.spu.attributes.map((item, index) => { return <Tag key={index} color="blue">{`${item.lv1_name_cn}：${item.name_cn}`}</Tag> }) }
                  <Button onClick={this.showAttributesModal}>{this.props.spu.attributes.length === 0 ? '添加属性' : '修改属性'}</Button>
                </div>
              )}
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="上传图片">
              {getFieldDecorator('imgList', {
                initialValue: this.props.spu.imgList,
                rules: [{
                  type: 'array',
                  required: true,
                  message: '至少上传一张图片'
                }]
              })(
                <MyUpload onChange={this.handleUpload} fileList={[...this.state.fileList]}></MyUpload>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="可见范围">
            <ScopePlane selecteds={this.props.selecteds} spu={this.props.spu} changeSpu={this.props.changeSpu} changeSelecteds={this.props.changeSelecteds}></ScopePlane>
          </FormItem>
        </Form>

        <Modal visible={this.state.attributesVisible} title="添加属性" width={800} onCancel={this.handleAttributesCancel} onOk={this.confirmAttributes}>
          <Form>
            {this.state.attrOptions.map((attrOption, index) =>
              <FormItem label={attrOption.name_cn} key={index}>
                <CheckboxGroup options={attrOption.children.map(attr => ({ label: attr.name_cn, value: attr.id }))} onChange={value => this.changeAttributes(value, attrOption.id)} value={this.state.attributes[attrOption.id]}/>
              </FormItem>
            )}
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(SpuPlane)
