import React, { PureComponent } from 'react'
import { Input, Radio, Button, Table, Form, Select } from 'antd'
import Title from 'components/title'
import style from '../../css/new-enquiry.css'
import { getClass } from 'actions/commodity'
import { creatSampling } from 'actions/sampling'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option

class newEnquiry extends PureComponent {
  state = {
    defaultSource: true,
    skuData: [],
    spuData: [],
    isType: '',
    isMaterial: true,
    reqNumber: '',
    lv1ClassArr: [],
    reqMes: {
      img_url_arr: []
    },
    selectSku: {}
  }

  onChangeType = (e) => { // 选择商品类型
    this.setState({
      isType: e.target.value
    })
  }

  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      let arr = []
      values.img.map(item => {
        arr.push(item.response)
        return arr
      })
      values.img = arr
      if (this.state.isType !== 3) values.custom_commodity_class_id = 0
      creatSampling(values).then(res => {
        console.log(res)
      })
    })
  }
  getLv1Class () {
    getClass({level: 1}).then(res => {
      this.setState({lv1ClassArr: res.data})
    })
    console.log(this.props)
  }
  classify (val) {
    if (!val) return
    let classArr = []
    val.map(item => {
      return classArr.push(item.name_cn)
    })
    return classArr.join(',')
  }
  history = (e) => {
    console.log(e)
    this.setState({reqMes: this.state.reqMes.snapshot_arr[e]}, () => {
      console.log(this.state.reqMes)
    })
  }
  componentWillMount() {
    this.getLv1Class()
  }
  componentWillReceiveProps (nextProps) {
    console.log(nextProps.enquiryMes)
    this.setState({
      reqMes: nextProps.enquiryMes,
      skuData: nextProps.enquiryMes.sku_snapshot.attribute,
      spuData: nextProps.enquiryMes.sku_snapshot.spu.commodity_attribute,
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { reqMes } = this.state
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
    const goodsReq = [
      {
        name: '颜色要求',
        filed: 'color_req',
        getFiled: 'color'
      },
      {
        name: '尺寸要求',
        filed: 'size_req',
        getFiled: 'size'
      },
      {
        name: '形状要求',
        filed: 'shape_req',
        getFiled: 'shape'
      },
      {
        name: '材质要求',
        filed: 'material_req',
        getFiled: 'material'
      },
      {
        name: '品质要求',
        filed: 'quality_req',
        getFiled: ''
      },
      {
        name: '质检要求',
        filed: 'quality_testing_req',
        getFiled: ''
      }
    ]
    return (
      <div className={style.newContent}>
        <Title title={'询价单详情: ' + reqMes.id}>
          {
            (reqMes.snapshot_arr && reqMes.snapshot_arr.length) && ( <Select style={{width: 120}} defaultValue='历史版本' onChange={this.history}>
                                                                        {
                                                                          reqMes.snapshot_arr.map((item, index) => {
                                                                            return (<Option  key={index} value={index}>{item.updated_at}</Option>)
                                                                          })
                                                                        }
                                                                      </Select>)
          }
        </Title>
        <Form>
          <FormItem
            label="数据来源"
            className={style.tier}
          >
            <div>
              <RadioGroup value={reqMes.sampling_id ? true : false} disabled>
                <Radio value={true}>需求单</Radio>
                <Radio value={false}>其他来源</Radio>
              </RadioGroup>
              {
                reqMes.sampling_id && <div className={style.flex}>
                                      <p>需求单号：{reqMes.sampling_id}</p>
                                    </div>
              }
            </div>
          </FormItem>
          <FormItem
            label="客户情况"
            className={style.tier}
          >
            <div>
              <div className={style.flex}>
                <FormItem label="客户简称">
                  {getFieldDecorator('name_cn', {
                    initialValue: (reqMes.client_org && reqMes.client_org.name_cn) || ''
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="客户编码">
                  {getFieldDecorator('sn', {
                    initialValue: (reqMes.client_org && 'SN' + reqMes.client_org.sn) || ''
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="客户级别">
                  {getFieldDecorator('level', {
                    initialValue: '' || (reqMes.client_org && reqMes.client_org.client_level && reqMes.client_org.client_level.name)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="提交人">
                  {getFieldDecorator('name', {
                    initialValue: '' || (reqMes.client_org && reqMes.client_org.client_source && reqMes.client_org.client_source.name)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem label="商品类型" className={style.tier}>
            {getFieldDecorator('sampling_type', {
              initialValue: (reqMes && reqMes.sampling_type) || 0
            })(
              <RadioGroup onChange={this.onChangeType} disabled>
                <Radio value={0}>原版</Radio>
                <Radio value={1}>改版</Radio>
                <Radio value={2}>定制</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="商品详情" className={style.tier}>
            <div className={style.flex}>
              <FormItem label="商品名称">
                {getFieldDecorator('custom_commodity_name', {
                  initialValue: (reqMes.sku_snapshot && reqMes.sku_snapshot.spu_name_cn) || ''
                })(
                  <Input disabled className={style.inputTitle}></Input>
                )}
              </FormItem>
              <FormItem label="类目">
                {getFieldDecorator('custom_commodity_class_id', {
                  initialValue: (reqMes && reqMes.classify) || ''
                })(
                  <Select className={style.inputTitle} disabled>
                    {
                      this.state.lv1ClassArr.map((item, index) => {
                        return (<Option  key={index} value={item.lv1_id.toString()}>{item.name_cn}</Option>)
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </div>
            {
              this.state.isType !== 3 &&  <div>
                                              <FormItem label="SKUID" className={style.mBottom}>
                                                {getFieldDecorator('sku_id', {
                                                  initialValue: (reqMes.sku_snapshot && reqMes.sku_snapshot.id) || ''
                                                })(
                                                    <Input className={style.inputTitle} disabled></Input>
                                                )}
                                                <Button type="primary" style={{marginLeft: 10, display: 'none'}} onClick={this.showGoodsSelect}>选择商品</Button>
                                              </FormItem>
                                              <FormItem label="SKU描述">
                                                <Table className={style.table} pagination={false} columns={columns} dataSource={this.state.skuData} key='123'></Table>
                                              </FormItem>
                                              <FormItem label="商品描述">
                                                <Table className={style.table} pagination={false} columns={columns} dataSource={this.state.skuData} key='321'></Table>
                                              </FormItem>
                                              <FormItem label="商品图片">
                                                {
                                                  reqMes.sku_snapshot && reqMes.sku_snapshot.spu.image_url.map((item, index) => {
                                                    return (<img key={index} src={item} alt="img" className={style.originImg}/>)
                                                  })
                                                }
                                              </FormItem>
                                            </div>
            }
            <FormItem label="商品补充描述">
              {
                reqMes.img_url_arr.map((item, index) => {
                  return (<img key={index} src={item} alt="img" className={style.originImg}/>)
                })
              }
            </FormItem>
          </FormItem>
          <FormItem label="商品要求" className={style.tier}>
            {
              goodsReq.map((item, index) => {
                return (<div className={style.mBottom} key={index}>
                          <FormItem label={item.name}>
                            {getFieldDecorator(item.filed, {
                              initialValue: (reqMes && reqMes[item.filed]) || ''
                            })(
                              <Input disabled className={style.inputTitle}></Input>
                            )}
                          </FormItem>
                        </div>)
              })
            }
            <FormItem label="其他需求">
              {getFieldDecorator('other_req', {
                initialValue: (reqMes && reqMes.applicant_comment) || ''
              })(
                <Input disabled type="textarea" className={style.inputTitle}></Input>
              )}
            </FormItem>
            <FormItem
              label="拆分商品"
            >
              <div>
                <RadioGroup disabled value={reqMes && reqMes.material_arr && reqMes.material_arr.length ? 0 : 1}>
                  <Radio value={1}>不需要</Radio>
                  <Radio value={0}>需要</Radio>
                </RadioGroup>
                {
                  reqMes.material_arr && <p>BOM中有{reqMes.material_arr.length}物料</p>
                }
              </div>
            </FormItem>
          </FormItem>
          <FormItem label="实物样" className={style.tier}>
            <RadioGroup disabled value={reqMes && reqMes.has_sampling}>
              <Radio value={0}>无</Radio>
              <Radio value={1}>有</Radio>
              <span>(请在工单被供应链同事响应后给到具体同事)</span>
            </RadioGroup>
          </FormItem>
          <FormItem
            label="打样要求"
            className={style.tier}
          >
            <div>
              <div className={style.flex}>
                <FormItem label="打样数量">
                  {getFieldDecorator('sampling_amount', {
                    initialValue: reqMes && reqMes.sample_amount
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="打样单位">
                  {getFieldDecorator('sampling_unit')(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="样品交期">
                  {getFieldDecorator('custom_commodity_name', {
                    initialValue: reqMes && reqMes.sample_deadline
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem
            label="大货要求"
            className={style.tier}
          >
            <div>
              <div className={style.flex}>
                <FormItem label="预计大货数量">
                  {getFieldDecorator('bulk_estimate_amount', {
                    initialValue: reqMes && reqMes.bulk_production_amount
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="大货单位">
                  {getFieldDecorator('bulk_unit', {
                    initialValue: reqMes && reqMes.bulk_production_price
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="预期大货交期">
                  {getFieldDecorator('bulk_expectation_deliver_time', {
                    initialValue: reqMes && reqMes.bulk_production_deadline
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="期望大货价">
                  {getFieldDecorator('bulk_expectation_price', {
                    initialValue: reqMes && reqMes.bulk_production_price
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem className={style.enquiryBottom} style={{display: 'none'}}>
            <Button type="primary" htmlType="submit" onClick={e => this.handleSubmit(e)}>提交</Button>
            <Button>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Form.create()(newEnquiry)
