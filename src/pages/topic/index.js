import React, { PureComponent } from 'react'
import Title from 'components/title'
import { Input, Icon, Table, Button, Switch } from 'antd'
import { Link } from 'react-router-dom'
import { getArticles } from 'actions/article'
const ButtonGroup = Button.Group

// get /user/editor/list 获取所有编辑er列表
// post /article/list 创建文章
// patch /article/edit/<article_id> 修改文章
// GET /article/edit/<article_id> 获取文章详情
// get /article/tag/list @王啊瑞 获取文章标签列表
/**
 *
 * @export
 * @page
 * @module 专题文章列表页面
 */
export default class extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        onChange: this.changePage
      }
    }
  }

  // 修改页码
  changePage = (e) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: e,
      }
    }, this.getArticleList)
  }

  // 获取文章列表
  getArticleList = async () => {
    const { current, pageSize } = this.state.pagination
    const { data } = await getArticles({
      article_type: 1,
      limit: pageSize,
      offset: (current - 1) * pageSize
    })
    data.article.forEach((item, index) => {
      item.no = (current - 1) * pageSize + index + 1
      item.key = item.id
    })
    this.setState({
      data: data.article,
      pagination: {
        ...this.state.pagination,
        total: data.total,
      }
    })
  }

  componentWillMount() {
    this.getArticleList()
  }

  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'no',
      key: 'no',
      width: 50,
    }, {
      title: '封面图',
      dataIndex: 'cover_image',
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
      dataIndex: 'created_at',
      key: 'create',
      width: 150,
    },
    {
      title: '作者',
      dataIndex: 'updator_name',
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
      dataIndex: 'weight',
      key: 'sort',
      width: 60,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => <Switch defaultChecked={text === 2} checkedChildren={'显示'} unCheckedChildren={'不显'} />
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

    const { pagination, data } = this.state

    // const data = [{
    //   key: '1',
    //   no: '1',
    //   cover_image: 'http://od2cb56o8.bkt.clouddn.com/information_cover/f643e9bf5ccf428e9debc6374d843e28',
    //   title: '新工艺 教你如何使用珍珠',
    //   create: '2017-04-18 15:00:30',
    //   author: '提莫',
    //   label: '2017,春,新工艺,超现',
    //   read: '2111',
    //   sort: 32,
    //   status: '显示',
    // }]

    return (
      <div>
        <Title title="专题文章列表">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Input addonAfter={<Icon type="search" />} placeholder='标题/内容' />
          <Button type="primary"><Link to="/main/add-topic">创建文章</Link></Button>
        </div>
        </Title>
        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div>
    )
  }
}
