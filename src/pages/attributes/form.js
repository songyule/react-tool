import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Select, Switch } from 'antd'
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option]

@Form.create()

export default class AttributesForm extends PureComponent {

  static propTypes = {
    name: PropTypes.string,
    checked: PropTypes.bool,
  }

  componentWillMount (nextProps) {
    this.getProps()
  }

  getProps () {
    const { type, checked } = this.props
    this.setState({
      isScalar: type || true,
      isExclusive: checked || false
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
    })
  }

  handleSelectChange () {

  }

  onAttrTypeChange = (e) => {
    this.setState({
      isScalar: e.target.value
    })
  }

  onIsExclusiveChange = (e) => {
    console.log(e)
    this.setState({
      isExclusive: e
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { id, type, checked } = this.props
    console.log(type, checked)
    const { isScalar, isExclusive } = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="属性名称">
            {getFieldDecorator('id', { initialValue: id })(
                <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="属性类型">
            {getFieldDecorator('type', { initialValue: type || true })(
              <RadioGroup onChange={this.onAttrTypeChange}>
                <Radio value>标量属性</Radio>
                <Radio>非标量属性</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="专属属性" >
            {getFieldDecorator('switch')(
              <Switch defaultChecked={checked} onChange={this.onIsExclusiveChange}/>
            )}
          </FormItem>
          {
            isExclusive
             ? (
               <FormItem {...formItemLayout} label="状态">
                 <Select defaultValue="lucy" onChange={this.handleSelectChange}>
                   <Option value="jack">Jack</Option>
                   <Option value="lucy">Lucy</Option>
                   <Option value="disabled" disabled>Disabled</Option>
                   <Option value="Yiminghe">yiminghe</Option>
                 </Select>
               </FormItem>
             )
             : null
          }
          <FormItem {...formItemLayout} label="权重">
            {getFieldDecorator('id', { initialValue: id })(
                <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={isScalar ? 'num' : '描述'}>
            {getFieldDecorator('id', { initialValue: id })(
                <Input />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}
