import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import style from './login.css'
import * as userActions from 'actions/user';
import logo from './logo-base64'
import { Input, Button, Form, Row, Col } from 'antd';
import LogoGather from './components/logoGather'
import { countdown } from 'utils'

@connect(
  state => state,
  dispatch => bindActionCreators(userActions, dispatch)
)
@Form.create()
export default class LoginForm extends PureComponent {
  state = {
    mobile: '',
    code: '',
    time: 0
  }

  constructor () {
    super()

    this.clickCode = this.clickCode.bind(this)
  }

  clickCode = (e) => {
    this.props.sendVerify({ mobile: this.state.mobile })
    this.setState({
      time: 60
    })
    countdown({
      sec: 60,
      update: () => {
        this.setState({time: this.state.time - 1})
      }
    }).then(res => {
      console.log('倒计时结束')
    })
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
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.login({ mobile: this.state.mobile, code: this.state.code }).then(res => this.props.history.push('/main/topic'))
    })
  }

  render () {
    const { getFieldDecorator, getFieldError } = this.props.form
    const { time } = this.state
    console.log(getFieldDecorator)
    return (
      <div className={style.login}>

        <LogoGather
          image={logo}
          w={400}
          h={400}
          pixSize={15}
          pointSizeMin={14}
        />

        <div className={style.login__box}>
          <h2 className={style.login__title}>百一度管理系统</h2>
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
            <Form.Item>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入验证码' }]
              })(
                <Row type="flex" justify="space-between" style={{paddingRight: '23px'}}>
                  <Col span={16}>
                    <Input onChange={this.changeCode} placeholder="验证码"></Input>
                  </Col>
                  <Col span={6}>
                    <Button type="primary" style={{width: '92px'}} ghost onClick={this.clickCode} disabled={ getFieldError('mobile') || time > 0 }>
                      {
                        time > 0 ? `${time}秒` : '获取验证码'
                      }
                    </Button>
                  </Col>
                </Row>
              )}
            </Form.Item>
            <Button type='primary' style={{width: '100%', height: '36px'}} onClick={this.handleLogin}>登录</Button>
          </Form>
        </div>
      </div>
    )
  }
}
