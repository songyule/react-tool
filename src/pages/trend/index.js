import React, { PureComponent } from 'react'
import Title from 'components/title'
import { Input, Icon, Table, Button, Switch } from 'antd'

const ButtonGroup = Button.Group

/**
 *
 * @export
 * @page
 * @module 新增确实文章页面
 */
export default class extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  onContentStateChange = (contentState) => {
    this.setState({
      contentState
    })
  }

  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'no',
      key: 'no',
      width: 50,
    }, {
      title: '封面图',
      dataIndex: 'cover',
      key: 'cover',
      width: 200,
      render: text => <img style={{width: '140px'}} src={text} alt=""/>,
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'create',
      key: 'create',
      width: 150,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
      width: 200,
    },
    {
      title: '阅读量',
      dataIndex: 'read',
      key: 'read',
      width: 100,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => <Switch checkedChildren={'显示'} unCheckedChildren={'不显'} />
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (text, record) => (
        <span>
          <ButtonGroup>
            <Button type="primary" ghost>查看</Button>
            <Button type="primary" onClick={() => this.props.history.push('/main/add-topic')}>编辑</Button>
          </ButtonGroup>
        </span>
      ),
    }]

    const data = [{
      key: '1',
      no: '1',
      cover: 'http://od2cb56o8.bkt.clouddn.com/information_cover/f643e9bf5ccf428e9debc6374d843e28',
      title: '新工艺 教你如何使用珍珠',
      create: '2017-04-18 15:00:30',
      author: '提莫',
      label: '2017,春,新工艺,超现',
      read: '2111',
      sort: 32,
      status: '显示',
    }]

    return (
      <div>
        <Title title="专题文章列表">
          <Input addonAfter={<Icon type="search" />} placeholder='标题/内容' />
        </Title>
        <Table columns={columns} dataSource={data} />
      </div>
    )
  }
}
