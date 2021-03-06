import React, { Component } from 'react'
import { Input, Button, Select, Form, Icon, message } from 'antd'
import { connect } from 'react-redux'
import { find } from 'lodash'
import style from './create-attributes-plane.css'
const Option = Select.Option
const FormItem = Form.Item

@connect(
  state => state
)
class CreateAttributesPlane extends Component {
  addAttribute = () => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes.push({ name: { value: '' }, children: [{ value: '' }] })
    this.props.changeSkuAttributes(skuAttributes)
  }

  removeAttribute = (index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes.splice(index, 1)
    this.props.changeSkuAttributes(skuAttributes)
  }

  changeAttributeName = (e, index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].name.value = e.target.value
    skuAttributes[index].name.changed = true
    this.props.changeSkuAttributes(skuAttributes)
  }

  changeAttributeValue = ({e, index, childIndex}) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].children[childIndex].value = e.target.value
    skuAttributes[index].children[childIndex].changed = true
    this.props.changeSkuAttributes(skuAttributes)
  }

  addAttributeValue = (index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].children.push({ value: '' })
    this.props.changeSkuAttributes(skuAttributes)
  }

  renderSelect = () => {
    const filterAttributes = this.props.commodityAttributeObj.skuAttributes.filter(item => item.name_cn === '商品类型')
    const attributes = filterAttributes[0] ? filterAttributes[0].children : []
    return (attributes.map(attribute => <Option key={attribute.id}>{ attribute.name_cn }</Option>))
  }

  changeTypes = (value) => {
    this.props.form.setFieldsValue({ skuTypes: value })
    this.props.changeTypes(value)
  }

  deleteAttribute = (index, childIndex) => {
    const skuAttributes = [...this.props.skuAttributes]
    if (skuAttributes[index].children.length <= 1) return message.warning('唯一属性值不可删除')
    this.props.deleteAttribute(index, childIndex)
  }

  showGoodsTypes = () => {
    const types = [...new Set(this.props.skuTypes)]
    const attributeTree = this.props.commodityAttributeObj.skuAttributes.filter(item => item.name_cn === '商品类型')
    const typeOptions = (attributeTree[0] || {}).children || []
    // console.log(types.map(type => find(this.props.commodityAttributeObj.skuAttributes, { id: Number(type) })).join(','))
    return types.map(type => (find(typeOptions, { id: Number(type) }) || {}).name_cn || '').join(',')
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <div className={style["create-attributes-plane"]}>
        <div className="ant-col-xs-24 ant-col-sm-5"></div>
        <div className="ant-col-xs-24 ant-col-sm-15">
          <Form className="create-attributes-plane__form">
            { !this.props.inEdit ? <FormItem
              label="">
              {
                getFieldDecorator('skuTypes', {
                  initialValue: this.props.skuTypes,
                  rules: [{
                    type: 'array',
                    required: true,
                    message: '至少选择一个商品类型'
                  }]
                })(
                  <div className={style["attribute-row"]}>
                    <div className="attribute-row__left">
                      商品类型：
                    </div>
                    <div className="attribute-row__right">
                      <Select mode="tags" style={{ width: '500px' }} value={this.props.skuTypes} onChange={this.changeTypes}>{ this.renderSelect() }</Select>
                    </div>
                  </div>
                )
            }
            </FormItem> : <FormItem>
              <div className={style["attribute-row"]}>
                <div className="attribute-row__left">
                  商品类型：
                </div>
                <div className="attribute-row__right">
                  { this.showGoodsTypes() }
                </div>
              </div>
            </FormItem> }
          </Form>
          <Form className="create-attributes-plane__form">
            <FormItem
              label="">
              <div className="create-attributes-plane__attributes">
                <div className={style["attribute-row"]}>
                  <div className={style["attribute-row__left"]}>
                    <span>属性名</span>
                  </div>
                  <div className={style["attribute-row__right"]}>
                    <span>属性值</span>
                  </div>
                </div>
                { this.props.skuAttributes.map((attribute, index) => {
                  return (
                    <div className={style["attribute-row"]} key={index}>
                      <div className={style["attribute-row__left"]}>
                        { this.props.inEdit ? this.props.skuAttributes[index].name.value : <Input onChange={ value => this.changeAttributeName(value, index) } value={this.props.skuAttributes[index].name.value}></Input> }
                      </div>
                      <div className={style["attribute-row__right"]}>
                        { attribute.children.map((item, childIndex) => <Input addonAfter={<div onClick={ e => this.deleteAttribute(index, childIndex) }><Icon type="minus"></Icon></div>} key={childIndex} value={this.props.skuAttributes[index].children[childIndex].value} onChange={ e => this.changeAttributeValue({e, index, childIndex}) }></Input>) }
                        { !this.props.inEdit && <Button onClick={() => this.addAttributeValue(index)}>+</Button> }
                      </div>
                      { index !== 0 && !this.props.inEdit && <Button onClick={() => this.removeAttribute(index)}>-</Button> }
                    </div>
                  )
                }) }
              </div>
            </FormItem>
          </Form>
          { !this.props.inEdit && <Button onClick={this.addAttribute}>+</Button> }
        </div>
      </div>
    )
  }
}

export default Form.create()(CreateAttributesPlane)
