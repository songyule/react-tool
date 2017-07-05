import React, { PureComponent } from 'react'
import style from './try.css'
import PropTypes from 'prop-types'
import { Tag } from 'antd'

export default class extends PureComponent {
  state = {
    liked: true,
    name: [1, 2, 3],
    val: 0,
    arr: [
      <h1 key="1">测试的标题啊</h1>,
      <h2 key="2">我也是测试的标题啊</h2>
    ],
    value: '123',
    tags: ['tag1', 'tag2', 'tag3'],
    inputVisible: false,
    inputValut: ''
  }
  constructor(props) {
    super(props)
    console.log(this)
    this.toggle = this.toggle.bind(this)
    this.stateTest = this.stateTest.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  static PropTypes = {
    title: PropTypes.string.isRequired
  }
  toggle () {
    this.setState({ // 异步方法，拥有一个回调参数。每一次修改都会重新渲染，可能发生不必要的渲染。对于复杂的组件，并不能有效的管理所有组件状态，造成不必要渲染和相关生命周期钩子一直被调用。其他和渲染无关的状态，可以直接以属性的形式保存在组件中，在需要的时候调用和改变，不会造成渲染。
      liked: !this.state.liked
    }, () => {
      console.log(this.state.liked, 'success: 我在回调中，所以我正确')
    })
    console.log(this.state.liked, 'error：异步函数，我错了')
  }
  stateTest () {
    this.setState({val: this.state.val + 1})

    this.setState({val: this.state.val + 1})

    setTimeout(() => {
      this.setState({val: this.state.val + 1})

      this.setState({val: this.state.val + 1})
    }, 0)
  }
  handleClick () {
    console.log(49)
    if (this.refs.myTextInput.value <= 0) {
      this.refs.myTextInput.value = 0 || ''
    }
    // this.refs.myTextInput.focus()
    console.log(this.refs.myTextInput.name)
  }
  gotoAnt () {
    console.log(this.props)
    // this.context.router.push({
    //   pathname: '/src/components/try/antdesign.js'
    // })
    this.props.history.push('/antdesign')
  }
  what () {
    console.log(54)
  }
  getInitialState () { // 没起作用
    return {
      first: 'false',
      value: 'hello'
    }
  }
  componentWillMount() {
    console.log('DOM渲染之前请求,只触发一次')
  }
  componentWillUnmount () { // lifecycle callback function
    console.log('组件卸载前')
  }
  componentDidMount() {
    console.log('相当于window.onload,在render之后执行，只触发一次')
  }
  render () {
    let text = this.state.liked ? 'true' : 'false'
    let one = this.state.first
    let value = this.state.value
    return (
      <div className={style.box}>
        <span name="233" onClick={this.toggle}>2333333</span>
        <span>{text}</span>
        <div>
          {
            this.state.name.map((item, index) => {
              return <div key={index}>hello, {item}</div>
            })
          }
        </div>
        <div>{this.state.arr}</div>
        <div>{one}</div>
        <input type="number" ref="myTextInput" name="233" onChange={this.handleClick} value={value}/>
        <input type="button" value="focus the text input" onClick={this.handleClick} onMouseOver={this.what}/>
        <div>
          <Tag>1111</Tag>
          <Tag>2222</Tag>
          <Tag>3333</Tag>
        </div>
        <span onClick={this.gotoAnt.bind(this)}>go</span>
      </div>
    )
  }
}