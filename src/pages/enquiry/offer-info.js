import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as samplingActions from 'actions/sampling'
import { Row, Col, Input, Button, Modal, Popconfirm, message } from 'antd'
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

  componentWillMount () {
    this.getInquiryDetail()
  }

  handleToLocal = (obj) => {
    Object.keys(obj).forEach(key => {
      if (key === 'bulk_wear_rate') obj[key] = String(Number(obj[key]) * 100)
      if (key === 'tax_point' && obj[key] !== '') obj[key] = String(Number(obj[key]) * 100)
      if (key === 'valid_deadline' && obj[key] !== '') obj[key] = Number(obj[key]) * 1000
      if (key === 'include_tax' && obj[key] !== '') obj[key] = String(obj[key])
      if (key === 'include_express_fee' && obj[key] !== '') obj[key] = String(obj[key])
      if (key === 'material_offer_arr') {
        obj[key] = obj[key].map(material => this.handleToLocal(material))
      }
    })
    return obj
  }

  getInquiryDetail = async() => {
    const id = this.props.match.params.id
    const res = await getOfferList({ id })
    const inquiry = res.data.inquiry[0]
    const offerObj = this.props.offers
    if (inquiry.offer_arr && inquiry.offer_arr.length) inquiry.offer_arr = inquiry.offer_arr.map(offer => this.handleToLocal(offer))
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
    if (res.code === 200) {
      inquiry.buyer_id = this.props.userLogin.id
      inquiry.status = 1
    }
    this.setState({ inquiry })
  }

  returnOffer = () => {
    const id = this.props.match.params.id
    buyerWithdraw({ id, no_supplier_withdraw_reason: this.state.returnObj.reason }).then(res => {
      if (!(res instanceof Error)) {
        message.success('退回成功')
        this.props.history.push('/main/offer-list')
      } else {
        this.handleCancel()
      }
    })
  }

  handleOfferSelf = (offer) => {
    const saveOffer = {}
    const fieldMapping = ['sampling_price',
                  'bulk_unit_price',
                  'supplier_id',
                  'bulk_wear_rate',
                  'include_express_fee',
                  'bulk_mould_fee',
                  'bulk_examine_fee',
                  'predictable_risk',
                  'comment',
                  'img_url_arr',
                  'material_offer_arr',
                  'valid_deadline',
                  'sampling_unit_price',
                  'minimum_order_quantity',
                  'include_tax',
                  'tax_point']
    Object.keys(offer).forEach(key => {
      const list = ['tax_point', 'valid_deadline', 'include_tax', 'include_express_fee', 'minimum_order_quantity', 'sampling_unit_price']
      if (fieldMapping.indexOf(key) !== -1 && list.indexOf(key) === -1) saveOffer[key] = offer[key]
      if (key === 'bulk_wear_rate') saveOffer[key] = String(Number(saveOffer[key]) / 100)
      if (key === 'tax_point' && offer[key] !== '') saveOffer[key] = String(Number(offer[key]) / 100)
      if (key === 'valid_deadline' && offer[key] !== '') saveOffer[key] = ~~(+new Date(offer[key]) / 1000)
      if (key === 'include_tax' && offer[key] !== '') saveOffer[key] = +offer[key]
      if (key === 'include_express_fee' && offer[key] !== '') saveOffer[key] = +offer[key]
      if (key === 'minimum_order_quantity' && offer[key] !== '') saveOffer[key] = +offer[key]
      if (key === 'sampling_unit_price' && offer[key] !== '') saveOffer[key] = +offer[key]
    })
    return saveOffer
  }

  handleOffer = (offer) => {
    if (offer.material_offer_arr && offer.material_offer_arr.length) offer.material_offer_arr = offer.material_offer_arr.map(material => this.handleMaterial(material))
    const offers = this.handleOfferSelf(offer)
    return offers
  }

  handleMaterial = (material) => {
    const saveMaterial = {}
    const fieldMapping = [
      'include_express_fee',
      'bulk_wear_rate',
      'bulk_mould_fee',
      'bulk_examine_fee',
      'bulk_estimate_amount',
      'bulk_unit_price',
      'supplier_id',
      'comment',
      'material_serial',
      'img_url_arr',
      'valid_deadline',
      'sampling_unit_price',
      'minimum_order_quantity',
      'include_tax',
      'tax_point'
    ]

    Object.keys(material).forEach(key => {
      const list = ['tax_point', 'valid_deadline', 'include_tax', 'include_express_fee', 'minimum_order_quantity', 'sampling_unit_price']
      if (fieldMapping.indexOf(key) !== -1 && list.indexOf(key) === -1) saveMaterial[key] = material[key]
      if (key === 'bulk_wear_rate') saveMaterial[key] = String(Number(saveMaterial[key]) / 100)
      if (key === 'tax_point' && material[key] !== '') saveMaterial[key] = String(Number(material[key]) / 100)
      if (key === 'valid_deadline' && material[key] !== '') saveMaterial[key] = ~~(+new Date(material[key]) / 1000)
      if (key === 'include_tax' && material[key] !== '') saveMaterial[key] = +material[key]
      if (key === 'include_express_fee' && material[key] !== '') saveMaterial[key] = +material[key]
      if (key === 'minimum_order_quantity' && material[key] !== '') saveMaterial[key] = +material[key]
      if (key === 'sampling_unit_price' && material[key] !== '') saveMaterial[key] = +material[key]
    })
    return saveMaterial
  }

  handleSubmit = () => {
    const id = this.props.match.params.id
    let { offer_arr } = this.state.inquiry
    if (!offer_arr.length) return message.warning('必须填写一个报价')
    offer_arr = offer_arr.filter(item => !item.id)
    offer_arr = offer_arr.map(offer => this.handleOffer(offer))
    buyerOffer({ id, offer_arr }).then(res => {
      this.getInquiryDetail()
    })
    this.props.editOffers({ id: '', offers: [] })
  }

  removeOffer = (index) => {
    const id = this.props.match.params.id
    let { offer_arr } = this.state.inquiry
    offer_arr.splice(index, 1)
    this.setState({
      inquiry: {
        ...this.state.inquiry,
        offer_arr
      }
    })
    this.props.editOffers({ id, offers: offer_arr })
  }

  render () {
    const id = this.props.match.params.id
    const inquiry = this.state.inquiry || {}
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
    const isSelfInquiry = inquiry.buyer_id === this.props.userLogin.id

    return (
      <div className="page_offer-info">
        <Title title={`询价工单：${inquiry.id}`}></Title>
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
        <OrderCollapse enquiryMes={inquiry}></OrderCollapse>
        { inquiry.offer_arr && inquiry.offer_arr.map((item, index) => (
          <OfferCard key={index} offer={item} materials={inquiry.material_arr} hasRemove={!item.id} onRemove={() => this.removeOffer(index)}></OfferCard>
        )) }
        { (inquiry.status === 1 || inquiry.status === 3) && isSelfInquiry &&
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
            { (inquiry.status === 1 || inquiry.status === 3) && isSelfInquiry &&
              <Popconfirm title="确认提交工单？" okText="确认" cancelText="取消" onConfirm={this.handleSubmit}>
                <Button className={style['offer-info__button']}>提交工单</Button>
              </Popconfirm>
            }
            { (inquiry.status === 1 || inquiry.status === 3) && isSelfInquiry && <Button className={style['offer-info__button']} onClick={this.showReturn}>退回工单</Button> }
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
