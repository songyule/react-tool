import React, { PureComponent } from 'react'
import { Input, Radio, Button, Table, Form, Select, Modal } from 'antd'
import Title from 'components/title'
import style from './css/new-enquiry.css'
import MyUpload from '../../pages/topic/components/img-upload'
import SelectReq from 'components/enquiry/select-req'
import SelectClient from 'components/enquiry/select-client'
import CommoditySelection from './components/commodity-selection/index'
import BomCreate from './components/bom-create'
import { getClass } from 'actions/commodity'
import { creatSampling, sellerInquirySearch, getRequirementList, enquiryUpdata } from 'actions/sampling'
import { toRemoteBom, toLocalBom } from './utils'
import { format } from 'utils'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option

class newEnquiry extends PureComponent {
  state = {
    defaultSource: true,
    skuData: [],
    spuData: [],
    fileList: [],
    isReq: true,
    isType: '',
    isMaterial: false,
    modalVisible: false,
    reqVisible: false,
    clientVisible: false,
    commodityVisible: false,
    bomVisible: false,
    reqNumber: '',
    lv1ClassArr: [],
    reqMes: {},
    bom: {},
    boms: [],
    enquiryMes: {}
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
  bomCancel = () => {
    this.setState({
      bomVisible: false
    })
  }
  onChangeWd = (e) => { // 数据来源
    if (!e.target.value) this.handleReset()
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
      if (val.reqMes.spu) val.reqMes.classify = this.classify(val.reqMes.sku_snapshot && val.reqMes.sku_snapshot.spu.commodity_class)
      let fileArr = []
      val.reqMes.img_arr.map((item, index) => {
        let obj ={
                    uid: index,
                    name: '233',
                    status: 'done',
                    url: item || '',
                    response: item || '',
                    thumbUrl: item || ''
                  }
        return fileArr.push(obj)
      })
      this.setState({
        reqVisible: val.visible,
        reqNumber: val.select[0] || '',
        reqMes: val.reqMes,
        skuData: val.reqMes.sku_snapshot.attribute || '',
        spuData: (val.reqMes.sku_snapshot.spu && val.reqMes.sku_snapshot.spu.commodity_attribute) || '',
        fileList: fileArr
      })
    } else if (val.name === 'client') {
      console.log(val.clientOrgMes)
      this.setState({
        clientVisible: val.visible,
        clientOrgMes: val.clientOrgMes
      })
    } else if (val.name === 'getReq') {
      if (!val.reqMes) return this.setState({reqVisible: val.visible, reqNumber: val.select[0] || ''})
      val.reqMes.classify = this.classify(val.reqMes.sku_snapshot && val.reqMes.sku_snapshot.spu.commodity_class)
      let fileArr = []
      val.reqMes.img_arr.map((item, index) => {
        let obj ={
                    uid: index,
                    name: '233',
                    status: 'done',
                    url: item || '',
                    response: item || '',
                    thumbUrl: item || ''
                  }
        return fileArr.push(obj)
      })
      this.setState({
        reqMes: val.reqMes,
        skuData: val.reqMes.sku_snapshot.attribute,
        spuData: val.reqMes.sku_snapshot.spu.commodity_attribute,
        fileList: fileArr
      })
    }
  }
  handleChange = (fileList) => { // 图片上传
    console.log(fileList)
    console.log(this.props.form.getFieldsValue())
    this.setState({ fileList })
  }
  checkNumber = (value) => {
    let reg = /^[0-9]+.?[0-9]*$/
    if (reg.test(value)) {
      return true
    }
    return false
  }
  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (this.state.isReq) return
      if (!err && this.checkNumber(values.bulk_estimate_amount)) {
        let arr = []
        this.state.fileList.map(item => {
          arr.push(item.response)
          return arr
        })
        console.log(arr)
        values.img_url_arr = arr
        if (this.state.isType !== 2) values.custom_commodity_class_id = 0
        if (this.state.isMaterial) values.material_arr = this.state.bom
        if (this.state.isReq) {
          values.sampling_id = this.state.reqMes.id
        } else {
          values.client_uid = this.state.clientOrgMes.id
          values.client_org_id = this.state.clientOrgMes.org_id
        }
        if (this.props.match.params.id && this.state.enqSource === 'B') {
          console.log('我是一个返回并修改报价哦')
          values.id = this.state.enqId
          enquiryUpdata(values).then(res => {
            if (res.code === 200) this.setState({modalVisible: true})
          })
        } else {
          console.log('这里是新建一个报价')
          creatSampling(values).then(res => {
            if (res.code === 200) this.setState({modalVisible: true})
          })
        }
      }
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
    return classArr.join(',')
  }
  showGoodsSelect = () => {
    this.setState({
      commodityVisible: true
    })
  }
  showBomCreate = () => {
    this.setState({
      bomVisible: true
    })
  }
  commodityCancel = () => {
    this.setState({
      commodityVisible: false
    })
  }
  commodityCallback = (sku) => {
    console.log(sku)
    let newReqMes = this.state.reqMes
    newReqMes.sku_snapshot = sku
    this.setState({
      commodityVisible: false,
      reqMes: newReqMes,
      skuData: sku.attribute,
      spuData: sku.spu.commodity_attribute,
    })
  }
  bomCallback = (boms) => {
    console.log(boms.map(item => toRemoteBom(item)))
    this.setState({
      bomVisible: false,
      boms: boms,
      bom: boms.map(item => toRemoteBom(item))
    })
  }
  handleReset = () => {
    this.setState({reqMes: {}, skuData: [], spuData: []})
  }
  handleOk = (e) => {
    this.setState({
      modalVisible: false,
    }, () => {
      this.props.history.push('/main/enquiry-list')
    })
  }
  handleCancel = (e) => {
    this.setState({
      modalVisible: false,
    })
  }
  getEnqDetail = () => {
    sellerInquirySearch({id: this.state.enqId}).then(res => {
      console.log(res.data.inquiry[0])
      let inquiry = res.data.inquiry[0]
      let fileArr = []
      inquiry.img_url_arr.map((item, index) => {
        let obj ={
                    uid: index,
                    name: '233',
                    status: 'done',
                    url: item || '',
                    response: item || '',
                    thumbUrl: item || ''
                  }
        return fileArr.push(obj)
      })
      if (res.code === 200) {
        this.setState({
          enquiryMes: inquiry,
          isMaterial: inquiry.material_arr.length ? true : false,
          boms: res.data.inquiry[0].material_arr.map(bom => toLocalBom(bom)),
          isReq: inquiry.sampling_id ? true : false,
          skuData: inquiry.sku_snapshot.attribute,
          spuData: inquiry.sku_snapshot.spu.commodity_attribute,
          fileList: fileArr
        })
        // if (!this.isReq) return
        // let id_arr = []
        // id_arr.push(res.data.inquiry[0].sampling_id)
        // getRequirementList({'id_arr': id_arr}).then(res => {
        //   console.log(res)
        //   let val = {}
        //   val.name = 'getReq'
        //   val.reqMes = res.data.sampling[0]
        //   this.callbackParent(val)
        // })
      }
    })
  }
  setInputType = (e) => {
    this.props.form.setFieldsValue({'bulk_estimate_amount': 1})
    console.log(this.props.form)
  }
  checkBigImg = (img) => {
    window.open(img)
  }
  componentWillMount() {
    this.getLv1Class()
    if (!this.props.match.params.id) return
    this.setState({
      enqId: this.props.match.params.id.substring(1),
      enqSource: this.props.match.params.id.substring(-1,1)
    })
    this.getEnqDetail()
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { clientOrgMes, reqMes, enquiryMes } = this.state
    const boms = this.state.boms
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
        getFiled: 'color_req',
        reqFilde: 'color'
      },
      {
        name: '尺寸要求',
        filed: 'size_req',
        getFiled: 'size_req',
        reqFilde: 'size'
      },
      {
        name: '形状要求',
        filed: 'shape_req',
        getFiled: 'shape_req',
        reqFilde: 'shape'
      },
      {
        name: '材质要求',
        filed: 'material_req',
        getFiled: 'material_req',
        reqFilde: 'material'
      },
      {
        name: '品质要求',
        filed: 'quality_req',
        getFiled: 'quality_req',
        reqFilde: ''
      },
      {
        name: '质检要求',
        filed: 'quality_testing_req',
        getFiled: 'quality_testing_req',
        reqFilde: 'standard'
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
                                      <p>需求单号：<span ref='samplingID'>{enquiryMes.sampling_id || reqMes.id}</span></p>
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
                    initialValue: (clientOrgMes && clientOrgMes.org.name_cn) || (reqMes.applicant_org && reqMes.applicant_org.name_cn) || (enquiryMes.client_org && enquiryMes.client_org.name_cn)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="客户编码">
                  {getFieldDecorator('sn', {
                    initialValue: (clientOrgMes && 'SN' + clientOrgMes.org.sn) || (reqMes.applicant_org && 'SN' + reqMes.applicant_org.sn) || (enquiryMes.client_org && 'SN' + enquiryMes.client_org.sn)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="客户级别">
                  {getFieldDecorator('level', {
                    initialValue: (clientOrgMes && clientOrgMes.org && clientOrgMes.org.client_level && clientOrgMes.org.client_level.name) || (reqMes.applicant_org && reqMes.applicant_org.client_level && reqMes.applicant_org.client_level.name) || (enquiryMes.client_org && enquiryMes.client_org.client_level && enquiryMes.client_org.client_level.name)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="提交人">
                  {getFieldDecorator('name', {
                    initialValue: (clientOrgMes && clientOrgMes.name_cn) || (reqMes.applicant_org && reqMes.applicant_org.client_source.name)|| (enquiryMes.client_org && enquiryMes.client_org.seller && enquiryMes.client_org.seller[0].name_cn)
                  })(
                    <Input disabled className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem label="商品类型" className={style.tier}>
            {getFieldDecorator('sampling_type', {
              initialValue: (reqMes && reqMes.classification) || ( enquiryMes && enquiryMes.sampling_type) || 0
            })(
              <RadioGroup onChange={this.onChangeType} disabled={this.state.isReq}>
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
                  initialValue: (reqMes.sku_snapshot && reqMes.sku_snapshot.spu_name_cn) || (enquiryMes.sku_snapshot && enquiryMes.sku_snapshot.spu_name_cn) || ''
                })(
                  <Input disabled={this.state.isType !== 2} className={style.inputTitle}></Input>
                )}
              </FormItem>
              <FormItem label="类目">
                {getFieldDecorator('custom_commodity_class_id', {
                  initialValue: (reqMes && reqMes.classify) || (enquiryMes && enquiryMes.custom_commodity_class_id) || ''
                })(
                  <Select className={style.inputTitle} disabled={this.state.isType !== 2}>
                    {
                      this.state.lv1ClassArr.map((item, index) => {
                        return (<Option  key={index} value={item.lv1_id}>{item.name_cn}</Option>)
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </div>
            {
              this.state.isType !== 2 &&  <div>
                                              <FormItem label="SKUID" className={style.mBottom}>
                                                {getFieldDecorator('sku_id', {
                                                  initialValue: (reqMes.sku_snapshot && reqMes.sku_snapshot.id) || (enquiryMes && enquiryMes.sku_id) || ''
                                                })(
                                                    <Input className={style.inputTitle} disabled></Input>
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
                                                  reqMes.sku_snapshot && reqMes.sku_snapshot.spu && reqMes.sku_snapshot.spu.image_url.map((item, index) => {
                                                    return (<img key={index} src={item} alt="img" className={style.originImg} onClick={(imgSrc) => this.checkBigImg(item)}/>)
                                                  })
                                                }
                                              </FormItem>
                                            </div>
            }
            <FormItem label="商品补充描述">
              {getFieldDecorator('img_url_arr', {
                initialValue: ''
              })(
                <MyUpload fileList={[...this.state.fileList]} onChange={this.handleChange} length={5}></MyUpload>
              )}
            </FormItem>
          </FormItem>
          <FormItem label="商品要求" className={style.tier}>
            {
              goodsReq.map((item, index) => {
                return (<div className={style.mBottom} key={index}>
                          <FormItem label={item.name}>
                            {getFieldDecorator(item.filed, {
                              initialValue: (reqMes.requirement && reqMes.requirement[item.reqFilde]) || (enquiryMes && enquiryMes[item.getFiled]) || ''
                            })(
                              <Input className={style.inputTitle}></Input>
                            )}
                          </FormItem>
                        </div>)
              })
            }
            <FormItem label="其他需求">
              {getFieldDecorator('other_req', {
                initialValue: (reqMes && reqMes.applicant_comment) || (enquiryMes && enquiryMes.other_req) || ''
              })(
                <Input type="textarea" className={style.inputTitle}></Input>
              )}
            </FormItem>
            <FormItem
              label="拆分商品"
            >
              <div>
                <RadioGroup onChange={this.onChangeMaterial} value={this.state.isMaterial}>
                  <Radio value={false}>不需要</Radio>
                  <Radio value={true}>需要</Radio>
                </RadioGroup>
                {
                  this.state.isMaterial && <div className={style.flex}>
                                        <Button type="primary" className={style.btn} onClick={this.showBomCreate}>BOM管理</Button>
                                        <p>{!this.state.boms.length ? 'BOM中没有物料' : 'BOM中有' + this.state.boms.length + '物料'}</p>
                                      </div>
                }
              </div>
            </FormItem>
          </FormItem>
          <FormItem label="实物样" className={style.tier}>
              {getFieldDecorator('has_sampling', {
                initialValue:(enquiryMes && enquiryMes.has_sampling) || -1,
              })(
                <RadioGroup>
                  <Radio value={-1}>无</Radio>
                  <Radio value={0}>有</Radio>
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
                    initialValue: (reqMes && reqMes.sample_amount) || (enquiryMes && enquiryMes.sampling_amount)
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="打样单位">
                  {getFieldDecorator('sampling_unit', {
                    initialValue: (reqMes && reqMes.sampling_unit) || (enquiryMes && enquiryMes.sampling_unit)
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="样品交期">
                  {getFieldDecorator('sample_deadline', {
                    initialValue: (reqMes && reqMes.sample_deadline) || (enquiryMes && enquiryMes.sampling_deliver_epoch)
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
                    initialValue: null,
                    rules: [{required: true, message: '请检查此项是否为纯数字，若不是，请输入数字' }]
                  })(
                    <Input onChange={this.setInputType} className={style.inputTitle} placeholder={ (reqMes && reqMes.bulk_production_amount) || (enquiryMes && enquiryMes.bulk_estimate_amount) || '(请将此项写成数字)'}></Input>
                  )}
                </FormItem>
                <FormItem label="大货单位">
                  {getFieldDecorator('bulk_unit', {
                    initialValue: (reqMes && reqMes.bulk_unit) || (enquiryMes && enquiryMes.bulk_unit)
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
              </div>
              <div className={style.flex}>
                <FormItem label="预期大货交期">
                  {getFieldDecorator('bulk_expectation_deliver_time', {
                    initialValue: (reqMes && reqMes.bulk_production_deadline) || (enquiryMes && enquiryMes.bulk_expectation_deliver_time)
                  })(
                    <Input className={style.inputTitle}></Input>
                  )}
                </FormItem>
                <FormItem label="期望大货价">
                  {getFieldDecorator('bulk_expectation_price', {
                    initialValue: (reqMes && reqMes.bulk_production_price) || (enquiryMes && enquiryMes.bulk_expectation_price)
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
        <Modal
          title="提示"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          创建成功，是否跳往询价列表
        </Modal>
        <BomCreate visible={this.state.bomVisible} boms={boms} onCancel={this.bomCancel} changeBoms={boms => this.setState({ boms })} callback={this.bomCallback}></BomCreate>
      </div>
    )
  }
}
export default Form.create()(newEnquiry)
