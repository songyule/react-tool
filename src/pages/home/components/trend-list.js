import React, { PureComponent } from 'react'
import Title from 'components/title'
import { Input, Table, Button, Select, Menu } from 'antd'
import { getArticles, getUpdator } from 'actions/article'

import { format } from 'utils'
const Option = Select.Option
const Search = Input.Search

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
      content: {},
      editors: [],
      specialEditor: '',
      search: {
        type: 'title',
        content: '',
        updator_id: ''
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        onChange: this.changePage
      }
    }
  }

  // 修改搜索的类型
  changeSearchType = (e) => {
    this.setState({
      search: {
        ...this.state.search,
        type: e,
        content: ''
      }
    })
    document.querySelector('.ant-input-search').value = ''
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
    const { type, content, updator_id } = this.state.search
    let params = {
      article_type_arr: [2],
      limit: pageSize,
      offset: (current - 1) * pageSize
    }
    if (content) params[type] = content
    if (updator_id) params.updator_id = updator_id

    const { data } = await getArticles(params)
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

  // 搜索关键词
  onSearch = (value) => {
    this.setState({
      search: {
        ...this.state.search,
        content: value
      }
    }, this.getArticleList)
  }

  filterEditor = (e) => {
    this.setState({
      search: {
        ...this.state.search,
        updator_id: e.key
      }
    }, this.getArticleList)
  }

  componentWillMount() {
    this.getArticleList()

    // 获取编辑列表
    getUpdator({article_type: 2}).then(res => {
      this.setState({
        editors: res.data
      })
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
      width: 180,
      render: text => <span>{format(text * 1000, 'yyyy-MM-dd HH:mm:ss')}</span>,
    },
    {
      title: '作者',
      dataIndex: 'updator_name',
      key: 'author',
      width: 120,
      filterDropdown: (
        <div style={{width: '100px', padding: '5px', textAlign: 'center'}}>
          <Menu onClick={(e) => this.filterEditor(e)}>
            { this.state.editors.map(item => <Menu.Item key={item.updator_id}>{item.updator_name}</Menu.Item>) }
          </Menu>
          <div><Button onClick={() => this.filterEditor({key: ''})}>清除</Button></div>
        </div>
      ),
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
      render: (text, record, i) => text === 2 ? '显示' : '隐藏'
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (text, record) => (
        <Button onClick={() => this.props.select(record)}>选择</Button>
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

    const selectBefore = (
      <Select defaultValue="标题" style={{ width: 80 }} onChange={this.changeSearchType}>
        <Option value="title">标题</Option>
        <Option value="content">内容</Option>
      </Select>
    )

    return (
      <div>
        <Title title="趋势文章列表">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Search addonBefore={selectBefore} placeholder='搜索' onSearch={value => this.onSearch(value)} />
        </div>
        </Title>
        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div>
    )
  }
}
