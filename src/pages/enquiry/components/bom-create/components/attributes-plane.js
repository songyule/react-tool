import React, { PureComponent } from 'react'
import { Row, Col, Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group
// import style from './spu-list.css'

class SkuList extends PureComponent {
  render () {
    return (
      <div className="attributes-plane">
        {this.props.attrOptions.map((attrOption, index) =>
          <Row>
            <Col span={4}>{ attrOption.name_cn }</Col>
            <Col span={20}>
              <CheckboxGroup options={attrOption.children.map(attr => ({ label: attr.name_cn, value: attr.id }))} onChange={value => this.props.changeAttributes(value, attrOption.id)} value={this.props.attributesObj[attrOption.id]}/>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default SkuList
