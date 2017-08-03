import React, { PureComponent } from 'react'
import style from './css/dev.css'
import { Form, Icon, Input, Row, Col, Checkbox, Radio, Select, Collapse } from 'antd'
const [FormItem, Option] = [Form.Item, Radio.Group, Select.Option, Collapse.Panel, Input.TextArea]

@Form.create()

export default class Dev extends PureComponent {
  render () {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    const formItemFullColLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }

    const devFields = [
      { label: '趋势把握', options:[{ id: 1, value: 1, label: 'option1' }, { id: 2, value: 2, label: 'option2' }] },
      { label: '研发周期', options:[{ id: 3, value: 1, label: 'option1' }, { id: 4, value: 2, label: 'option2' }] },
      { label: '设计师数量', options:[{ id: 5, value: 1, label: 'option1' }, { id: 6, value: 2, label: 'option2' }] },
      { label: '样品费', options:[{ id: 7, value: 1, label: 'option1' }, { id: 8, value: 2, label: 'option2' }] }
    ]

    const purchaseFields = [
      { label: '采购模式', isMult: true, options:[{ id: 1, value: 1, label: 'option1' }, { id: 2, value: 2, label: 'option2' }] },
      { label: '大货确定方式', options:[{ id: 3, value: 1, label: 'option1' }, { id: 4, value: 2, label: 'option2' }] },
      { label: '大货周期', options:[{ id: 5, value: 1, label: 'option1' }, { id: 6, value: 2, label: 'option2' }] },
      { label: '逾期风险', options:[
        { id: 7, value: 1, label: 'option1' },
        { id: 8, value: 1, label: 'option1' },
        { id: 9, value: 1, label: 'option1' },
        { id: 10, value: 1, label: 'option1' },
        { id: 11, value: 1, label: 'option1' },
        { id: 12, value: 1, label: 'option1' },
        { id: 13, value: 1, label: 'option1' },
        { id: 14, value: 1, label: 'option1' },
        { id: 15, value: 2, label: 'option2' }
      ]
      }
    ]

    return (
      <div>
        <Form>
          <Row>
            <Col span={24}><h3 className={style['header']}> 研发模式： </h3></Col>
            {devFields.map(field => (
              <Col key={field.label} span={12}>
                <FormItem {...formItemLayout} label={field.label}>
                  {getFieldDecorator('supplier_id')(
                    <Select placeholder="请选择">
                      {field.options.map(option => (
                        <Option key={option.id} value={String(option.id)}> {option.label} </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            ))}
            <Col span={24}><div className={style['line']} /></Col>
            <Col span={24}><h3 className={style['header']}> 采购信息： </h3></Col>
            {purchaseFields.map(field => (
              <Col key={field.label} span={12}>
                <FormItem {...formItemLayout} label={field.label} style={{position: 'relative'}}>
                  {getFieldDecorator('supplier_id')(
                    <div>
                      <Select placeholder="请选择" mode={field.isMult && 'multiple'} style={{cursor: 'pointer'}}>
                        {field.options.map(option => (
                          <Option key={option.id} value={String(option.id)}> {option.label} </Option>
                        ))}
                      </Select>
                      {field.isMult && <Icon type="plus-square-o" style={{position: 'absolute', right: '10px', top: '10px', userSelect: 'none' }}/>}
                    </div>
                  )}
                </FormItem>
              </Col>
            ))}
            <Col span={24}>
              <FormItem {...formItemFullColLayout} label="逾期风险">
                {getFieldDecorator('check')(
                  <div>
                    <Row style={{height: '200px', overflowY: 'scroll'}}>
                      {purchaseFields[3].options.map(option => (
                        <Col key={option.id} span={24}><Checkbox value={String(option.id)}> {option.label} </Checkbox></Col>
                      ))}
                    </Row>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </div>
    )
  }
}
