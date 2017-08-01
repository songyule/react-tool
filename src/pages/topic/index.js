import React, { PureComponent } from 'react'
import Title from 'components/title'
import { Input, Table, Button, Switch, Select, Modal, message, Menu, Tag, Radio } from 'antd'
import { Link } from 'react-router-dom'
import { getArticles, changeArticle, getUpdator } from 'actions/article'
import CopyToClipboard from 'react-copy-to-clipboard'
import { PC_URL } from 'api/config'

import { format } from 'utils'
const ButtonGroup = Button.Group
const Option = Select.Option
const Search = Input.Search
const confirm = Modal.confirm
const RadioGroup = Radio.Group

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
      },
      type: 1
    }
  }

  changeDisplay = async (val, e) => {
    let spu = (val.spu && val.spu.map(item => item.id)) || []
    let tag = (val.article_tag && val.article_tag.map(item => item.id)) || []
    let data = {
      ...val,
      'article_type': this.state.type,
      'status': e ? 2 : 1,
      spu: spu,
      article_tag: tag
    }

    let what = await changeArticle (val.id, data)
    if (what.code === 200) {
      this.getArticleList()
      message.success('修改成功')
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
      article_type_arr: [this.state.type],
      limit: pageSize,
      offset: (current - 1) * pageSize
    }
    if (content) params[type] = content
    if (updator_id) params.updator_id = updator_id

    try {
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
    } catch (error) {
      console.log(error)
    }
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

  // 删除
  showConfirm = (val) => {
    confirm({
      content: '确定要删除这篇文章吗？',
      onOk: async () => {
        let spu = (val.spu && val.spu.map(item => item.id)) || []
        let tag = (val.article_tag && val.article_tag.map(item => item.id)) || []
        let data = {
          'article_type': 1,
          ...val,
          spu: spu,
          article_tag: tag,
          status: -1
        }

        let what = await changeArticle (val.id, data)
        if (what.code === 200) {
          this.getArticleList()
          message.success('删除成功')
        }
        console.log(val)
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  filterEditor = (e) => {
    this.setState({
      search: {
        ...this.state.search,
        updator_id: e.key
      }
    }, this.getArticleList)
  }

  changeType = (e) => {
    this.setState({
      type: e.target.value,
    }, () => {
      this.getArticleList()
    })
  }

  componentWillMount() {
    this.getArticleList()

    // 获取编辑列表
    getUpdator({article_type: 1}).then(res => {
      this.setState({
        editors: res.data || []
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
      title: '标签',
      dataIndex: 'article_tag',
      key: 'label',
      width: 200,
      render: text => {
        return text ? (<div>{text.map(item => <Tag key={item.id}>{item.name}</Tag>)}</div>) : null
      }
    },
    // {
    //   title: '阅读量',
    //   dataIndex: 'read',
    //   key: 'read',
    //   width: 100,
    // },
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
      render: (text, record, i) => <Switch defaultChecked={text === 2} checkedChildren={'显示'} unCheckedChildren={'隐藏'} onChange={(e) => this.changeDisplay(record, e)}/>
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
          // <Button type="primary" ghost >查看</Button>
      render: (text, record) => (
        <span>
          <ButtonGroup>
            <Button type="primary" size="small" onClick={() => this.props.history.push(`/main/edit-topic/${record.id}`)}>编辑</Button>
            <Button type="danger" size="small" ghost onClick={() => this.showConfirm(record)}>删除</Button>
            <Button type="primary" size="small" ghost>
              <CopyToClipboard text={`${PC_URL}/topic-detail/${record.id}`}>
                <span>复制链接</span>
              </CopyToClipboard>
            </Button>
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

    const selectBefore = (
      <Select defaultValue="标题" style={{ width: 80 }} onChange={this.changeSearchType}>
        <Option value="title">标题</Option>
        <Option value="content">内容</Option>
      </Select>
    )

    return (
      <div>
        <Title title="专题文章列表">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <Search addonBefore={selectBefore} placeholder='搜索' onSearch={value => this.onSearch(value)} />
          <RadioGroup onChange={this.changeType} value={this.state.type} style={{paddingLeft: '20px', lineHeight: '28px' }}>
            <Radio value={1}>PC端</Radio>
            <Radio value={3}>微信端</Radio>
          </RadioGroup>
        </div>
          <Button type="primary"><Link to="/main/add-topic">创建文章</Link></Button>
        </div>
        </Title>


        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div>
    )
  }
}
