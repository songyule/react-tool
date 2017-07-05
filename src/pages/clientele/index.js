import React, { PureComponent } from 'react'
import { Menu, Layout, Icon } from 'antd'
import { Link, Route } from 'react-router-dom'
// import ClientList from 'components/client/list.js'
import What from 'components/what/index'

const { SubMenu } = Menu
const { Content, Sider } = Layout

export default class clientele extends PureComponent {

  render () {
    return (
      <div>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                <Menu.Item key="1">
                  <Link to="/cl">客户列表</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/kehu">客户测试</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              // <Route path='/client' exact render={() => (<ClientList test="222"/>)} />
              <Route path='/client/test' component={What}/>
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
}
