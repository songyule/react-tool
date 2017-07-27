import React, { PureComponent } from 'react'
import { Input, Radio, Button, Table, Form, Select } from 'antd'
import Title from 'components/title'
import style from './css/new-enquiry.css'
import MyUpload from '../../pages/topic/components/img-upload'
import SelectReq from 'components/enquiry/select-req'
import SelectClient from 'components/enquiry/select-client'
import CommoditySelection from './components/commodity-selection/index'
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
    fileList: [],
    imgArr: ['https://timage.fuliaoyi.com/FnV4neLabh9t7iXXK2ZH4W8qgryJ', 'https://timage.fuliaoyi.com/FskxEs_W5dnGOj78q8FU6ljTGCc3'],
    isReq: true,
    isType: '',
    isMaterial: true,
    reqVisible: false,
    clientVisible: false,
    commodityVisible: false,
    reqNumber: '',
    lv1ClassArr: [],
    reqMes: {}
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
      console.log(val.reqMes)
      if (!val.reqMes) return this.setState({reqVisible: val.visible, reqNumber: val.select[0] || ''})
      val.reqMes.classify = this.classify(val.reqMes.sku_snapshot && val.reqMes.sku_snapshot.spu.commodity_class)
      console.log(2333)
      this.setState({
        reqVisible: val.visible,
        reqNumber: val.select[0] || '',
        reqMes: val.reqMes,
        skuData: val.reqMes.sku_snapshot.attribute,
        spuData: val.reqMes.sku_snapshot.spu.commodity_attribute
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
      creatSampling(values).then(res => {
        console.log(res)
      })
    })
  }
  getLv1Class () {
    getClass({level: 1}).then(res => {
      console.log(res)
      this.setState({lv1ClassArr: res.data})
    })
  }
  classify (val) {
    if (!val) return
    let classArr = []
    val.map(item => {
      return classArr.push(item.name_cn)
    })
    console.log(classArr)
    return classArr.join(',')
  }
  showGoodsSelect = () => {
    this.setState({
      commodityVisible: true
    })
  }
  commodityCancel = () => {
    this.setState({
      commodityVisible: false
    })
  }
  commodityCallback = (sku) => {
    console.log(sku)
    this.setState({
      commodityVisible: false
    })
  }
  componentWillMount() {
    this.getLv1Class()
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { clientOrgMes, reqMes } = this.state
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
                                      <p>需求单号：{reqMes.id}</p>
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
                    initialValue: (clientOrgMes && clientOrgMes.org.name_cn) || (reqMes.applicant_org && reqMes.applicant_org.name_cn)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="客户编码">
                  {getFieldDecorator('sn', {
                    initialValue: (clientOrgMes && 'SN' + clientOrgMes.org.sn) || (reqMes.applicant_org && 'SN' + reqMes.applicant_org.sn)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="客户级别">
                  {getFieldDecorator('level', {
                    initialValue: (clientOrgMes && clientOrgMes.org.client_level.name) || (reqMes.applicant_org && reqMes.applicant_org.client_level.name)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="提交人">
                  {getFieldDecorator('name', {
                    initialValue: (clientOrgMes && clientOrgMes.name_cn) || (reqMes.applicant_org && reqMes.applicant_org.client_source.name)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem label="商品类型" className={style.tier}>
            {getFieldDecorator('sampling_type', {
              initialValue: (reqMes && reqMes.classification) || 1
            })(
              <RadioGroup onChange={this.onChangeType} disabled={this.state.isReq}>
                <Radio value={1}>原版</Radio>
                <Radio value={2}>改版</Radio>
                <Radio value={3}>定制</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="商品详情" className={style.tier}>
            <div className={style.flex}>
              <FormItem label="商品名称">
                {getFieldDecorator('custom_commodity_name', {
                  initialValue: (reqMes.sku_snapshot && reqMes.sku_snapshot.spu_name_cn) || ''
                })(
                  <Input disabled={this.state.isType !== 3} className={style.inputTitle}></Input>
                )}
              </FormItem>
              <FormItem label="类目">
                {getFieldDecorator('custom_commodity_class_id', {
                  initialValue: (reqMes && reqMes.classify) || ''
                })(
                  <Select className={style.inputTitle} disabled={this.state.isType !== 3}>
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
              this.state.isType !== 3 &&  <div>
                                              <FormItem label="SKUID" className={style.mBottom}>
                                                {getFieldDecorator('sku_id', {
                                                  initialValue: (reqMes.sku_snapshot && reqMes.sku_snapshot.id) || ''
                                                })(
                                                    <Input className={style.inputTitle}></Input>
                                                )}
                                                <Button type="primary" style={{marginLeft: 10}} onClick={this.showGoodsSelect}>选择商品</Button>
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
                            {getFieldDecorator(item.filed, {
                              initialValue: (reqMes.requirement && reqMes.requirement[item.getFiled]) || ''
                            })(
                              <Input className={style.inputTitle}></Input>
                            )}
                          </FormItem>
                        </div>)
              })
            }
            <FormItem label="其他需求">
              {getFieldDecorator('other_req', {
                initialValue: (reqMes && reqMes.applicant_comment) || ''
              })(
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
                  {getFieldDecorator('sampling_amount', {
                    initialValue: reqMes && reqMes.sample_amount
                  })(
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
                  {getFieldDecorator('custom_commodity_name', {
                    initialValue: reqMes && reqMes.sample_deadline
                  })(
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
                <FormItem label="预计大货数量">
                  {getFieldDecorator('bulk_estimate_amount', {
                    initialValue: reqMes && reqMes.bulk_production_amount
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="大货单位">
                  {getFieldDecorator('bulk_unit', {
                    initialValue: reqMes && reqMes.bulk_production_price
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="预期大货交期">
                  {getFieldDecorator('bulk_expectation_deliver_time', {
                    initialValue: reqMes && reqMes.bulk_production_deadline
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="期望大货价">
                  {getFieldDecorator('bulk_expectation_price', {
                    initialValue: reqMes && reqMes.bulk_production_price
                  })(
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
        <CommoditySelection visible={this.state.commodityVisible} onCancel={this.commodityCancel} callback={this.commodityCallback}></CommoditySelection>
      </div>
    )
  }
}
export default Form.create()(newEnquiry)
