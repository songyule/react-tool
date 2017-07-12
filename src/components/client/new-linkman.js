import React, { PureComponent } from 'react'
import { Input, Modal, Form, Radio, Select } from 'antd'

const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group

class linkman extends PureComponent {
  state = {
    visible: this.props.visible
  }
  changeRadio (e) { // 点击单选按钮
    this.setState({
      radioDefalut: e.target.value
    })
  }

  handleCancel = (e) => { // 弹窗下面的取消
    this.setState({
      visible: false
    })
  }
  handleOk = () => {
    this.handleSubmit()
  }

  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
      } else {
        console.log(err)
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    return (
      <div>
        <Modal title="新建组织" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout} // 布局
              label="类型" // 次项的名称
              hasFeedback // 输入框后边的状态图标
            >
              {getFieldDecorator('type', {
                rules: [{
                  required: true, message: '请填写类型',
                }],
              })(
                <RadioGroup>
                  <Radio value="1">联系人</Radio>
                  <Radio value="2">收货联系人</Radio>
                  <Radio value="3">发票联系人</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="姓名" // 次项的名称
              hasFeedback // 输入框后边的状态图标
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请填写姓名',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="性别" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('gander', {
                rules: [{
                  required: true, message: '请选择性别',
                }],
              })(
                <Select>
                  <Option value="0">先生</Option>
                  <Option value="1">女士</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="部门" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('dept', {
                rules: [{
                  required: true, message: '请填写部门',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="职位" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('post', {
                rules: [{
                  required: true, message: '请填写职位',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="电话" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('orgTel', {
                rules: [{
                  pattern: /^1[34578]\d{9}$/, message: '手机号格式不正确', trigger: 'none'
                },{
                  required: true, message: '请填写联系电话',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="邮箱" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('email', {
                rules: [{
                  required: true, message: '请填写邮箱',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="地址" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('address', {
                rules: [{
                  required: true, message: '请填写公司地址',
                }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(linkman)
