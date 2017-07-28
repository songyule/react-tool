import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Cascader, Icon, Tag } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity'
import AttributesPlane from './attributes-plane'
import './bom-card.css'
import arrayToTree from 'array-to-tree'
import { uniqBy, find } from 'lodash'
const FormItem = Form.Item

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
export default class extends PureComponent {
  constructor () {
    super()

    this.state = {
      attributesObj: {},
      attrOptions: [],
      attributeList: []
    }
  }

  changeClass = (value) => {
    this.setState({
      bom: {
        ...this.state.bom,
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
    let list = await this.props.getAttributeList({ class_id: this.props.bom.classesSelected })
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
      attributesObj,
      attrOptions,
      attributeList
    })
    this.props.changeBom({ attributes: existAttrs })
  }

  selectAttributes = () => {}

  changeAttributes = (value, id) => {
    const attributesObj = {...this.state.attributesObj}
    attributesObj[id] = value
    this.setState({
      attributesObj
    })
    const list = []
    Object.keys(attributesObj).forEach(item => list.push(...attributesObj[item]))
    this.props.changeBom({ attributes: list.map(id => find([...this.state.attributeList], { id })) })
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

    return (
      <div className="bom-card">
        { this.props.onRemove && <Icon className="bom-card__close" type="close-circle" onClick={this.props.onRemove} /> }
        <Form className="bom-card__form">
          <Row gutter={40}>
            <Col span={12}>
              <FormItem {...formItemLayout} label="名称">
                <Input placeholder="placeholder" value={this.props.bom.name} onChange={e => changeBom({ name: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="类目">
                <Cascader value={this.props.bom.classesSelected} options={this.props.commodityClasses.sortClasses} onChange={value => changeBom({ classesSelected: value })} placeholder="请选择商品分类"></Cascader>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...rowFormItemLayout} label="商品描述">
                { this.props.bom.attributes.map((item, index) => { return <Tag key={index} color="blue">{`${item.lv1_name_cn}：${item.name_cn}`}</Tag> }) }
              </FormItem>
              <AttributesPlane attrOptions={this.state.attrOptions} attributesObj={this.state.attributesObj} changeAttributes={this.changeAttributes}></AttributesPlane>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="使用数量">
                <Input placeholder="placeholder" value={this.props.bom.amount} onChange={e => changeBom({ amount: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="数量单位">
                <Input placeholder="placeholder" value={this.props.bom.unit} onChange={e => changeBom({ unit: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...rowFormItemLayout} label="品质要求">
                <Input placeholder="placeholder" value={this.props.bom.quality_req} onChange={e => changeBom({ quality_req: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...rowFormItemLayout} label="质检要求">
                <Input placeholder="placeholder" value={this.props.bom.quality_testing_req} onChange={e => changeBom({ quality_testing_req: e.target.value })} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
