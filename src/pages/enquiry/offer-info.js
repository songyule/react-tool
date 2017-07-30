import React, { PureComponent } from 'react'
import { Row, Col, Input, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { getOfferList, buyerWithdraw, claimOffer } from 'actions/sampling'
import Title from 'components/title'
import OfferCard from './components/offer-card'
import style from './offer-info.css'
const [ { TextArea } ] = [ Input ]

export default class OfferInfo extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      returnVisible: false,
      returnObj: {
        reason: ''
      },
      offer: {}
    }
  }

  async componentWillMount () {
    const id = this.props.match.params.id
    const res = await getOfferList({ id })
    const offer = res.data.inquiry[0]

    this.setState({
      offer
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
    const offer = {...this.offer}
    const res = await claimOffer(id)
    if (res.code === 200) offer.status = 1
    this.setState({ offer })
  }

  returnOffer = () => {
    const id = this.props.match.params.id
    buyerWithdraw({ id, no_supplier_withdraw_reason: '测试测试' })
  }

  render () {
    const offer = this.state.offer
    const sku = offer.sku_snapshot || {}
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
    const statusText = statusMapping[offer.status]

    return (
      <div className="page_offer-info">
        <Title title={`询价工单：${this.state.offer.id}`}></Title>
        <Row>
          <Col span="4">商品详情</Col>
          <Col span="20">
            <Row>
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
        <OfferCard></OfferCard>
        <Row>
          <Col span={24} className={style['offer-info__button-operate-header']}>{ statusText }</Col>
          <Col span={24} className={style['offer-info__button-operate']}>
            { offer.status === 0 && <Button className={style['offer-info__button']} onClick={this.handleClaim}>抢</Button> }
            { offer.status === 1 && <Button className={style['offer-info__button']}>提交工单</Button> }
            { offer.status === 1 && <Button className={style['offer-info__button']} onClick={this.showReturn}>退回工单</Button> }
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
            <Col span={21}>{ offer.id }</Col>
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
