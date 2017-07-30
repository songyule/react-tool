import React, { PureComponent } from 'react'
import { Row, Col, Checkbox } from 'antd'
import style from './attributes-plane.css'
const CheckboxGroup = Checkbox.Group
// import style from './spu-list.css'

class AttributesPlane extends PureComponent {
  render () {
    return (
      <div className={style['attributes-plane']}>
        {this.props.attrOptions.map((attrOption, index) =>
          <Row className={style['attributes-plane__row']}>
            <Col span={4}>{ attrOption.name_cn }:</Col>
            <Col span={20}>
              <CheckboxGroup options={attrOption.children.map(attr => ({ label: attr.name_cn, value: attr.id }))} onChange={value => this.props.changeAttributes(value, attrOption.id)} value={this.props.attributesObj[attrOption.id]}/>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default AttributesPlane
