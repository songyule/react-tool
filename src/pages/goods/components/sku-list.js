import React, { PureComponent } from 'react'
import { Table, Button } from 'antd'
import { showAttributes } from '../utils'
// import style from './spu-list.css'

class SkuList extends PureComponent {

  getColumns = () => {
    return [
      {
        title: 'SKUID',
        dataIndex: 'id',
        render: text => text
      },
      {
        title: '属性',
        dataIndex: '',
        render: (text, record) => showAttributes(record.attribute)
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: text => text
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text, record) => (
          <Button onClick={() => this.props.select(record)}>选择</Button>
        )
      }
    ]
  }

  render () {
    return (
      <div className="page_goods-list">
        <Table rowKey="id" columns={this.getColumns()} dataSource={this.props.list}></Table>
      </div>
    )
  }
}

export default SkuList
