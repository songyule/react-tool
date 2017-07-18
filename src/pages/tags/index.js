import React, { PureComponent } from 'react'
import Title from 'components/title'
import { Modal, Card, Button, Tag, Icon, Input } from 'antd'
import { getTags, addTag, delTag, changeTag } from 'actions/article'
import arrayToTree from 'array-to-tree'
import style from './tags.css'

const confirm = Modal.confirm

/**
 *
 * @export
 * @page
 * @module 文章标签管理页面
 */
export default class Tags extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      tags: [],
      name: '',
      id: '',
      visible: false,
      isChange: false
    }
  }

  newTag = () => {
    addTag({
      name: this.state.name,
      parent_id: this.state.id
    }).then(res => {
      this.getTags()
    })
  }

  patchTag = () => {
    changeTag(this.state.id, {
      name: this.state.name
    }).then(res => {
      this.getTags()
    })
  }

  delTag = (e, id) => {
    e.preventDefault()
    confirm({
      // title: '确定要删除这个标签吗?',
      content: '是否继续删除这个标签',
      onOk: () => {
        delTag(id).then(res => {
          this.getTags()
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  inputChange = (e) => {
    this.setState({name: e.target.value})
  }

  hideModal = () => {
    this.setState({
      visible: false,
      name: ''
    })
  }

  okHandler = () => {
    this.setState({
      visible: false,
      name: ''
    })
    this.state.isChange ? this.patchTag() : this.newTag()
  }

  openLevelChange = (id, name) => {
    this.setState({
      visible: true,
      isChange: true,
      id,
      name
    })
  }

  openLevelOne = () => {
    this.setState({
      visible: true,
      id: ''
    })
  }

  openLevelTwo = (id) => {
    this.setState({
      visible: true,
      id
    })
  }

  getTags = () => {
    getTags().then(res => {
      let TreeData = arrayToTree(res.data.article_tag, {
        parentProperty: 'parent_id',
        customID: 'id'
      })
      this.setState({
        tags: TreeData
      })
    })
  }

  componentDidMount () {
    this.getTags()
  }

  render() {
    const { tags } = this.state
    return (
      <div>
        <Title title="标签管理">
          <div style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.openLevelOne}>新增一级标签</Button>
          </div>
        </Title>
        <div>
        {
          tags.map(tag => (
            <Card
              key={tag.id}
              className={style.what}
              title={tag.name}
              extra={
                <div>
                  <Button icon="edit" onClick={() => this.openLevelChange(tag.id, tag.name)} style={{marginRight: '10px'}} />
                  <Button type="danger" icon="close" onClick={(e) => this.delTag(e, tag.id)} />
                </div>
              }
            >
              {
                tag.children && tag.children.map(item => (
                  <div className={style.tag} key={item.id}>
                    <Tag closable onClose={(e) => this.delTag(e, item.id)}>
                    {item.name}
                    <Icon type="edit" className={style.edit} onClick={() => this.openLevelChange(item.id, item.name)} />
                  </Tag>
                  </div>
                ))
              }
              <Button type="primary" onClick={() => this.openLevelTwo(tag.id)}>新增<Icon type="plus"></Icon></Button>
            </Card>
          ))
        }
          <Modal
            title={this.state.isChange ? '修改标签' : '新增标签'}
            visible={this.state.visible}
            onOk={this.okHandler}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <Input onChange={this.inputChange} value={this.state.name}></Input>
          </Modal>
        </div>
      </div>
    )
  }
}
