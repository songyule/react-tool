import React, { PureComponent } from 'react'
import { Card, Input, Radio, Button, Table } from 'antd'
import style from './quo-message.css'
import cs from 'classnames'
import { format } from 'utils'
const RadioGroup = Radio.Group
const TextArea = Input
export default class extends PureComponent {
  state = {
    test: '32131312',
    isBomHide: false,
    quoMes: {}
  }
  isHide = () => {
    this.setState({isBomHide: !this.state.isBomHide})
  }

  findBomMes = (value, filed) => {
    return this.state.material_arr.map(item => {
      if (item.serial === value) {
        return item[filed]
      }
    })
  }
  clickCard = (index) => {
    this.props.callBack(this.state.quoMes)
  }
  componentWillMount () {
    this.setState({quoMes: this.props.quoMes, material_arr: this.props.material_arr})
  }
  componentWillReceiveProps (nextProps) {
    this.setState({borderStyle: nextProps.borderStyle})
  }
  render () {
    const { quoMes } = this.state
    const columns = [{
      title: '属性',
      dataIndex: 'lv1_name_cn',
      key: 'lv1_name_cn',
      width: '200'
    },{
      title: '属性值',
      dataIndex: 'name_cn',
      key: 'name_cn',
    }]
    const Bom = ({bomItem}) => (
                  <div style={{border: '1px solid #ccc', paddingTop: 10, marginBottom: 10}}>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>BOM行号</p>
                        <Input style={{width: 300}} value={bomItem.material_serial} disabled></Input>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>名称</p>
                        <Input style={{width: 300}} value={this.findBomMes(bomItem.material_serial, 'name')} disabled></Input>
                      </div>
                    </div>
                    <div className={style.row}>
                      <div className={style.row}>
                        <div className={style.col}>
                          <p className={style.lable}>供应商ID</p>
                          <Input style={{width: 300}} value={bomItem.material_serial} disabled></Input>
                        </div>
                        <div className={style.col}>
                          <p className={style.lable}>包含运费</p>
                          <RadioGroup disabled value={bomItem.include_express_fee}>
                            <Radio value={1}>包含运费</Radio>
                            <Radio value={2}>不包含运费</Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                    <div className={style.row}>
                      <p className={style.lable}>检测费</p>
                      <Input style={{width: 300}} value={bomItem.bulk_examine_fee} disabled></Input>
                    </div>
                    <div className={style.row}>
                      <p className={style.lable}>商品描述</p>
                      <Table style={{width: 800}} pagination={false} columns={columns} key='123'></Table>
                    </div>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>使用数量</p>
                        <Input style={{width: 300}} value={this.findBomMes(bomItem.material_serial, 'per_bom_amount')} disabled></Input>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>数量单位</p>
                        <Input style={{width: 300}} value={this.findBomMes(bomItem.material_serial, 'unit')} disabled></Input>
                      </div>
                    </div>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>磨损率</p>
                        <Input style={{width: 300}} disabled value={bomItem.bulk_wear_rate}></Input>
                        <span>%</span>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>模具费</p>
                        <Input style={{width: 300}} disabled value={bomItem.bulk_mould_fee}></Input>
                        <span>元</span>
                      </div>
                    </div>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>预计数量</p>
                        <Input style={{width: 300}} disabled value={bomItem.bulk_estimate_amount}></Input>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>单价</p>
                        <Input style={{width: 300}} value={bomItem.bulk_unit_price} disabled></Input>
                        <span>元</span>
                      </div>
                    </div>
                    <div className={style.row}>
                      <p className={style.lable}>品质要求</p>
                      <Input disabled value={this.findBomMes(bomItem.material_serial, 'quality_req')}></Input>
                    </div>
                    <div className={style.row}>
                      <p className={style.lable}>质检要求</p>
                      <Input disabled value={this.findBomMes(bomItem.material_serial, 'quality_testing_req')}></Input>
                    </div>
                    <div className={style.row}>
                      <p className={style.lable}>备注：</p>
                      <TextArea rows={4} disabled value={bomItem.material_serial}/>
                    </div>
                  </div>
    )

    const cardClass = cs({
      [style.card]: true,
      [style.what]: (this.state.quoMes.id === this.state.borderStyle) ? true : false
    })
    return (
      <div>
        <Card className={cardClass} title={format(quoMes.created_at * 1000, 'yyyy-MM-dd HH:mm:ss')} onClick={this.clickCard}>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>报价员</p>
              <Input style={{width: 300}} disabled value={quoMes.buyer_id}></Input>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>打样价格</p>
              <Input style={{width: 300}} disabled value={quoMes.sampling_price}></Input>
              <span>元</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>大货预计数量</p>
              <Input style={{width: 300}} disabled value={quoMes.bulk_estimate_amount}></Input>
            </div>
            <div className={style.col}>
              <p className={style.lable}>大货预计价格</p>
              <Input style={{width: 300}} disabled value={quoMes.bulk_unit_price}></Input>
              <span>元</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>是否拆分</p>
              <p>需要</p>
              <p>BOM中有{quoMes.material_offer_arr.length}个物料</p>
              <Button style={{marginLeft: 10}} onClick={this.isHide}>{this.state.isBomHide ? '折叠' : '展开'}</Button>
            </div>
          </div>
          {
            this.state.isBomHide && quoMes.material_offer_arr.map((bomItem, index) => {
              return <Bom key={index} bomItem={bomItem}/>
            })
          }
          <div className={style.row}>
            <p className={style.lable}>备注：</p>
            <Input type="textarea" rows={4} disabled value={quoMes.comment} autosize/>
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
