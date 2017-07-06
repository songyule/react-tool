import React, { PureComponent } from 'react'
import { Input, Modal, Form } from 'antd'
import { createUser, editUser } from 'actions/org'

const FormItem = Form.Item

class linkman extends PureComponent {
  state = {
    visible: this.props.visible,
    userMes: {},
  }
  changeRadio (e) { // 点击单选按钮
    this.setState({
      radioDefalut: e.target.value
    })
  }

  handleCancel = (e) => { // 弹窗下面的取消
    this.setState({
      visible: false
    }, () => {
      let val = false
      this.props.callbackParent(val)
    })
  }

  handleOk = () => {
    this.handleSubmit()
  }

  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {}
        Object.assign(data, values)
        if (this.props.isCreate) {
          data.org_id = this.props.org_id
          createUser(data).then(res => {
            this.setState({
              visible: false
            }, () => {
              let val = false
              this.props.callbackParent(val)
            })
            if (res.code !== 200) return
            this.props.changeData(this.props.current, this.props.org_id)
          })
        } else {
          data.id = this.state.userMes.id
          editUser(data).then(res => {
            this.setState({
              visible: false
            }, () => {
              let val = false
              this.props.callbackParent(val)
            })
            if (res.code !== 200) return
            this.props.changeData(this.props.current, this.props.org_id)
          })
        }
      }
    })
  }

  componentWillReceiveProps (nextProps) { // props 更新时候触发
    this.setState({
      visible: nextProps.visible,
      userMes: nextProps.userMes
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
        <Modal title="新建用户" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout} // 布局
              label="用户名" // 次项的名称
              hasFeedback // 输入框后边的状态图标
            >
              {getFieldDecorator('name_cn', {
                initialValue: (this.state.userMes && this.state.userMes.name_cn) || '',
                rules: [{
                  required: true, message: '请填写用户名',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="手机号" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('mobile', {
                initialValue: (this.state.userMes && this.state.userMes.mobile) || '',
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
              {getFieldDecorator('mail', {
                initialValue: (this.state.userMes && this.state.userMes.mail) || '',
                rules: [],
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
