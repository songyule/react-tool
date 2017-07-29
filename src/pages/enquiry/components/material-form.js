import React, { PureComponent } from 'react'
import { Form, Input, Row, Col, Radio, Switch, Select, Collapse } from 'antd'
const [FormItem, RadioGroup, Option, Panel] = [Form.Item, Radio.Group, Select.Option, Collapse.Panel]

@Form.create()

export default class MaterialForm extends PureComponent {
  render () {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }

    const formItemConfig = [
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

    const formItemWithUnitConfig = [
      {
        lable: 'BOM行号'
      },
      {
        lable: 'BOM行号'
      },
      {
        lable: 'BOM行号'
      },
      {
        lable: 'BOM行号'
      }
    ]

    return (
      <div>
         <Form>
           <Row>
             {formItemConfig.map(item => (
               <Col key={item.valid} span={12}>
                 <FormItem {...formItemLayout} label={item.label}>
                   {getFieldDecorator(item.valid, { initialValue: '1' })(
                     <Input disabled />
                   )}
                 </FormItem>
               </Col>
             ))}
           </Row>
         </Form>
      </div>
    )
  }
}
