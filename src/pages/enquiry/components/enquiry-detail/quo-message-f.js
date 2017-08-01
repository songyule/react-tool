import React, { PureComponent } from 'react'
import { Card, Input, Radio } from 'antd'
import style from './quo-message.css'
import { format } from 'utils'
const RadioGroup = Radio.Group
const TextArea = Input
export default class extends PureComponent {
  state = {
    quoMes: {}
  }
  clickCard = () => {
    console.log(this.state.quoMes)
    this.props.callBack(this.state.quoMes)
  }
  componentWillMount () {
    console.log(this.props.quoMes)
    this.setState({quoMes: this.props.quoMes})
  }
  render () {
    const { quoMes } = this.state
    return (
      <div>
        <Card className={style.card} title={format(quoMes.created_at * 1000, 'yyyy-MM-dd HH:mm:ss')} onClick={this.clickCard}>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>报价员</p>
              <Input style={{width: 300}} value={quoMes.buyer_id} disabled></Input>
            </div>
            <div className={style.col}>
              <p className={style.lable}>供应商ID</p>
              <Input style={{width: 300}} value={quoMes.supplier_id} disabled></Input>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>打样价格</p>
              <Input style={{width: 300}} value='100' disabled></Input>
              <span>元</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>是否拆分</p>
              <p>不需要</p>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>数量单位</p>
              <Input style={{width: 300}} value='111' disabled></Input>
            </div>
            <div className={style.col}>
              <p className={style.lable}>包含运费</p>
              <RadioGroup disabled value={quoMes && quoMes.include_express_fee}>
                <Radio value={1}>包含运费</Radio>
                <Radio value={0}>不包含运费</Radio>
              </RadioGroup>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>大货预计数量</p>
              <Input style={{width: 300}} disabled value={quoMes.bulk_estimate_amount}></Input>
            </div>
            <div className={style.col}>
              <p className={style.lable}>大货预计价格</p>
              <Input style={{width: 300}} value={quoMes.bulk_unit_price} disabled></Input>
              <span>元</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>磨损率</p>
              <Input style={{width: 300}} value={quoMes.bulk_wear_rate * 1000} disabled ></Input>
              <span>%</span>
            </div>
            <div className={style.col}>
              <p className={style.lable}>模具费</p>
              <Input style={{width: 300}} value={quoMes.bulk_mould_fee} disabled  ></Input>
              <span>元</span>
            </div>
          </div>
          <div className={style.row}>
            <p className={style.lable}>品质要求</p>
            <Input value='111' disabled></Input>
          </div>
          <div className={style.row}>
            <p className={style.lable}>质检要求</p>
            <Input value='111' disabled></Input>
          </div>
          <div className={style.row}>
            <p className={style.lable}>备注：</p>
            <TextArea rows={4} disabled value={quoMes.comment}/>
          </div>
          <div className={style.row}>
            <p className={style.lable}>存在风险</p>
            <TextArea rows={4} disabled value={quoMes.predictable_risk}/>
          </div>
        </Card>
      </div>
    )
  }
}
