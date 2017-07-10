import React, { Component } from 'react'
import { Button, Input, Row, Col } from 'antd'

class SkuItem extends Component {
  constructor (props) {
    super(props)
  }

  showAttributes (attributes) {
    return Object.keys(attributes).map(key => `${attributes[key].lv2_name_cn ? attributes[key].lv2_name_cn : '商品类型'}:${attributes[key].name_cn}`).join(',')
  }

  render () {
    return (
      <Row className="sku-item">
        <Col span="4">
          { this.showAttributes(this.props.sku.attributes) }
        </Col>
        <Col span="5">
          <Row>
            <Col span="12">
              <Input onChange={this.props.changeEarly}></Input>
            </Col>
            <Col span="12">
              <Input onChange={this.props.changeLatest}></Input>
            </Col>
          </Row>
        </Col>
        <Col span="5">
          <Input onChange={this.props.changeMini}></Input>
        </Col>
        <Col span="5">
          <Input onChange={this.props.changePrice}></Input>
        </Col>
        <Col span="5">
          <Button onClick={this.props.handleRemove}>删除</Button>
        </Col>
      </Row>
    )
  }
}

export default SkuItem
