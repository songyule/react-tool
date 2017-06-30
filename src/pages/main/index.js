import React, { Component } from 'react'
import style from './main.css'
import Header from 'components/header'
import { Menu, Icon, Tooltip } from 'antd'
import { Link, Route } from 'react-router-dom'
import { asyncComponent } from 'router/utils'

import cs from 'classnames'//引入classnames依赖库

const SubMenu = Menu.SubMenu;

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      current: 'mail',
      isFold: false
    }
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }

  controlMenu = (e) => {
    this.setState({
      isFold: !this.state.isFold
    })
  }

  async componentDidMount() {
  }

  render() {
    const menuStyle = cs({
      [style.container__menu]: true,
      [style.container__menu__fold]: this.state.isFold
    })

    const menuArr = [
      {
        key: 'key01',
        title: '前台管理',
        children: [
          {
            key: 'topic',
            title: '专题文章',
            router: '/main/topic'
          },
          {
            key: 'trend',
            title: '趋势文章',
            router: '/main/trend'
          },
          {
            key: 'chil02',
            title: 'Option2',
            router: '/main/tacos'
          },
          {
            key: 'chil03',
            title: 'Option3',
            router: '/main/option3'
          },
          {
            key: 'chil04',
            title: 'Option4',
            router: '/main/option4'
          }
        ]
      },
      {
        key: 'key02',
        title: '账户与权限管理',
        children: [
          {
            key: 'chil01',
            title: '账户列表',
            router: '/main/account-list'
          }
        ]
      }
    ]

    return (
      <div style={{ height: '100%' }}>
        <Header></Header>
        <div className={style.container}>
            <div className={menuStyle}>
              <div className={style.menu__control} onClick={this.controlMenu}><Icon type="bars"></Icon></div>
              <Menu
                theme={'dark'}
                mode="inline"
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
              >
                {
                  menuArr.map(sub => (
                      <SubMenu key={sub.key} title={
                        this.state.isFold ? (
                          <Tooltip placement="right" title={<span>{sub.title}</span>}>
                            <div>
                              <Icon type="caret-right" /><span>{sub.title}</span>
                            </div>
                          </Tooltip>
                        ) : (
                          <span><Icon type="caret-right" /><span>{sub.title}</span></span>
                        )
                      }>
                        {
                          sub.children && sub.children.map(item => (
                            <Menu.Item key={item.key}>
                              {
                                this.state.isFold ?
                                (
                                  <Tooltip placement="right" title={<span>{item.title}</span>}>
                                    <Link to={item.router}>
                                      <Icon type="minus-square" /><span>{item.title}</span>
                                    </Link>
                                  </Tooltip>
                                ) :
                                (<Link to={item.router}><div><Icon type="minus-square" /> <span>{item.title}</span></div></Link>)
                              }
                            </Menu.Item>
                          ))
                        }
                      </SubMenu>
                    )
                  )
                }
              </Menu>
            </div>
            <div className={style.container__content}>
              <Route path='/main/topic' component={Topic}/>
              <Route path='/main/trend' component={Trend}/>
              <Route path='/main/add-topic' component={addTopic}/>
              <Route path='/main/add-trend' component={addTrend}/>
              <Route path='/main/tacos' component={What}/>
              <Route path='/main/sandwiches' component={Demo} />
              <Route path='/main/account-list' component={AccountList} />
              <Route path='/main/account-create' component={AccountCreate} />
              <Route path='/main/account-edit' component={AccountEdit} />
            </div>
        </div>
      </div>
    )
  }
}
// <Route path='/main/sandwiches' component={} />

// 组件懒加载

const Topic = asyncComponent(() => import ('pages/topic/index'))
const Trend = asyncComponent(() => import ('pages/trend/index'))
const addTopic = asyncComponent(() => import ('pages/topic/add-topic'))
const addTrend = asyncComponent(() => import ('pages/trend/add-trend'))
// const What = asyncComponent(() => import ('components/what/index'))
const Demo = asyncComponent(() => import ('components/demo/index'))
const What = asyncComponent(() => import ('components/what/index'))
const AccountList = asyncComponent(() => import ('pages/account/index'))
const AccountCreate = asyncComponent(() => import ('pages/account/create'))
const AccountEdit = asyncComponent(() => import ('pages/account/edit'))


// const Ueditor = asyncComponent(() => import ('components/ueditor/index'))
