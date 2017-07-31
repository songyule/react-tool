import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as managementActions from 'actions/management'
import * as samplingActions from 'actions/sampling'
import { getOfferList } from 'actions/sampling'
import { Link } from 'react-router-dom'
import Title from 'components/title'
// import MaterialForm from './components/material-form'
import { Form, Input, Row, Col, Radio, Select, Collapse, Card, Button } from 'antd'
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
      id: this.props.match.params.id
    }
  }

  componentWillMount () {
    this.getDetail()
    this.props.getOrgList({ limit: 10000 })
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
          predictable_risk = '',
          comment = ''
        } = values

        const data = {
          sampling_price,
          bulk_unit_price,
          predictable_risk,
          comment
        }

        const BOMData = {}
        Object.keys(values).forEach(key => {
          if (key.indexOf('BOM__') !== -1) {
            const fieldResolve = key.split('__')
            const [ ,realKey, serial] = fieldResolve
            if (realKey === 'bulk_wear_rate') BOMData[serial][realKey] = String(Number(values[key]) / 100) || ''
            else if (BOMData[serial]) BOMData[serial][realKey] = values[key] || ''
            else BOMData[serial] = { [realKey]: values[key] || '' }
          }
        })
        if (this.state.data.material_arr.length > 0) {
          data['material_offer_arr'] = Object.keys(BOMData).map(key => {
            BOMData[key]['material_serial'] = Number(key)
            return BOMData[key]
          })
        }
        const id = this.props.match.params.id
        this.props.saveOffer({ id, offer: data })
        this.props.history.push(`/main/offer-info/${id}`)
      } else {
        if (!this.state.isExpand) this.setState({ isExpand: true })
      }
    })
  }

  handleCalcEstimatedQuantity = (e, config, item) => {
    if (config.valid !== 'bulk_wear_rate') return
    const val = e.target.value
    const amount = item.per_bom_amount * (1 + val * 0.01)

    this.props.form.setFieldsValue({
      [`BOM__bulk_estimate_amount__${item.serial}`]: Math.ceil(amount)
    })
  }

  getDetail = async () => {
    const { id } = this.state
    const { data } = await getOfferList({ id })
    this.setState({ data: data.inquiry[0] })
  }

  render () {
    const { id, data, isExpand } = this.state
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
        label: '打样价格',
        valid: 'sampling_price',
        unit: '元',
        rules: [{ required: true, message: '请输入打样价格', pattern: /^\d+(\.\d+)?$/ }]
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
        unit: data && data.unit,
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
        label: '单价',
        valid: 'bulk_unit_price',
        unit: '元',
        rules: [{ required: true, message: '请输入单价', pattern: /^\d+(\.\d+)?$/ }]
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
                                   {getFieldDecorator('BOM__include_express_fee__' + item.serial, { initialValue: item.include_express_fee || 1 })(
                                     <RadioGroup >
                                       <Radio value={1}> 包含运费 </Radio>
                                       <Radio value={0}> 不包含运费 </Radio>
                                     </RadioGroup>
                                   )}
                                 </FormItem>
                               </Col>
                               <Col span={12}>
                                 <FormItem {...formItemLayout} label="供应商选择">
                                   {getFieldDecorator('BOM__supplier_id__' + item.serial, { rules: [{ required: true, message: '请选择供应商'}] })(
                                     <Select placeholder="请选择">
                                       {
                                         orgList.map(item => (
                                           <Option key={item.id} value={item.id}> {item.name_official || item.name_cn} </Option>
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
          <Button type="primary" onClick={this.handleSubmit}> 保存报价 </Button>
          <Link to={`/main/offer-info/${id}`}>
            <Button> 返回 </Button>
          </Link>
        </div>
      </div>
    ) : null
  }
}
