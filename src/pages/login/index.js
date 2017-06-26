import React, { PureComponent } from 'react'
import { Input, Form, Button } from 'antd'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import style from './login.css'
import * as userActions from 'actions/user';

@connect(
  state => state,
  dispatch => bindActionCreators(userActions, dispatch)
)
class LoginForm extends PureComponent {
  state = {
    mobile: '',
    code: ''
  }

  constructor () {
    super()

    this.clickCode = this.clickCode.bind(this)
  }

  clickCode = (e) => {
    // console.log(this)
    console.log(this)
    this.props.sendVerify({ mobile: this.state.mobile })
  }

  changeMobile = (e) => {
    this.setState({
      mobile: e.target.value
    })
  }

  changeCode = (e) => {
    this.setState({
      code: e.target.value
    })
  }

  handleLogin = () => {
    this.props.login({ mobile: this.state.mobile, code: this.state.code })
  }

  render () {
    const { getFieldDecorator, getFieldError } = this.props.form
    return (
      <div className="page_login">
        <div className={style.login__box}>
          <h3 className={style.login__title}>百一度管理系统</h3>
          <Form>
            <Form.Item>
              {getFieldDecorator('mobile', {
                rules: [
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[34578]\d{9}$/, message: '手机号格式不正确', trigger: 'none' }
                ]
              })(
                <Input className={style['login__name-input']} onChange={this.changeMobile} placeholder="请输入手机号"></Input>
              )}

            </Form.Item>
            <Form.Item className={style['login__code-item']}>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入验证码' }]
              })(
                <Input className={style['login__code-input']} onChange={this.changeCode} placeholder="验证码"></Input>
              )}
              <Button className={style['login__code-btn']} onClick={this.clickCode} disabled={ getFieldError('mobile') }>获取验证码</Button>
            </Form.Item>
            <Button onClick={this.handleLogin}>登录</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(LoginForm)
