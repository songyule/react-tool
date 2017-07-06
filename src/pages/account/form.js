import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col, Radio, Select } from 'antd'
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option]

@Form.create()
export default class AccountForm extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    userName: PropTypes.string,
    loginName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string
  }

  handleSelectChange (v) {
    console.log(v)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 }
    }

    const formItemArr = [
      {
        label: '用户名',
        valid: 'userName',
        placeholder: '请输入用户名'
      },
      {
        label: '登录名',
        valid: 'loginName',
        placeholder: '请输入登录名'
      },
      {
        label: '手机号',
        valid: 'phone',
        placeholder: '请输入手机号'
      },
      {
        label: '邮箱',
        valid: 'email',
        placeholder: '请输入邮箱'
      }
    ]

    formItemArr.forEach((item, idx) => item.key = idx)

    const { id } = this.props

    return (
      <div className="account-form">
        <Form>
          <Row>
            <Col span={9}>
              <FormItem {...formItemLayout} label="ID">
                {getFieldDecorator('id', { initialValue: id })(
                    <Input placeholder="请输入ID" />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem {...formItemLayout} label="账号类型">
                {getFieldDecorator('type', { initialValue: 'a' })(
                  <RadioGroup>
                    <Radio value="a">辅料易账号</Radio>
                    <Radio value="b">客服账号</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            {
              formItemArr.map(item => (
                <Col key={item.key} span={9}>
                  <FormItem {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.valid, { initialValue: this.props[item.valid] })(
                      <Input placeholder={item.placeholder} />
                    )}
                  </FormItem>
                </Col>
              ))
            }
            <Col span={9}>
              <FormItem {...formItemLayout} label="状态">
                <Select defaultValue="lucy" onChange={this.handleSelectChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>Disabled</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={9}>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
