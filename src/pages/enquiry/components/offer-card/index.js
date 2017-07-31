import React, { PureComponent } from 'react'
import { Row, Col, Input, Button } from 'antd'
import BomCollapse from '../bom-collapse'
import style from './index.css'
import { format } from 'utils'

export default class OfferCard extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      returnVisible: true
    }
  }
  render () {
    const offer = this.props.offer
    console.log(offer)
    return (
      <div className={style['offer-card']}>
        <div className={style['offer-card__header']}>
          <h3>{ format(offer.created_at * 1000, 'yyyy年MM月dd日HH:mm:ss') }</h3>
        </div>
        <div className={style['offer-card__content']}>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              供应商编码
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.supplier_id }></Input>
            </Col>
            <Col span={3}>
              报价员
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.buyer_id }></Input>
            </Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              打样价格
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.sampling_price }></Input>
            </Col>
            <Col span={1}>元</Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              大货预计数量
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.bulk_estimate_amount }></Input>
            </Col>
            <Col span={3}>
              大货预计价格
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.bulk_unit_price }></Input>
            </Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              是否需要拆分
            </Col>
            <Col span={21}>
              { offer.material_offer_arr.length ?
                <div>
                  需要  BOM中有{ offer.material_offer_arr.length }个物料
                  <BomCollapse material={offer.material_offer_arr[0]}></BomCollapse>
                </div> : '不需要' }
            </Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              可预见风险
            </Col>
            <Col span={21}>
              <Input disabled value={ offer.predictable_risk }></Input>
            </Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              备注
            </Col>
            <Col span={21}>
              { /* 无返回 */ }
              <Input disabled value={ offer.comment }></Input>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
