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
      current: props.location.pathname || '',
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

    const contentStyle = cs({
      [style.container__content]: true,
      'scroll-mark': true
    })

    // key跟router需要一样, 不然刷新的时候menu高亮的值会不正确
    const menuArr = [
      {
        key: 'front-management',
        title: '前台管理',
        children: [
          {
            key: '/main/topic',
            title: '专题文章',
            router: '/main/topic',
            icon: 'book'
          },
          {
            key: '/main/trend',
            title: '趋势文章',
            router: '/main/trend',
            icon: 'area-chart'
          }
        ]
      },
      {
        key: 'client',
        title: '客户档案',
        children: [
          {
            key: '/main/clientList',
            title: '客户列表',
            router: '/main/clientList',
            icon: 'exception'
          }
        ]
      },
      {
        key: 'supplier',
        title: '供应商档案',
        children: [
          {
            key: '/main/supplierList',
            title: '供应商列表',
            router: '/main/supplierList',
            icon: 'bars'
          }
        ]
      },
      {
        key: 'key02',
        title: '类目与商品管理',
        children: [
          {
            key: '/main/classes',
            title: '商城通用类目',
            router: '/main/classes'
          },
          {
            key: '/main/attributes',
            title: '属性管理',
            router: '/main/attributes'
          }
        ]
      },
      {
        key: 'key06',
        title: '账户与权限管理',
        children: [
          {
            key: '/main/account-list',
            title: '账户列表',
            router: '/main/account-list'
          }
        ]
      },
      {
        key: 'key07',
        title: '商品管理',
        children: [
          {
            key: '/main/goods',
            title: '商品列表',
            router: '/main/goods'
          }
        ]
      },
      {
        key: 'requirement',
        title: '需求管理',
        children: [
          {
            key: 'requirement-list',
            title: '需求单列表',
            router: '/main/requirement-list'
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
                                      <Icon type={item.icon || 'minus-square'} /><span>{item.title}</span>
                                    </Link>
                                  </Tooltip>
                                ) :
                                (<Link to={item.router}><div><Icon type={item.icon || 'minus-square'} /> <span>{item.title}</span></div></Link>)
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
            <div className={contentStyle}>
              <Route path='/main/clientList' component={ClientList} />
              <Route path='/main/supplierList' component={ClientList} />
              <Route path='/main/clientNew' component={CreatOrg} />
              <Route path='/main/supplierNew' component={CreatOrg} />
              <Route path='/main/clientEdit' component={OrgEdit} />
              <Route path='/main/supplierEdit' component={OrgEdit} />
              {/*文章相关 ====> */}
              <Route path='/main/topic' component={Topic}/>
              <Route path='/main/trend' component={Trend}/>
              <Route path='/main/add-topic' component={addTopic}/>
              <Route path='/main/edit-topic/:id' component={editTopic}/>
              <Route path='/main/add-trend' component={addTrend}/>
              <Route path='/main/edit-trend/:id' component={editTrend}/>
              {/*文章相关 <=== */}
              <Route path='/main/account-list' component={AccountList} />
              <Route path='/main/account-create' component={AccountCreate} />
              <Route path='/main/account-edit' component={AccountEdit} />
              <Route path='/main/classes' component={Classes} />
              <Route path='/main/attributes' component={Attributes} />
              {/*商品相关 ==== */}
              <Route path='/main/goods' component={Goods} />
              <Route path='/main/goods-edit/:id' component={GoodsEdit} />
              <Route path='/main/goods-content-edit/:id' component={GoodsContentEdit} />
              <Route path='/main/goods-create' component={GoodsCreate} />
              {/*打样相关 ==== */}
              <Route path='/main/requirement-list' component={RequirementList} />
            </div>
        </div>
      </div>
    )
  }
}
// <Route path='/main/sandwiches' component={} />

// 组件懒加载

// const Demo = asyncComponent(() => import ('components/demo/index'))
// const What = asyncComponent(() => import ('components/what/index'))
const ClientList = asyncComponent(() => import ('components/client/list'))
const CreatOrg = asyncComponent(() => import ('components/client/new'))
const OrgEdit = asyncComponent(() => import ('components/client/edit'))
const Topic = asyncComponent(() => import ('pages/topic/index'))
const Trend = asyncComponent(() => import ('pages/trend/index'))
const addTopic = asyncComponent(() => import ('pages/topic/add-topic'))
const editTopic = asyncComponent(() => import ('pages/topic/edit-topic'))
const addTrend = asyncComponent(() => import ('pages/trend/add-trend'))
const AccountList = asyncComponent(() => import ('pages/account/index'))
const AccountCreate = asyncComponent(() => import ('pages/account/create'))
const AccountEdit = asyncComponent(() => import ('pages/account/edit'))
const Classes = asyncComponent(() => import ('pages/classes'))
const Attributes = asyncComponent(() => import ('pages/attributes'))
const editTrend = asyncComponent(() => import ('pages/trend/edit-trend'))
const Goods = asyncComponent(() => import('pages/commodity/index'))
const GoodsEdit = asyncComponent(() => import('pages/commodity/edit'))
const GoodsContentEdit = asyncComponent(() => import('pages/commodity/content-edit'))
const GoodsCreate = asyncComponent(() => import('pages/commodity/create'))
const RequirementList = asyncComponent(() => import('pages/requirement/index'))
