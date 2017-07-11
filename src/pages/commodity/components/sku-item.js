import React, { Component } from 'react'
import { Button, Input, Row, Col } from 'antd'
import style from './sku-item.css'

class SkuItem extends Component {

  showAttributes (attributes) {
    return Object.keys(attributes).map(key => `${attributes[key].lv2_name_cn}:${attributes[key].name_cn}`).join(',')
  }

  render () {
    return (
      <Row className="sku-item">
        <Col span="5">
          { this.showAttributes(this.props.sku.attributes) },商品类型:{this.props.sku.type.name_cn}
        </Col>
        <Col span="6">
          <Row>
            <Col className={style['sku-item__col-padding']} span="12">
              <Input value={this.props.sku.earlyDate} onChange={this.props.changeEarly}></Input>
            </Col>
            <Col className={style['sku-item__col-padding']} span="12">
              <Input value={this.props.sku.latestDate} onChange={this.props.changeLatest}></Input>
            </Col>
          </Row>
        </Col>
        <Col className={style['sku-item__col-padding']} span="5">
          <Input value={this.props.sku.miniQuantity} onChange={this.props.changeMini}></Input>
        </Col>
        <Col className={style['sku-item__col-padding']} span="5">
          <Input value={this.props.sku.price} onChange={this.props.changePrice}></Input>
        </Col>
        <Col className={style['sku-item__col-padding']} span="3">
          <Button onClick={this.props.handleRemove}>删除</Button>
        </Col>
      </Row>
    )
  }
}

export default SkuItem
