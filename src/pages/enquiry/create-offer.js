import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as managementActions from 'actions/management'
import * as samplingActions from 'actions/sampling'
import { getOfferList } from 'actions/sampling'
import { Link } from 'react-router-dom'
import Title from 'components/title'
import { accMul } from 'utils'
import MyUpload from 'components/common/img-upload.js'
// import MaterialForm from './components/material-form'
import { Form, Input, Row, Col, Radio, Select, Collapse, Card, Button, Popconfirm, DatePicker, Modal } from 'antd'
const [FormItem, RadioGroup, Option, Panel, TextArea] = [Form.Item, Radio.Group, Select.Option, Collapse.Panel, Input.TextArea]

@Form.create()
@connect(
  state => state,
  dispatch => bindActionCreators({ ...managementActions, ...samplingActions }, dispatch)
)

export default class CreateOffer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isExpand: false,
      id: this.props.match.params.id,
      fileList: [],
      fileObj: {},
      visible: false
    }
  }

  componentWillMount () {
    this.getDetail()
    this.props.getOrgList({ limit: 10000, org_type: 3 })
  }

  handleExpand = (e) => {
    this.setState({ isExpand : !this.state.isExpand })
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const {
          sampling_price,
          bulk_unit_price,
          bulk_estimate_amount,
          bulk_expectation_price,
          predictable_risk = '',
          comment = ''
        } = values

        const {
          include_express_fee,
          supplier_id,
          bulk_wear_rate,
          bulk_mould_fee,
          bulk_examine_fee,
          quality_req,
          quality_testing_req,
          img_url_arr = [],
          valid_deadline,
          sampling_unit_price,
          minimum_order_quantity,
          include_tax,
          tax_point
        } = values

        let data = {
          sampling_price,
          bulk_unit_price,
          predictable_risk,
          comment,
          img_url_arr,
          valid_deadline,
          sampling_unit_price,
          minimum_order_quantity,
          include_tax,
          tax_point
        }

        const BOMData = {}
        Object.keys(values).forEach(key => {
          if (key.indexOf('BOM__') !== -1) {
            const fieldResolve = key.split('__')
            const [ ,realKey, serial] = fieldResolve
            if (BOMData[serial]) BOMData[serial][realKey] = values[key] || ''
            else BOMData[serial] = { [realKey]: values[key] || '' }
          }
        })
        if (this.state.data.material_arr.length > 0) {
          data['material_offer_arr'] = Object.keys(BOMData).map(key => {
            BOMData[key]['material_serial'] = Number(key)
            return BOMData[key]
          })
        } else {
          data = {
            ...data,
            include_express_fee,
            supplier_id,
            bulk_wear_rate,
            bulk_mould_fee,
            bulk_examine_fee,
            quality_req,
            quality_testing_req
          }
        }
        const id = this.props.match.params.id
        this.props.saveOffer({ id, offer: data })
        this.setState({ visible: true })
      } else {
        if (!this.state.isExpand) this.setState({ isExpand: true })
      }
    })
  }

  handleCalcEstimatedQuantity = (e, config, item) => {
    if (config.valid !== 'bulk_wear_rate' || this.state.data.material_arr.length === 0) return
    const val = e.target.value
    const amount = accMul(item.per_bom_amount, (1 + val * 0.01))

    this.props.form.setFieldsValue({
      [`BOM__bulk_estimate_amount__${item.serial}`]: String(amount)
    })
  }

  getDetail = async () => {
    const { id } = this.state
    const { data } = await getOfferList({ id })
    const inquiry = data.inquiry[0] || {}
    const fileObj = {}
    inquiry.material_arr.forEach(material => {
      fileObj[material.serial] = []
    })
    this.setState({ data: inquiry, fileObj })
  }

  confirmBack = async () => {
    const id = this.state.id
    this.props.history.push(`/main/offer-info/${id}`)
  }

  handleUpload = (fileList, serial) => {
    const { fileObj } = this.state
    if (fileList.length > 5) fileList = fileList.slice(0, 5)
    if (!serial) this.setState({ fileList: fileList || [] })
    else this.setState({ fileObj: { ...fileObj, [serial]: fileList } })

    const imgs = fileList ? fileList.map(file => file.response) : []
    if (!serial) this.props.form.setFieldsValue({ img_url_arr: imgs })
    else this.props.form.setFieldsValue({ [`BOM__img_url_arr__${serial}`]: imgs })
  }

  handleGoDetail = () => {
    const id = this.props.match.params.id
    this.setState({ visible: false })
    this.props.history.push(`/main/offer-info/${id}`)
  }

  handleContinue = () => {
    this.setState({ visible: false })
    this.props.form.resetFields()
  }

  render () {
    const { id, data, isExpand, fileList, fileObj, visible } = this.state
    const { getFieldDecorator } = this.props.form
    const { orgList } = this.props

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    const formItemFullColLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }

    const formItemConfig = [
      {
        label: '打样单价',
        valid: 'sampling_price',
        unit: '元',
        rules: [{ required: true, message: '请输入打样单价', pattern: /^\d+(\.\d+)?$/ }]
      },
      {
        label: '大货单价',
        valid: 'bulk_unit_price',
        unit: '元',
        rules: [{ required: true, message: '请输入大货单价', pattern: /^\d+(\.\d+)?$/ }]
      },
      {
        label: '大货预计数量',
        valid: 'bulk_estimate_amount',
        unit: data && data.bulk_unit,
        isReturn: true
      },
      {
        label: '大货预计价格',
        valid: 'bulk_expectation_price',
        unit: '元',
        isReturn: true
      }
    ]

    const materialItemConfig = [
      {
        label: 'BOM行号',
        valid: 'serial'
      },
      {
        label: '名称',
        valid: 'name'
      },
      {
        label: '使用数量',
        valid: 'per_bom_amount'
      },
      {
        label: '数量单位',
        valid: 'unit'
      }
    ]

    const materialItemWithUnitConfig = [
      {
        label: '磨损率',
        valid: 'bulk_wear_rate',
        unit: '%',
        rules: [{ required: true, message: '请输入磨损率', pattern: /^\d+(\.\d+)?$/ }]
      },
      {
        label: '模具费',
        valid: 'bulk_mould_fee',
        unit: '元',
        rules: [{ required: true, message: '请输入模具费', pattern: /^\d+(\.\d+)?$/ }]
      },
      {
        label: '检测费',
        valid: 'bulk_examine_fee',
        unit: '元',
        rules: [{ required: true, message: '请输入检测费', pattern: /^\d+(\.\d+)?$/ }]
      },
      {
        label: '打样单价',
        valid: 'bulk_unit_price',
        unit: '元',
        rules: [{ required: true, message: '请输入打样单价', pattern: /^\d+(\.\d+)?$/ }]
      },
      {
        label: '预计数量',
        valid: 'bulk_estimate_amount',
        unit: '',
        disabled: true
      }
    ]

    const materialItemFullColConfig = [
      {
        label: '颜色要求',
        valid: 'color_req'
      },
      {
        label: '尺寸要求',
        valid: 'size_req'
      },
      {
        label: '品质要求',
        valid: 'quality_req'
      },
      {
        label: '质检要求',
        valid: 'quality_testing_req'
      }
    ]

    const formItemTextareaConfig = [
      {
        label: '可预见风险',
        valid: 'predictable_risk'
      },
      {
        label: '备注',
        valid: 'comment'
      }
    ]
    return data ? (
      <div>
        <Title title={`报价单号${id}`} />
        <Form style={{maxWidth: '1000px'}}>
          <Row>
            {
              <FormItem {...formItemFullColLayout} label="图片">
                {getFieldDecorator('img_url_arr', { initialValue: [] })(<div></div>)}
                <MyUpload onChange={this.handleUpload} fileList={[...fileList]}></MyUpload>
              </FormItem>
            }
          </Row>
          <Row>
            {formItemConfig.map(config => (
              <Col key={config.valid} span={12}>
                <FormItem {...formItemLayout} label={config.label}>
                  {getFieldDecorator(
                    config.valid,
                    { initialValue: config.isReturn && data[config.valid], rules: config.rules }
                  )(
                    <Input disabled={config.isReturn} addonAfter={config.unit && <span>{config.unit}</span>} />
                  )}
                </FormItem>
              </Col>
            ))}
            <Col span={12}>
              <FormItem {...formItemLayout} label="是否拆分">
                {getFieldDecorator('isDepart', { initialValue: data['material_arr'].length > 0 })(
                  <RadioGroup disabled>
                    <Radio value={true}>需要</Radio>
                    <Radio value={false}>不需要</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="报价有效期">
                {getFieldDecorator('valid_deadline')(
                  <DatePicker></DatePicker>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="打样成本价">
                {getFieldDecorator('sampling_unit_price', { rules: [{ message: '打样成本价格式有误', pattern: /^\d+(\.\d+)?$/ }] })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="起订量">
                {getFieldDecorator('minimum_order_quantity', { rules: [{ message: '起订量必须为整数', pattern: /^\d+$/ }] })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="是否含税">
                {getFieldDecorator('include_tax')(
                  <RadioGroup >
                    <Radio value="1"> 包含税费 </Radio>
                    <Radio value="0"> 不包含税费 </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="开票加点">
                {getFieldDecorator('tax_point', { rules: [{ message: '税点格式有误', pattern: /^\d+(\.\d+)?$/ }] })(
                  <Input />
                )}
              </FormItem>
            </Col>
            {
              data['material_arr'].length === 0
                ? (
                  <div>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="包含运费">
                        {getFieldDecorator('include_express_fee', { initialValue: data.include_express_fee || '1' })(
                          <RadioGroup>
                            <Radio value="1"> 包含运费 </Radio>
                            <Radio value="0"> 不包含运费 </Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="供应商选择">
                        {getFieldDecorator('supplier_id', { rules: [{ required: true, message: '请选择供应商'}] })(
                          <Select placeholder="请选择" showSearch optionFilterProp="label">
                            {
                              orgList.map(item => (
                                <Option key={item.id} value={item.id} label={item.name_official || item.name_cn}> {item.name_official || item.name_cn} </Option>
                              ))
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    {materialItemWithUnitConfig.slice(0, 3).map(item => (
                      <Col key={item.valid} span={12}>
                        <FormItem {...formItemLayout} label={item.label}>
                          {getFieldDecorator(
                            item.valid,
                            { initialValue: data[item.valid], rules: item.rules }
                          )(
                            <Input
                              disabled={item.disabled}
                              addonAfter={item.unit && <span>{item.unit}</span>}
                              onChange={(e, _config, _item) => this.handleCalcEstimatedQuantity(e, item, data)}
                            />
                          )}
                        </FormItem>
                      </Col>
                    ))}
                    {materialItemFullColConfig.map(item => (
                      <Col key={item.valid} span={24}>
                        <FormItem {...formItemFullColLayout} label={item.label}>
                          {getFieldDecorator(item.valid, { initialValue: data[item.valid] })(
                            <Input disabled />
                          )}
                        </FormItem>
                      </Col>
                    ))}
                  </div>
                )
                : null
            }
            {
              data['material_arr'].length > 0
                ? (
                  <Col span={24}>
                    <Collapse bordered={false} style={{ marginBottom: '30px' }} activeKey={isExpand ? '1' : ''} onChange={this.handleExpand}>
                      <Panel header={`BOM中有${data['material_arr'].length}个物料(点击展开)`} key="1">
                        {data.material_arr.map(item => (
                          item.status !== '0'
                           ? (
                             <Card title="物料" key={item.serial} style={{ marginBottom: '15px' }}>
                                <FormItem {...formItemFullColLayout} label="图片">
                                  {getFieldDecorator(`BOM__img_url_arr__${item.serial}`, { initialValue: [] })(<div></div>)}
                                  <MyUpload onChange={fileList => this.handleUpload(fileList, item.serial)} fileList={[...(fileObj[item.serial] || fileObj[item.serial]['fileList'] || [])]}></MyUpload>
                                </FormItem>
                               {materialItemConfig.map(config => (
                                 <Col key={config.valid} span={12}>
                                   <FormItem {...formItemLayout} label={config.label}>
                                     {getFieldDecorator(`BOM__${config.valid}__${item.serial}`, { initialValue: item[config.valid] })(
                                       <Input disabled />
                                     )}
                                   </FormItem>
                                 </Col>
                               ))}
                               <Col span={12}>
                                 <FormItem {...formItemLayout} label="包含运费">
                                   {getFieldDecorator('BOM__include_express_fee__' + item.serial, { initialValue: item.include_express_fee || '1' })(
                                     <RadioGroup >
                                       <Radio value="1"> 包含运费 </Radio>
                                       <Radio value="0"> 不包含运费 </Radio>
                                     </RadioGroup>
                                   )}
                                 </FormItem>
                               </Col>
                               <Col span={12}>
                                <FormItem {...formItemLayout} label="供应商选择">
                                  {getFieldDecorator('supplier_id', { rules: [{ required: true, message: '请选择供应商'}] })(
                                    <Select placeholder="请选择" showSearch optionFilterProp="label">
                                      {
                                        orgList.map(item => (
                                          <Option key={item.id} value={item.id} label={item.name_official || item.name_cn}> {item.name_official || item.name_cn} </Option>
                                        ))
                                      }
                                    </Select>
                                  )}
                                </FormItem>
                               </Col>
                               {materialItemWithUnitConfig.map(config => (
                                 <Col key={config.valid} span={12}>
                                   <FormItem {...formItemLayout} label={config.label}>
                                     {getFieldDecorator(
                                       `BOM__${config.valid}__${item.serial}`,
                                       { initialValue: item[config.valid], rules: config.rules }
                                     )(
                                       <Input
                                         disabled={config.disabled}
                                         addonAfter={config.unit && <span>{config.unit}</span>}
                                         onChange={(e, _config, _item) => this.handleCalcEstimatedQuantity(e, config, item)}
                                       />
                                     )}
                                   </FormItem>
                                 </Col>
                               ))}
                              <Col span={12}>
                                <FormItem {...formItemLayout} label="报价有效期">
                                  {getFieldDecorator(`BOM__valid_deadline__${item.serial}`)(
                                    <DatePicker></DatePicker>
                                  )}
                                </FormItem>
                              </Col>
                              <Col span={12}>
                                <FormItem {...formItemLayout} label="打样成本价">
                                  {getFieldDecorator(`BOM__sampling_unit_price__${item.serial}`, { rules: [{ message: '打样成本价格式有误', pattern: /^\d+(\.\d+)?$/ }] })(
                                    <Input />
                                  )}
                                </FormItem>
                              </Col>
                              <Col span={12}>
                                <FormItem {...formItemLayout} label="起订量">
                                  {getFieldDecorator(`BOM__minimum_order_quantity__${item.serial}`, { rules: [{ message: '起订量必须为整数', pattern: /^\d+$/ }] })(
                                    <Input />
                                  )}
                                </FormItem>
                              </Col>
                              <Col span={12}>
                                <FormItem {...formItemLayout} label="是否含税">
                                  {getFieldDecorator(`BOM__include_tax__${item.serial}`)(
                                    <RadioGroup>
                                      <Radio value="1"> 包含税费 </Radio>
                                      <Radio value="0"> 不包含税费 </Radio>
                                    </RadioGroup>
                                  )}
                                </FormItem>
                              </Col>
                              <Col span={12}>
                                <FormItem {...formItemLayout} label="开票加点">
                                  {getFieldDecorator(`BOM__tax_point__${item.serial}`, { rules: [{ message: '税点格式有误', pattern: /^\d+(\.\d+)?$/ }] })(
                                    <Input />
                                  )}
                                </FormItem>
                              </Col>
                               {materialItemFullColConfig.map(config => (
                                 <Col key={config.valid} span={24}>
                                   <FormItem {...formItemFullColLayout} label={config.label}>
                                     {getFieldDecorator(`BOM__${config.valid}__${item.serial}`, { initialValue: item[config.valid] })(
                                       <Input disabled />
                                     )}
                                   </FormItem>
                                 </Col>
                               ))}
                               <Col span={24}>
                                 <FormItem {...formItemFullColLayout} label="备注">
                                   {getFieldDecorator('BOM__comment__'+ item.serial, { initialValue: item['comment'] })(
                                     <TextArea rows={4}/>
                                   )}
                                 </FormItem>
                               </Col>
                             </Card>
                           )
                           : null
                        ))}
                      </Panel>
                    </Collapse>
                  </Col>
                )
                : null
            }
            {formItemTextareaConfig.map(item => (
              <Col key={item.valid} span={24}>
                <FormItem {...formItemFullColLayout} label={item.label}>
                  {getFieldDecorator(item.valid, { initialValue: data[item.valid] })(
                    <TextArea rows={4}/>
                  )}
                </FormItem>
              </Col>
            ))}
          </Row>
        </Form>
        <div style={{textAlign: 'center', maxWidth: '1000px', margin: '10px 0'}}>
          <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '20px'}}> 保存报价 </Button>
          <Popconfirm title="返回报价工单所填写的数据将不会保存，请确定返回" okText="确认" cancelText="取消" onConfirm={this.confirmBack}>
            <Button> 返回 </Button>
          </Popconfirm>
        </div>
        <Modal
          visible={visible}
          closable={false}
          title="您的报价单已创建成功"
          style={{top: '300px'}}
          footer={[
            <Button key="back" size="large" onClick={this.handleContinue}>继续报价</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.handleGoDetail}>
              查看详情
            </Button>
          ]}
        >
          <p>您可以：查看详情或继续报价，一份报价单允许多个报价</p>
        </Modal>
      </div>
    ) : null
  }
}
