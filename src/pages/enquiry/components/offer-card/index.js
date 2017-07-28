import React, { PureComponent } from 'react'
import { Row, Col, Input, Button, Modal } from 'antd'
import { getOfferList } from 'actions/sampling'
import Title from 'components/title'
const [ { TextArea } ] = [ Input ]

export default class OfferCard extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      returnVisible: true,
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

  render () {
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
        <Row>
          <Col span={24}>待认领</Col>
          <Col span={24}>
            <Button>抢</Button>
            <Button>返回</Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>报价中</Col>
          <Col span={24}>
            <Button>提交工单</Button>
            <Button>退回工单</Button>
            <Button>返回</Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>已完成</Col>
          <Col span={24}>
            <Button>返回</Button>
          </Col>
        </Row>

        <Modal
          visible={this.state.returnVisible}
          title="确认"
          okText="确认退回"
          cancelText="取消退回">
          <Row>
            <Col span={3}>工单号：</Col>
            <Col span={21}>{ offer.id }</Col>
          </Row>
          <Row>
            <Col span={3}>退回原因：</Col>
          </Row>
          <Row>
            <TextArea rows={4}></TextArea>
          </Row>
        </Modal>
      </div>
    )
  }
}
