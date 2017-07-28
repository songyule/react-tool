import React, { PureComponent } from 'react'
import { Card, Input, Radio, Button, Table } from 'antd'
import style from './quo-message.css'
const RadioGroup = Radio.Group
const TextArea = Input
export default class extends PureComponent {
  state = {
    test: '32131312',
    quoMes: {}
  }
  componentWillMount () {
    console.log(this.props.quoMes)
  }
  render () {
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
    const Bom = ({item}) => (
                  <div style={{border: '1px solid #ccc', paddingTop: 10, marginBottom: 10}}>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>BOM行号</p>
                        <Input style={{width: 300}} value={item} disabled></Input>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>名称</p>
                        <Input style={{width: 300}} value='3213213' disabled></Input>
                      </div>
                    </div>
                    <div className={style.row}>
                      <div className={style.row}>
                        <div className={style.col}>
                          <p className={style.lable}>供应商ID</p>
                          <Input style={{width: 300}} value='111' disabled></Input>
                        </div>
                        <div className={style.col}>
                          <p className={style.lable}>包含运费</p>
                          <RadioGroup disabled>
                            <Radio value={1}>包含运费</Radio>
                            <Radio value={2}>不包含运费</Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                    <div className={style.row}>
                      <p className={style.lable}>商品描述</p>
                      <Table style={{width: 800}} pagination={false} columns={columns} key='123'></Table>
                    </div>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>使用数量</p>
                        <Input style={{width: 300}} value='111' disabled></Input>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>数量单位</p>
                        <Input style={{width: 300}} value='111' disabled></Input>
                      </div>
                    </div>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>磨损率</p>
                        <Input style={{width: 300}} value='111' disabled></Input>
                        <span>%</span>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>模具费</p>
                        <Input style={{width: 300}} value='100' disabled></Input>
                        <span>元</span>
                      </div>
                    </div>
                    <div className={style.row}>
                      <div className={style.col}>
                        <p className={style.lable}>预计数量</p>
                        <Input style={{width: 300}} value='111' disabled></Input>
                      </div>
                      <div className={style.col}>
                        <p className={style.lable}>单价</p>
                        <Input style={{width: 300}} value='100' disabled></Input>
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
                      <TextArea rows={4} disabled/>
                    </div>
                  </div>
    )
    return (
      <div>
        <Card className={style.card} title={'这是测试:' + this.state.test}>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>报价员</p>
              <Input style={{width: 300}} value='syl' disabled></Input>
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
              <p className={style.lable}>大货预计数量</p>
              <Input style={{width: 300}} value='111' disabled></Input>
            </div>
            <div className={style.col}>
              <p className={style.lable}>大货预计价格</p>
              <Input style={{width: 300}} value='100' disabled></Input>
              <span>元</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>
              <p className={style.lable}>是否拆分</p>
              <p>需要</p>
              <p>BOM中有三个物料</p>
              <Button>折叠</Button>
            </div>
          </div>
          {
            [1, 2].map((item, index) => {
              return <Bom key={index} item={item}/>
            })
          }
          <div className={style.row}>
            <p className={style.lable}>备注：</p>
            <TextArea rows={4} disabled/>
          </div>
          <div className={style.row}>
            <p className={style.lable}>存在风险</p>
            <TextArea rows={4} disabled/>
          </div>
        </Card>
      </div>
    )
  }
}
