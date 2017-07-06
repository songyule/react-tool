import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// import { Input, Form, Button } from 'antd'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import style from './login.css'
import * as userActions from 'actions/user';
import logo from './logo-base64'
import TweenOne from 'rc-tween-one';
import ticker from 'rc-tween-one/lib/ticker';
import { Input, Button, Form } from 'antd';
// import enquire from 'enquire.js';


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
    this.props.history.push('/main/topic')
  }

  render () {
    const { getFieldDecorator, getFieldError } = this.props.form
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
            <Form.Item className={style['login__code-item']}>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入验证码' }]
              })(
                <Input className={style['login__code-input']} onChange={this.changeCode} placeholder="验证码"></Input>
              )}
              <Button className={style['login__code-btn']} type="primary" ghost onClick={this.clickCode} disabled={ getFieldError('mobile') }>获取验证码</Button>
            </Form.Item>
            <Button type='primary' style={{width: '100%'}} onClick={this.handleLogin}>登录</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(LoginForm)




class LogoGather extends React.Component {
  static propTypes = {
    image: PropTypes.string,
    w: PropTypes.number,
    h: PropTypes.number,
    pixSize: PropTypes.number,
    pointSizeMin: PropTypes.number,
  };

  static defaultProps = {
    image: logo,
    className: 'logo-gather-demo',
    w: 300,
    h: 300,
    pixSize: 20,
    pointSizeMin: 10,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.interval = null;
    this.gather = true;
    this.intervalTime = 9000;
  }

  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this);
    this.createPointData();
  }

  componentWillUnmount() {
    ticker.clear(this.interval);
    this.interval = null;
  }

  onMouseEnter = () => {
    // !this.gather && this.updateTweenData();
    if (!this.gather) {
      this.updateTweenData();
    }
    this.componentWillUnmount();
  };

  onMouseLeave = () => {
    // this.gather && this.updateTweenData();
    if (this.gather) {
      this.updateTweenData();
    }
    this.interval = ticker.interval(this.updateTweenData, this.intervalTime);
  };

  setDataToDom(data, w, h) {
    this.pointArray = [];
    const number = this.props.pixSize;
    for (let i = 0; i < w; i += number) {
      for (let j = 0; j < h; j += number) {
        if (data[((i + j * w) * 4) + 3] > 150) {
          this.pointArray.push({ x: i, y: j });
        }
      }
    }
    const children = [];
    this.pointArray.forEach((item, i) => {
      const r = Math.random() * this.props.pointSizeMin + this.props.pointSizeMin;
      const b = Math.random() * 0.4 + 0.1;
      children.push(
        <TweenOne className="point-wrapper" key={i} style={{ left: item.x, top: item.y }}>
          <TweenOne
            className="point"
            style={{
              width: r,
              height: r,
              opacity: b,
              backgroundColor: `rgb(${Math.round(Math.random() * 95 + 160)},255,255)`,
            }}
            animation={{
              y: (Math.random() * 2 - 1) * 10 || 5,
              x: (Math.random() * 2 - 1) * 5 || 2.5,
              delay: Math.random() * 1000,
              repeat: -1,
              duration: 3000,
              yoyo: true,
              ease: 'easeInOutQuad',
            }}
          />
        </TweenOne>
      );
    });
    this.setState({
      children,
      boxAnim: { opacity: 0, type: 'from', duration: 800 },
    }, () => {
      this.interval = ticker.interval(this.updateTweenData, this.intervalTime);
    });
  }

  createPointData = () => {
    const { w, h } = this.props;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    canvas.width = this.props.w;
    canvas.height = h;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      this.setDataToDom(data, w, h);
      this.dom.removeChild(canvas);
    };
    img.crossOrigin = 'anonymous';
    img.src = this.props.image;
  };

  gatherData = () => {
    const children = this.state.children.map(item =>
      React.cloneElement(item, {
        animation: {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          delay: Math.random() * 500,
          duration: 800,
          ease: 'easeInOutQuint',
        },
      })
    );
    this.setState({ children });
  };

  disperseData = () => {
    const rect = this.dom.getBoundingClientRect();
    const sideRect = this.sideBox.getBoundingClientRect();
    const sideTop = sideRect.top - rect.top;
    const sideLeft = sideRect.left - rect.left;
    const children = this.state.children.map(item =>
      React.cloneElement(item, {
        animation: {
          x: Math.random() * rect.width - sideLeft - item.props.style.left,
          y: Math.random() * rect.height - sideTop - item.props.style.top,
          opacity: Math.random() * 0.4 + 0.1,
          scale: Math.random() * 2.4 + 0.1,
          duration: Math.random() * 500 + 500,
          ease: 'easeInOutQuint',
        },
      })
    );

    this.setState({
      children,
    });
  };

  updateTweenData = () => {
    this.dom = ReactDOM.findDOMNode(this);
    this.sideBox = ReactDOM.findDOMNode(this.sideBoxComp);
    ((this.gather && this.disperseData) || this.gatherData)();
    this.gather = !this.gather;
  };

  render() {
    return (<div className="logo-gather-demo-wrapper">
      <canvas id="canvas" />
      <TweenOne
        animation={this.state.boxAnim}
        className="right-side blur"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={(c) => {
          this.sideBoxComp = c;
        }}
      >
        {this.state.children}
      </TweenOne>
    </div>);
  }
}