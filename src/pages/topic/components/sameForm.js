import React, { PureComponent } from 'react'
import { Form, Input, Switch, TreeSelect } from 'antd'
import PropTypes from 'prop-types'
import MyUpload from './img-upload'
// import store from '@/redux/store'
import { getTags } from 'actions/article'
import arrayToTree from 'array-to-tree'

const FormItem = Form.Item
const SHOW_PARENT = TreeSelect.SHOW_PARENT

// import { showPrice } from 'utils'
/**
 *
 * @export
 * @component
 * @module 文章通用的 formItem
 */
export default class SameForm extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      fileList: props.fileList || '',
      checked: true,
      isFirst: true,
      TreeData: [],
      tags: []
    }
  }

  static defaultProps = {
    title: '',
    weight: '',
    status: '',
    fileList: [],
    tags: []
  }

  static propTypes = {
    getFieldDecorator: PropTypes.func.isRequired,
  }

  componentWillMount () {
    this.getCustomTags()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.props.id) return

    this.setState({
      checked: nextProps.status ? nextProps.status === 2 : true,
    })

    if (nextProps.cover_image && this.state.isFirst) {
      this.setState({
        fileList: [{
          uid: -1,
          name: 'sdhjkfhsyuiweyrnn222.png',
          status: 'done',
          url: nextProps.cover_image,
          response: nextProps.cover_image,
          thumbUrl: nextProps.cover_image,
        }],
        tags: nextProps.article_tag && nextProps.article_tag.map(item => item.id),
      })
    }
  }

  // 获取标签
  getCustomTags = async () => {
    try {
      const { data } = await getTags()
      let TreeData = arrayToTree(data.article_tag, {
        parentProperty: 'parent_id',
        customID: 'id'
      })
      TreeData.map(item => {
        item.label = item.name
        item.key = item.id
        item.value = item.id
        item.children.map(res => {
          res.label = res.name
          res.key = res.id
          res.value = res.id
          return res
        })
        return item
      })
      this.setState({
        TreeData: TreeData
      })
    } catch (error) {
      console.log(error)
    }

  }

  changeE = (e) => {
    this.setState({
      checked: e
    })
  }

  onChangeTree = (value) => {
    let data = this.state.TreeData
    let allClass = data.map(item => item.id)
    let twoClass = []
    let left = value.filter(item => allClass.indexOf(item) === -1)
    let existed = value.filter(item => allClass.indexOf(item) > -1)
    existed.forEach(item => {
      data.filter(val => (val.id === item)).map(val => val.children.map(val => twoClass.push(val.id)))
    })
    this.setState({ tags: [...twoClass, ...left] })
  }

  handleChange = (fileList) => {
    this.setState({ fileList }, this.props.onChange(fileList))
  }

  render() {
    const { getFieldDecorator, status } = this.props
    // const name = store.getState().userLogin.name_cn
    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 22 },
      },
    }
    const tProps = {
      treeData: this.state.TreeData,
      value: this.state.tags,
      onChange: this.onChangeTree,
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '选择标签',
      // treeCheckStrictly: true,
      // labelInValue: true,
      style: {
        width: 300,
      },
    };

    const forms = [
      {
        label: '专题标题',
        hasFeedback: true,
        name: 'title',
        opts: {
          initialValue: this.props.title,
          rules: [{
            required: true, message: '请输入专题标题',
          }],
        },
        content: <Input />
      },
      {
        label: '排序值',
        hasFeedback: false,
        name: 'weight',
        opts: {
          initialValue: this.props.weight,
          rules: []
        },
        content: <Input />
      },
      {
        label: '是否显示',
        hasFeedback: false,
        name: 'display',
        opts: {
          initialValue: status ? status === 2 : true,
        },
        content: <Switch checkedChildren={'显示'} unCheckedChildren={'隐藏'} checked={this.state.checked} onChange={this.changeE} />
      },
      // {
      //   label: '发布人',
      //   hasFeedback: false,
      //   name: 'name',
      //   opts: {},
      //   content: <span>{name}</span>
      // },
      {
        label: '封面图',
        hasFeedback: true,
        name: 'image',
        opts: {
          initialValue: this.state.fileList,
          rules: [{
            required: true, message: '请上传一张图片',
          }],
        },
        content: <MyUpload onChange={this.handleChange} fileList={this.state.fileList}></MyUpload>
      },
      {
        label: '标签',
        name: 'tags',
        opts: {},
        notDecorator:true,
        content: <TreeSelect {...tProps} />
      },
    ]
    return (
      <div>
        {
          forms.map(form => {
            return (
              <FormItem
                {...formItemLayout}
                label={form.label}
                hasFeedback={form.hasFeedback}
                key={form.name}
              >
                {form.notDecorator ?
                  (form.content) : (
                  getFieldDecorator(form.name, form.opts)(
                    form.content
                  )
                )}
              </FormItem>
            )
          })
        }
      </div>
    )
  }
}
