import React, { PureComponent } from 'react'
import { Row, Col, Input, Button } from 'antd'
import style from './index.css'

export default class OfferCard extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      returnVisible: true
    }
  }
  render () {
    return (
      <div className={style['offer-card']}>
        <div className={style['offer-card__header']}>
          <h3>2017年07月06日16:43:02</h3>
        </div>
        <div className={style['offer-card__content']}>
          <Row className={style['offer-card__row']}>
            <Col span={3}>
              供应商编码
            </Col>
            <Col span={9}>
              <Input></Input>
            </Col>
            <Col span={3}>
              报价员
            </Col>
            <Col span={9}>
              <Input></Input>
            </Col>
          </Row>
          <Row className={style['offer-card__row']}>
            <Col span={3}>
              供应商编码
            </Col>
            <Col span={9}>
              <Input></Input>
            </Col>
            <Col span={1}>元</Col>
          </Row>
          <Row className={style['offer-card__row']}>
            <Col span={3}>
              大货预计数量
            </Col>
            <Col span={9}>
              需要  BOM中有三个物料  <Button>放</Button>
            </Col>
          </Row>
          <Row className={style['offer-card__row']}>
            <Col span={3}>
              可预见风险
            </Col>
            <Col span={21}>
              <Input></Input>
            </Col>
          </Row>
          <Row className={style['offer-card__row']}>
            <Col span={3}>
              备注
            </Col>
            <Col span={21}>
              <Input></Input>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
