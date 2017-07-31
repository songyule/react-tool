import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as managementActions from 'actions/management'
import { Card, Collapse, Form, Col, Input, Radio, Select } from 'antd'
const [ Panel, FormItem, RadioGroup, Option, TextArea ] = [ Collapse.Panel, Form.Item, Radio.Group, Select.Option, Input.TextArea ]

@connect(
  state => state,
  dispatch => bindActionCreators({ ...managementActions }, dispatch)
)
export default class BomCollapse extends PureComponent {
  componentWillMount () {
    this.props.getOrgList({ limit: 10000 })
  }

  render () {
    const { orgList, material } = this.props

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    const formItemFullColLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }

    const materialItemConfig = [
      {
        label: 'BOM行号',
        valid: 'material_serial'
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

    return (
      <Collapse>
        <Panel header="展开物料详情" key="1">
          <Card title="物料" style={{ marginBottom: '15px' }}>
            {materialItemConfig.map(config => (
              <Col key={config.valid} span={12}>
                <FormItem {...formItemLayout} label={config.label}>
                  <Input disabled value={material[config.valid]} />
                </FormItem>
              </Col>
            ))}
            <Col span={12}>
              <FormItem {...formItemLayout} label="包含运费">
                <RadioGroup value={material.include_express_fee} disabled>
                  <Radio value={1}> 包含运费 </Radio>
                  <Radio value={0}> 不包含运费 </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="供应商选择">
                <Select placeholder="请选择" value={material.supplier_id} disabled>
                  {
                    orgList.map(item => (
                      <Option key={item.id} value={item.id}> {item.name_official || item.name_cn} </Option>
                    ))
                  }
                </Select>
              </FormItem>
            </Col>
            {materialItemWithUnitConfig.map(config => (
              <Col key={config.valid} span={12}>
                <FormItem {...formItemLayout} label={config.label}>
                  <Input
                    disabled
                    addonAfter={config.unit && <span>{config.unit}</span>}
                    value={material[config.valid]}
                  />
                </FormItem>
              </Col>
            ))}
            {materialItemFullColConfig.map(config => (
              <Col key={config.valid} span={24}>
                <FormItem {...formItemFullColLayout} label={config.label}>
                  <Input disabled />
                </FormItem>
              </Col>
            ))}
            <Col span={24}>
              <FormItem {...formItemFullColLayout} label="备注">
                <TextArea rows={4} value={material.comment} disabled/>
              </FormItem>
            </Col>
          </Card>
        </Panel>
      </Collapse>
    )
  }
}