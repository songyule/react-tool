import React, { Component } from 'react'
import { Input, Button, Select } from 'antd'
import { connect } from 'react-redux'
import style from './create-attributes-plane.css'
const Option = Select.Option

@connect(
  state => state
)
class AttributesPlane extends Component {
  constructor (props) {
    super(props)
  }

  addAttribute = () => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes.push({ name: '', value: [''] })
    this.props.changeSkuAttributes(skuAttributes)
  }

  removeAttribute = (index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes.splice(index, 1)
    this.props.changeSkuAttributes(skuAttributes)
  }

  changeAttributeName = (e, index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].name = e.target.value
    this.props.changeSkuAttributes(skuAttributes)
  }

  changeAttributeValue = ({e, index, childIndex}) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].value[childIndex] = e.target.value
    this.props.changeSkuAttributes(skuAttributes)
  }

  addAttributeValue = (index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].value.push('')
    this.props.changeSkuAttributes(skuAttributes)
  }

  renderSelect () {
    const filterAttributes = this.props.commodityAttributeObj.skuAttributes.filter(item => item.name_cn === '商品类型')
    const attributes = filterAttributes[0] ? filterAttributes[0].children : []
    return (attributes.map(attribute => <Option key={attribute.id}>{ attribute.name_cn }</Option>))
  }

  render () {
    return (
      <div className={style["create-attributes-plane"]}>
        <div className="attribute-row">
          <div className="attribute-row__left">
            商品类型：
          </div>
          <div className="attribute-row__right">
            <Select mode="tags" style={{ width: '200px' }} value={this.props.skuTypes} onChange={ value => this.props.changeTypes(value) }>{ this.renderSelect() }</Select>
          </div>
        </div>
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
            <div className={style["attribute-row"]}>
              <div className={style["attribute-row__left"]}>
                <Input onChange={ value => this.changeAttributeName(value, index) } value={this.props.skuAttributes[index].name}></Input>
              </div>
              <div className={style["attribute-row__right"]}>
                { attribute.value.map((item, childIndex) => <Input onChange={ e => this.changeAttributeValue({e, index, childIndex}) } value={this.props.skuAttributes[index].value[childIndex]}></Input>) }
                <Button onClick={() => this.addAttributeValue(index)}>+</Button>
              </div>
              { index !== 0 && <Button onClick={() => this.removeAttribute(index)}>-</Button> }
            </div>
          )
        }) }
        <Button onClick={this.addAttribute}>+</Button>
      </div>
    )
  }
}

export default AttributesPlane