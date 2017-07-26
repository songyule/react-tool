import React, { PureComponent } from 'react'
import { Input, Radio, Button, Table, Form, Select } from 'antd'
import Title from 'components/title'
import style from './css/new-enquiry.css'
import MyUpload from '../../pages/topic/components/img-upload'
import SelectReq from 'components/enquiry/select-req'
import SelectClient from 'components/enquiry/select-client'
import { getClass } from 'actions/commodity'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option

class newEnquiry extends PureComponent {
  state = {
    defaultSource: true,
    skuData: [],
    spuData: [],
    fileList: [],
    imgArr: ['https://timage.fuliaoyi.com/FnV4neLabh9t7iXXK2ZH4W8qgryJ', 'https://timage.fuliaoyi.com/FskxEs_W5dnGOj78q8FU6ljTGCc3'],
    isReq: true,
    isType: '',
    isMaterial: true,
    reqVisible: false,
    clientVisible: false,
    reqNumber: '',
    lv1ClassArr: []
  }
  showModal = (val) => { // 需求单模态框
    if (val === 'req') {
      this.setState({
        reqVisible: true,
      });
    } else if (val === 'client') {
      this.setState({
        clientVisible: true,
      })
    }

  }
  onChangeWd = (e) => { // 数据来源
    this.setState({
      isReq: e.target.value
    })
    console.log(e.target.value)
  }
  onChangeMaterial = (e) => { // 是否需要拆分商品
    this.setState({
      isMaterial: e.target.value
    })
    console.log(e.target.value)
  }
  onChangeType = (e) => { // 选择商品类型
    this.setState({
      isType: e.target.value
    })
  }
  callbackParent = (val) => { // 选择需求单的回调
    console.log(val)
    if (val.name === 'req') {
      this.setState({
        reqVisible: val.visible,
        reqNumber: val.select[0] || ''
      })
    } else if (val.name === 'client') {
      this.setState({
        clientVisible: val.visible,
        clientOrgMes: val.clientOrgMes
      })
    }
  }
  handleChange = (fileList) => { // 图片上传
    console.log(fileList)
    console.log(this.props.form.getFieldsValue())
    this.setState({ fileList })
  }
  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
    })
  }

  getLv1Class () {
    getClass({level: 1}).then(res => {
      console.log(res)
      this.setState({lv1ClassArr: res.data})
    })
  }
  componentWillMount() {
    this.getLv1Class()
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { clientOrgMes } = this.state
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
        filed: 'color_req'
      },
      {
        name: '尺寸要求',
        filed: 'size_req'
      },
      {
        name: '形状要求',
        filed: 'shape_req'
      },
      {
        name: '材质要求',
        filed: 'material_req'
      },
      {
        name: '品质要求',
        filed: 'quality_req'
      },
      {
        name: '质检要求',
        filed: 'quality_testing_req'
      }
    ]
    return (
      <div className={style.newContent}>
        <Title title='新建询价工单'></Title>
        <Form>
          <FormItem
            label="数据来源"
            className={style.tier}
          >
            <div>
              <RadioGroup onChange={this.onChangeWd} value={this.state.isReq}>
                <Radio value={true}>需求单</Radio>
                <Radio value={false}>其他来源</Radio>
              </RadioGroup>
              {
                this.state.isReq && <div className={style.flex}>
                                      <Button type="primary" className={style.btn} style={{height: 32}} onClick={() => this.showModal('req')}>选择需求单</Button>
                                      <p>需求单号：{this.state.reqNumber}</p>
                                    </div>
              }
            </div>
          </FormItem>
          <FormItem
            label="客户情况"
            className={style.tier}
          >
            {
              !this.state.isReq && <Button type="primary" onClick={() => this.showModal('client')}>选择客户</Button>
            }
            <div>
              <div className={style.flex}>
                <FormItem label="客户简称">
                  {getFieldDecorator('name_cn', {
                    initialValue: clientOrgMes && clientOrgMes.org.name_cn
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="客户编码">
                  {getFieldDecorator('sn', {
                    initialValue: clientOrgMes && 'SN' + clientOrgMes.org.sn
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="客户级别">
                  {getFieldDecorator('level', {
                    initialValue: clientOrgMes && clientOrgMes.org.client_level.name
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="提交人">
                  {getFieldDecorator('name', {
                    initialValue: clientOrgMes && clientOrgMes.name_cn
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem label="商品类型" className={style.tier}>
            {getFieldDecorator('sampling_type', {
              initialValue: '1'
            })(
              <RadioGroup onChange={this.onChangeType} disabled={this.state.isReq}>
                <Radio value='1'>原版</Radio>
                <Radio value='2'>改版</Radio>
                <Radio value='3'>定制</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="商品详情" className={style.tier}>
            <div className={style.flex}>
              <FormItem label="商品名称">
                {getFieldDecorator('custom_commodity_name')(
                  <Input disabled={this.state.isType !== '3'} className={style.inputTitle}></Input>
                )}
              </FormItem>
              <FormItem label="类目">
                {getFieldDecorator('custom_commodity_class_id', {
                  initialValue: ''
                })(
                  <Select className={style.inputTitle} disabled={this.state.isType !== '3'}>
                    {
                        this.state.lv1ClassArr.map(item => {
                          return (<Option value={item.lv1_id}>{item.name_cn}</Option>)
                        })
                      }
                  </Select>
                )}
              </FormItem>
            </div>
            {
              this.state.isType !== '3' &&  <div>
                                              <FormItem label="SKUID" className={style.mBottom}>
                                                {getFieldDecorator('sku_id')(
                                                    <Input className={style.inputTitle}></Input>
                                                )}
                                                <Button type="primary" style={{marginLeft: 10}}>选择商品</Button>
                                              </FormItem>
                                              <FormItem label="SKU描述">
                                                <Table className={style.table} pagination={false} columns={columns} dataSource={this.state.skuData} key='123'></Table>
                                              </FormItem>
                                              <FormItem label="商品描述">
                                                <Table className={style.table} pagination={false} columns={columns} dataSource={this.state.skuData} key='321'></Table>
                                              </FormItem>
                                              <FormItem label="商品图片">
                                                {
                                                  this.state.imgArr.map((item, index) => {
                                                    return (<img key={index} src={item} alt="img" className={style.originImg}/>)
                                                  })
                                                }
                                              </FormItem>
                                            </div>
            }
            <FormItem label="商品补充描述">
              {getFieldDecorator('img')(
                <MyUpload fileList={[...this.state.fileList]} onChange={this.handleChange} length={5}></MyUpload>
              )}
            </FormItem>
          </FormItem>
          <FormItem label="商品要求" className={style.tier}>
            {
              goodsReq.map(item => {
                return (<div className={style.mBottom}>
                          <FormItem label={item.name}>
                            {getFieldDecorator(item.filed)(
                              <Input className={style.inputTitle}></Input>
                            )}
                          </FormItem>
                        </div>)
              })
            }
            <FormItem label="其他需求">
              {getFieldDecorator('other_req')(
                <Input type="textarea" className={style.inputTitle}></Input>
              )}
            </FormItem>
            <FormItem
              label="拆分商品"
            >
              <div>
                <RadioGroup onChange={this.onChangeMaterial} value={this.state.isMaterial}>
                  <Radio value={true}>不需要</Radio>
                  <Radio value={false}>需要</Radio>
                </RadioGroup>
                {
                  !this.state.isMaterial && <div className={style.flex}>
                                        <Button type="primary" className={style.btn}>BOM管理</Button>
                                        <p>BOM中没有物料</p>
                                      </div>
                }
              </div>
            </FormItem>
          </FormItem>
          <FormItem label="实物样" className={style.tier}>
              {getFieldDecorator('has_sampling', {
                initialValue: true,
              })(
                <RadioGroup>
                  <Radio value={true}>无</Radio>
                  <Radio value={false}>有</Radio>
                  <span>(请在工单被供应链同事响应后给到具体同事)</span>
                </RadioGroup>
              )}
          </FormItem>
          <FormItem
            label="打样要求"
            className={style.tier}
          >
            <div>
              <div className={style.flex}>
                <FormItem label="打样数量">
                  {getFieldDecorator('sampling_amount')(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="打样单位">
                  {getFieldDecorator('sampling_unit')(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="样品交期">
                  {getFieldDecorator('custom_commodity_name')(
                    <Input className={style.inputTitle}></Input>
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
                <FormItem label="预计大货数量" hasFeedback>
                  {getFieldDecorator('bulk_estimate_amount', {
                    initialValue: '',
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="大货单位">
                  {getFieldDecorator('bulk_unit')(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="预期大货交期">
                  {getFieldDecorator('bulk_expectation_deliver_time')(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="期望大货价">
                  {getFieldDecorator('bulk_expectation_price')(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem className={style.enquiryBottom}>
            <Button type="primary" htmlType="submit" onClick={e => this.handleSubmit(e)}>提交</Button>
            <Button>取消</Button>
          </FormItem>
        </Form>
        <SelectReq visible={this.state.reqVisible} callbackParent={this.callbackParent}></SelectReq>
        <SelectClient visible={this.state.clientVisible} callbackParent={this.callbackParent}></SelectClient>
      </div>
    )
  }
}
export default Form.create()(newEnquiry)
