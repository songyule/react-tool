import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { getOrgListOnce } from 'actions/management'
import { Form, Input, Radio, Select, Switch } from 'antd'
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option]

@Form.create()

export default class AttributesForm extends PureComponent {

  constructor () {
    super()

    this.state = {
      orgList: []
    }
  }

  static propTypes = {
    item: PropTypes.object
  }

  componentWillMount () {
    this.getProps(this.props)
    this.getList()
  }

  componentWillReceiveProps (nextProps) {
    this.getProps(nextProps)
  }

  getProps (props) {
    const { item } = props
    this.setState({
      isScalar: item.attr_type === 1 || true,
      isExclusive: !!item.org_id || false
    })
  }

  onAttrTypeChange = (e) => {
    this.setState({ isScalar: e.target.value === 1 })
  }

  onIsExclusiveChange = (e) => {
    this.setState({ isExclusive: e })
  }

  async getList () {
    const { data } = await getOrgListOnce({ limit: 10000 })
    console.log(data)
    this.setState({ orgList: data.org })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { isCreate } = this.props
    const { name_cn, attr_type, org_id, weight, value_str } = this.props.item
    console.log(this.props.item)
    const { isScalar, isExclusive, orgList } = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="属性名称">
            {getFieldDecorator('name', { initialValue: name_cn, rules: [{ required: true, message: '请输入名称'}] })(
                <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="属性类型">
            {getFieldDecorator('type', { initialValue: attr_type || 1 })(
              <RadioGroup onChange={this.onAttrTypeChange}>
                <Radio value={1}>标量属性</Radio>
                <Radio value={2}>非标量属性</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="专属属性" >
            {getFieldDecorator('isExclusive', { initialValue: !!org_id, valuePropName: 'checked' })(
              <Switch onChange={this.onIsExclusiveChange}/>
            )}
          </FormItem>
          {
            isExclusive
             ? (
               <FormItem {...formItemLayout} label="选择组织">
                 {getFieldDecorator('org', { initialValue: !!org_id && org_id, rules: [{ required: true, message: '请选择组织'}] })(
                   <Select onChange={this.handleSelectChange}>
                     {
                       orgList.map(item => (
                         <Option key={item.id} value={item.id}> {item.name_official || item.name_cn} </Option>
                       ))
                     }
                   </Select>
                 )}
               </FormItem>
             )
             : null
          }
          <FormItem {...formItemLayout} label="权重">
            {getFieldDecorator('weight', { initialValue: weight, rules: [{ required: true, message: '请输入权重'}] })(
                <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={isScalar ? 'num' : '描述'}>
            {getFieldDecorator('value', { initialValue: value_str, rules: [{ required: true, message: '请输入'}] })(
                <Input />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}
