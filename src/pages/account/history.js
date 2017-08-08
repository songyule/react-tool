import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { connect } from 'react-redux'
import { getLogs } from 'actions/user'
import { format } from 'utils/index'

@connect (state => state)

export default class History extends PureComponent {

  static propTypes = {
    id: PropTypes.string
  }

  constructor () {
    super()

    this.state = {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        onChange: this.changePage
      }
    }
  }

  componentWillMount () {
    this.getLogsList()
  }

  async getLogsList () {
    const { current, pageSize } = this.state.pagination
    const { id } = this.props

    const { data } = await getLogs({
      uid: id,
      limit: pageSize,
      offset: (current - 1) * pageSize
    })
    this.setState({
      list: data.access_log,
      pagination: {
        ...this.state.pagination,
        total: data.total
      }
    })
  }

  changePage = (e) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: e,
        }
      },
      this.getLogsList
    )
  }

  render () {
    const { list, pagination } = this.state

    const columns = [
      { title: '时间', dataIndex: 'created_at', render: (text) => (<span>{format(text * 1000, 'yyyy-MM-dd HH:mm:ss')}</span>) },
      { title: 'IP', dataIndex: 'ipv4' },
      { title: '浏览器', dataIndex: 'browser' },
      { title: '操作系统', dataIndex: 'os' },
    ]

    return (
      <Table
        rowKey="dataIndex"
        dataSource={list}
        columns={columns}
        pagination={pagination}
      />
    )
  }
}
