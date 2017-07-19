import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import style from './form.css'
import { connect } from 'react-redux'
import { Form, Input, Row, Col, Radio, Switch, Select } from 'antd'
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option]

@Form.create()
@connect (
  state => state
)

export default class AccountForm extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    userName: PropTypes.string,
    loginName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.bool,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    email: ''
  }

  constructor () {
    super()

    this.state = {
      showOrgList: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.resetForm) {
      this.props.form.resetFields()
      this.setState({
        showOrgList: !!(this.props.isPersonal || this.props.orgId !== '9e761a02f5d74d3494395a3e46c824e7')
      })
    }
  }

  onRadioChange = (e) => {
    this.setState({ showOrgList: e.target.value === 'b' })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }

    const formItemArr = [
      {
        label: '用户名',
        valid: 'userName',
        placeholder: '请输入用户名',
        rules: [{ required: true, message: '请输入用户名'}]
      },
      {
        label: '手机号',
        valid: 'phone',
        placeholder: '请输入手机号',
        rules: [{ pattern: /^1[34578]\d{9}$/, required: true, message: '手机号格式不正确'}]
      },
      {
        label: '邮箱',
        valid: 'email',
        placeholder: '请输入邮箱'
      }
    ]

    formItemArr.forEach((item, idx) => item.key = idx)
    const { id, status, disabled, roleList, role = '', isPersonal, orgList } = this.props
    const { showOrgList } = this.state

    return (
      <div className={style['account-form']}>
        <Form>
          <Row>
            {
              id && (
                <Col span={12}>
                  <FormItem {...formItemLayout} label="ID">
                    {getFieldDecorator('id', { initialValue: id })(
                        <Input disabled/>
                    )}
                  </FormItem>
                </Col>
              )
            }
            {
              !isPersonal
                ? (
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="账号类型">
                      {getFieldDecorator('type', { initialValue: 'a' })(
                        <RadioGroup disabled={disabled} onChange={this.onRadioChange}>
                          <Radio value="a">辅料易账号</Radio>
                          <Radio value="b">客户账号</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                )
                : null
            }
            <Col span={12}>
              <FormItem {...formItemLayout} label="状态">
                {getFieldDecorator('status',{ initialValue: status, valuePropName: 'checked' })(
                  <Switch disabled={disabled}/>
                )}
              </FormItem>
            </Col>
            {
              formItemArr.map(item => (
                <Col key={item.key} span={12}>
                  <FormItem {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.valid, { initialValue: this.props[item.valid], rules: item.rules })(
                      <Input disabled={disabled} placeholder={item.placeholder} />
                    )}
                  </FormItem>
                </Col>
              ))
            }
            <Col span={12}>
              <FormItem {...formItemLayout} label="权限角色">
                {
                  isPersonal
                    ? (
                      <Select defaultValue="个人" disabled>
                        <Option  value="个人"> 个人 </Option>
                      </Select>
                    )
                    : getFieldDecorator('role', { initialValue: role.toString(), rules: [{ required: true, message: '请选择角色'}] })(
                      <Select disabled={disabled} onChange={this.handleSelectChange}>
                        {
                          roleList.map(item => (
                            <Option key={item.id} value={item.id.toString()}> {item.name} </Option>
                          ))
                        }
                      </Select>
                    )
                }
              </FormItem>
            </Col>
            {
              showOrgList
                ? (
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="选择组织">
                      {getFieldDecorator('org', { rules: [{ required: true, message: '请选择组织'}] })(
                        <Select onChange={this.handleSelectChange}>
                          {
                            orgList.map(item => (
                              <Option key={item.id} value={item.id}> {item.name_official || item.name_cn} </Option>
                            ))
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                )
                : null
            }
          </Row>
        </Form>
      </div>
    )
  }
}
