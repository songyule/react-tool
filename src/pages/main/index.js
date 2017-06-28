import React, { Component } from 'react'
import style from './main.css'
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
        title: 'navigator one',
        children: [
          {
            key: 'chil01',
            title: 'Option1',
            router: '/main/option1'
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
      }
    ]

    return (
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
              <Route path='/main/tacos' component={What}/>
              <Route path='/main/sandwiches' component={Demo} />
            </div>
      </div>
    )
              // <Route path='/main/what' component={Ueditor}/>
  }
}

// 组件懒加载

const Demo = asyncComponent(() => import ('components/demo/index'))
const What = asyncComponent(() => import ('components/what/index'))
// const Ueditor = asyncComponent(() => import ('components/ueditor/index'))
