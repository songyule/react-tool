import React, { Component } from 'react'
import { Row, Col } from 'antd'
import SkuItem from './sku-item'
import style from './create-sku-list.css'

class CreateSkuList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="create-sku-list">
        <Row className={style['create-sku-list__head']}>
          <Col span="5">SKU内容</Col>
          <Col span="6">交期</Col>
          <Col span="5">起订量</Col>
          <Col span="5">价格</Col>
          <Col span="3">操作</Col>
        </Row>
        {this.props.skus.map((sku, index) => (
          <div className={style['create-sku-list__item']} key={index}>
            <SkuItem sku={sku} changeEarly={e => this.props.changeEarly(e, index)} changeLatest={e => this.props.changeLatest(e, index)} changeMini={e => this.props.changeMini(e, index)} changePrice={e => this.props.changePrice(e, index)} handleRemove={() => this.props.handleRemove(index)}></SkuItem>
          </div>
        ))}
      </div>
    )
  }
}

export default CreateSkuList
