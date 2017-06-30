import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Table } from 'antd'
const TabPane = Tabs.TabPane

export default class AccountTabs extends PureComponent {
  static propTypes = {
    text: PropTypes.string
  }

  constructor () {
    super()
    this.state = {
      list: [
        {
          time: '2017-6-30 17:30',
          ip: '127.0.0.1',
          browser: 'safari',
          system: 'macOS X'
        },
        {
          time: '2017-6-30 17:30',
          ip: '127.0.0.1',
          browser: 'chrome',
          system: 'Linux'
        },
        {
          time: '2017-6-30 17:30',
          ip: '127.0.0.1',
          browser: 'IE',
          system: 'windows'
        }
      ]
    }
  }

  callback (v) {
    console.log(v)
  }

  render () {

    const columns = [
      {
        title: '时间',
        dataIndex: 'time'
      },
      {
        title: 'IP',
        dataIndex: 'ip'
      },
      {
        title: '浏览器',
        dataIndex: 'browser'
      },
      {
        title: '操作系统',
        dataIndex: 'system'
      },
    ]

    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="权限角色" key="1">Content of Tab Pane 1</TabPane>
        <TabPane tab="登录历史" key="2">
          <Table
            rowKey="dataIndex"
            dataSource={this.state.list}
            columns={columns}
          />
        </TabPane>
      </Tabs>
    )
  }
}
