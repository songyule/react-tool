import React, { Component } from 'react'
import { Input, Button } from 'antd'
import style from './create-attributes-plane.css'

class AttributesPlane extends Component {
  constructor (props) {
    super(props)
  }

  addAttribute = () => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes.push({ name: '', value: '' })
    this.props.changeSkuAttributes(skuAttributes)
  }

  changeAttributeName = (e, index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].name = e.target.value
    this.props.changeSkuAttributes(skuAttributes)
  }

  changeAttributeValue = (e, index) => {
    const skuAttributes = [...this.props.skuAttributes]
    skuAttributes[index].value = e.target.value
    this.props.changeSkuAttributes(skuAttributes)
  }

  render () {
    return (
      <div className={style["create-attributes-plane"]}>
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
                <Input onChange={ value => this.changeAttributeName(value, index) }></Input>
              </div>
              <div className={style["attribute-row__right"]}>
                <Input onChange={ value => this.changeAttributeValue(value, index) }></Input>
              </div>
              {() => { if (index !== 0) return <Button>-</Button> }}
            </div>
          )
        }) }
        <Button onClick={this.addAttribute}>+</Button>
      </div>
    )
  }
}

export default AttributesPlane
