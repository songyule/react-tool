import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Cascader, Icon, Tag } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity'
import AttributesPlane from './attributes-plane'
import './bom-card.css'
import arrayToTree from 'array-to-tree'
import { uniqBy, find, groupBy } from 'lodash'
const FormItem = Form.Item

@Form.create()
@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
export default class extends PureComponent {
  constructor () {
    super()

    this.state = {
      // attributesObj: {},
      attrOptions: [],
      attributeList: []
    }
  }

  changeClass = (value) => {
    this.setState({
      bom: {
        ...this.props.bom,
        classesSelected: value
      }
    })
    this.calcAttributes()
  }

  getSpuAttributes = async () => {
    await this.props.getGoodsAttributes()
    return this.props.commodityAttributeObj.spuAttributes
  }

  getLinkageAttributes = async () => {
    const params = {}
    if (this.props.bom.classesSelected.length) params.class_id = this.props.bom.classesSelected
    let list = await this.props.getAttributeList(params)
    return list.data
  }

  componentWillMount () {
    this.calcAttributes()
  }

  async calcAttributes () {
    const spuAttributes = await this.getSpuAttributes()
    const linkageAttributes = await this.getLinkageAttributes()
    const existAttrs = []
    const attributesObj = {}
    let attributeList = uniqBy([...linkageAttributes, ...spuAttributes], 'id')
    attributeList = attributeList.filter(item => item.level === 1 || item.level === 2)
    attributeList = attributeList.map(item => ({ ...item, value: item.id, label: item.name_cn }))
    const attrOptions = arrayToTree(attributeList)

    attrOptions.forEach(attr => {
      const matchAttrs = this.props.bom.attributes.filter(item => item.lv1_id === attr.id)
      attributesObj[attr.id] = matchAttrs.map(item => item.id)
      existAttrs.push(...matchAttrs)
    })
    this.setState({
      // attributesObj,
      attrOptions,
      attributeList
    })
    this.props.changeBom({ attributes: existAttrs, attributesObj })
  }


  changeAttributes = (value, id) => {
    const attributesObj = {...this.props.bom.attributesObj}
    attributesObj[id] = value
    // this.setState({
    //   attributesObj
    // })
    const list = []
    Object.keys(groupBy(this.state.attributeList, 'lv1_id')).forEach(item => list.push(...(attributesObj[item] || [])))
    this.props.form.setFieldsValue({ attributes: value })
    this.props.changeBom({ attributes: list.map(id => find([...this.state.attributeList], { id })), attributesObj })
  }

  render () {
    const changeBom = this.props.changeBom
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const rowFormItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }
    const { getFieldDecorator } = this.props.form

    return (
      <div className="bom-card">
        { this.props.onRemove && <Icon className="bom-card__close" type="close-circle" onClick={this.props.onRemove} /> }
        <Form className="bom-card__form">
          <Row gutter={40}>
            <Col span={12}>
              <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('name', { rules: [{ required: true, message: '请输入名称' }], initialValue: this.props.bom.name })(
                  <Input placeholder="placeholder" onChange={e => changeBom({ name: e.target.value })} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="类目">
                {getFieldDecorator('classesSelected', { rules: [{ required: true, message: '请选择类目' }], initialValue: this.props.bom.classesSelected })(
                  <Cascader options={this.props.commodityClasses.sortClasses} onChange={value => changeBom({ classesSelected: value })} placeholder="请选择商品分类"></Cascader>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...rowFormItemLayout} label="商品描述">
                {getFieldDecorator('attributes', { rules: [{ required: true, message: '请选择描述' }], initialValue: this.props.bom.attributes })(
                  <div>
                   { this.props.bom.attributes.map((item, index) => { return <Tag key={index} color="blue">{`${item.lv1_name_cn}：${item.name_cn}`}</Tag> }) }
                  </div>
                )}
              </FormItem>
              <AttributesPlane attrOptions={this.state.attrOptions} attributesObj={this.props.bom.attributesObj} changeAttributes={this.changeAttributes}></AttributesPlane>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="使用数量">
                {getFieldDecorator('amount', { rules: [{ required: true, message: '请填写使用数量' }, { pattern: /^\d+(\.\d+)?$/, message: '必须为数字' }], initialValue: this.props.bom.amount })(
                  <Input placeholder="placeholder" onChange={e => changeBom({ amount: e.target.value })} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="数量单位">
                {getFieldDecorator('unit', { rules: [{ required: true, message: '请填写数量单位' }], initialValue: this.props.bom.unit })(
                  <Input placeholder="placeholder" onChange={e => changeBom({ unit: e.target.value })} />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...rowFormItemLayout} label="品质要求">
                {getFieldDecorator('quality_req', { rules: [{ required: true, message: '请填写品质要求' }], initialValue: this.props.bom.quality_req })(
                  <Input placeholder="placeholder" onChange={e => changeBom({ quality_req: e.target.value })} />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...rowFormItemLayout} label="质检要求">
                {getFieldDecorator('quality_testing_req', { rules: [{ required: true, message: '请填写质检要求' }], initialValue: this.props.bom.quality_testing_req })(
                  <Input placeholder="placeholder" onChange={e => changeBom({ quality_testing_req: e.target.value })} />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
