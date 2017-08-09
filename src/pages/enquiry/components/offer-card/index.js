import React, { PureComponent } from 'react'
import { Row, Col, Input, Icon, Radio, DatePicker } from 'antd'
import BomCollapse from '../bom-collapse'
import style from './index.css'
import { format } from 'utils'
import { find } from 'lodash'
import moment from 'moment'
const [ TextArea, RadioGroup ] = [ Input.TextArea, Radio.Group ]

export default class OfferCard extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      returnVisible: true
    }
  }

  render () {
    const { offer, materials } = this.props
    const supplierValue = materials.length ? offer.material_offer_arr.map(offer => offer.supplier_id).join(',') : offer.supplier_id
    if (materials.length) {
      offer.material_offer_arr = offer.material_offer_arr.map(item => {
        const matchMaterial = find(materials, { serial: item.material_serial })
        return {...item, ...matchMaterial}
      })
    }

    return (
      <div className={style['offer-card']}>
        <div className={style['offer-card__header']}>
          <h3>{ offer.created_at ? format(offer.created_at * 1000, 'yyyy年MM月dd日HH:mm:ss') : '未保存' }</h3>
          { this.props.hasRemove && <Icon className={style['offer-card__close']} type="close-circle" onClick={this.props.onRemove} /> }
        </div>
        <div className={style['offer-card__content']}>
          { (offer.img_url_arr && offer.img_url_arr.length) ?
            <Row gutter={32} className={style['offer-card__row']}>
              <Col span={3}>图片</Col>
              <Col span={21}>
                <div className={style['offer-card__image-field']}>
                  { offer.img_url_arr.map((image, index) =>
                    <div className={style['offer-card__image-box']} key={index}>
                      <img src={image} alt=""/>
                    </div>
                  ) }
                </div>
              </Col>
            </Row> : null
          }
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              供应商编码
            </Col>
            <Col span={9}>
              <Input disabled value={ supplierValue }></Input>
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
              报价有效期
            </Col>
            <Col span={9}>
              { offer.valid_deadline ? <DatePicker disabled defaultValue={moment(offer.valid_deadline)}></DatePicker> : '无' }
            </Col>
            <Col span={3}>
              打样单价
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.sampling_unit_price }></Input>
            </Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              起订量
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.minimum_order_quantity }></Input>
            </Col>
            <Col span={3}>
              是否含税
            </Col>
            <Col span={9}>
              <RadioGroup disabled value={offer.include_tax}>
                <Radio value="1"> 包含税费 </Radio>
                <Radio value="0"> 不包含税费 </Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              开票加点
            </Col>
            <Col span={9}>
              <Input disabled value={ offer.tax_point }></Input>
            </Col>
          </Row>
          <Row gutter={32} className={style['offer-card__row']}>
            <Col span={3}>
              是否需要拆分
            </Col>
            <Col span={21}>
              { materials.length ?
                <div>
                  需要  BOM中有{ materials.length }个物料
                  <BomCollapse materials={offer.material_offer_arr}></BomCollapse>
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
              <TextArea rows={4} disabled value={ offer.comment }></TextArea>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
