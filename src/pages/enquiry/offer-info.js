import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as samplingActions from 'actions/sampling'
import { Row, Col, Input, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { getOfferList, buyerWithdraw, claimOffer, buyerOffer } from 'actions/sampling'
import Title from 'components/title'
import OfferCard from './components/offer-card'
import OrderCollapse from './components/order-collapse'
import style from './offer-info.css'
const [ { TextArea } ] = [ Input ]

@connect(
  state => state,
  dispatch => bindActionCreators({ ...samplingActions }, dispatch)
)
export default class OfferInfo extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      returnVisible: false,
      returnObj: {
        reason: ''
      },
      inquiry: {}
    }
  }

  async componentWillMount () {
    const id = this.props.match.params.id
    const res = await getOfferList({ id })
    const inquiry = res.data.inquiry[0]
    const offerObj = this.props.offers
    if (offerObj.id === id) inquiry.offer_arr = [...inquiry.offer_arr, ...offerObj.list]

    this.setState({
      inquiry
    })
  }

  handleCancel = () => {
    this.setState({
      returnVisible: false
    })
  }

  showReturn = () => {
    this.setState({
      returnVisible: true
    })
  }

  changeReason = (e) => {
    const returnObj = {...this.state.returnObj}
    returnObj.reason = e.target.value
    this.setState({
      returnObj
    })
  }

  handleClaim = async () => {
    const id = this.props.match.params.id
    const inquiry = {...this.inquiry}
    const res = await claimOffer(id)
    if (res.code === 200) inquiry.status = 1
    this.setState({ inquiry })
  }

  returnOffer = () => {
    const id = this.props.match.params.id
    buyerWithdraw({ id, no_supplier_withdraw_reason: this.state.returnObj.reason })
  }

  handleSubmit = () => {
    const id = this.props.match.params.id
    buyerOffer({ id, offer_arr: this.state.inquiry.offer_arr })
    this.props.saveOffer({ id: '', offer: [] })
  }

  render () {
    const id = this.props.match.params.id
    const inquiry = this.state.inquiry
    const sku = inquiry.sku_snapshot || {}
    const classes = (sku.spu && sku.spu.commodity_class) || []
    const statusMapping = {
      0: '待认领',
      1: '报价中',
      2: '已完成',
      3: '销售退回报价',
      4: '采购有报价提供',
      [-1]: '销售关闭了询价单',
      [-2]: '采购退回询价单'
    }
    const statusText = statusMapping[inquiry.status]

    return (
      <div className="page_offer-info">
        <Title title={`询价工单：${this.state.inquiry.id}`}></Title>
        <Row gutter={32} className={style['offer-info__row']}>
          <Col span="2">商品详情</Col>
          <Col span="22">
            <Row gutter={32}>
              <Col span="2">商品名称</Col>
              <Col span="10">
                <Input disabled value={sku.spu_name_cn}></Input>
              </Col>
              <Col span="2">类目</Col>
              <Col span="10">
                <Input disabled value={classes.map(item => item.name_cn).join(',')}></Input>
              </Col>
            </Row>
          </Col>
        </Row>
        <OrderCollapse></OrderCollapse>
        { this.state.inquiry.offer_arr && this.state.inquiry.offer_arr.map(item => (
          <OfferCard offer={item}></OfferCard>
        )) }
        { this.state.inquiry.status === 1 &&
          <Row className={style['offer-info__row']}>
            <Link to={`/main/create-offer/${id}`}>
              <Button type="primary">新增报价</Button>
            </Link>
          </Row>
        }
        <Row className={style['offer-info__row']}>
          <Col span={24} className={style['offer-info__button-operate-header']}>{ statusText }</Col>
        </Row>
        <Row className={style['offer-info__row']}>
          <Col span={24} className={style['offer-info__button-operate']}>
            { inquiry.status === 0 && <Button className={style['offer-info__button']} onClick={this.handleClaim}>抢</Button> }
            { inquiry.status === 1 && <Button className={style['offer-info__button']} onClick={this.handleSubmit}>提交工单</Button> }
            { inquiry.status === 1 && <Button className={style['offer-info__button']} onClick={this.showReturn}>退回工单</Button> }
            <Link to="/main/offer-list">
              <Button>返回</Button>
            </Link>
          </Col>
        </Row>

        <Modal
          visible={this.state.returnVisible}
          title="确认"
          okText="确认退回"
          cancelText="取消退回"
          onOk={this.returnOffer}
          onCancel={this.handleCancel}>
          <Row>
            <Col span={3}>工单号：</Col>
            <Col span={21}>{ inquiry.id }</Col>
          </Row>
          <Row>
            <Col span={3}>退回原因：</Col>
          </Row>
          <Row>
            <TextArea rows={4} value={this.state.returnObj.reason} onChange={this.changeReason}></TextArea>
          </Row>
        </Modal>
      </div>
    )
  }
}
