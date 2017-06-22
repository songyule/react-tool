import React, { Component } from 'react'
import style from './main.css'
import { Menu, Row, Col } from 'antd'
import { Link, Route } from 'react-router-dom'
// import { getHomeData } from 'actions'
import { asyncComponent } from 'router/utils'
// import Ueditor from 'components/ueditor/index'

export default class extends Component {
  state = {
    current: 'mail'
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }

  async componentDidMount() {
    // getHomeData({
    //   body: 123
    // }).then(res => {
    //   console.log(res)
    // })
  }

  render() {
    return (
      <div className={style.container}>
        <Row>
          <Col lg={{ span: 4 }} md={{ span: 4 }} sm={{ span: 0 }} xs={{ span: 0 }}>
            <Menu
              className={style.header__menu}
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
            >
              <Menu.Item key="mail">
                <Link to="/main/tacos">tacos</Link>
              </Menu.Item>
              <Menu.Item key="app">
                <Link to="/main/sandwiches">Sandwiches</Link>
              </Menu.Item>
              <Menu.Item key="what">
                <Link to="/main/what">what/123</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col lg={{ span: 20 }} md={{ span: 20 }} sm={{ span: 24 }} xs={{ span: 24 }}>
            <div className={style.container__content}>
              <Route path='/main/tacos' component={What}/>
              <Route path='/main/sandwiches' component={Demo} />
              <Route path='/main/what' component={Ueditor}/>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

// 组件懒加载

const Demo = asyncComponent(() => import ('components/demo/index'))
const What = asyncComponent(() => import ('components/what/index'))
const Ueditor = asyncComponent(() => import ('components/ueditor/index'))
