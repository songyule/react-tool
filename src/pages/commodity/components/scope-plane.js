import React, { Component } from 'react'
import { Radio, Button, Modal, Tag } from 'antd'
import SelectArea from './select-area'
const RadioGroup = Radio.Group

class ScopePlane extends Component {
  constructor (props) {
    super(props)

    this.state = {
      preSelecteds: [],
      visible: false
    }
  }

  changeStatus = (e) => {
    // this.setState({
    //   visible: false
    // })
    if (e.target.value === 3 && this.state.preSelecteds.length === 0) {
      this.showModal()
    }
    this.props.changeSpu({...this.props.spu, accessStatus: e.target.value})
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  closeModal = () => {
    this.setState({
      visible: false
    })
  }

  handlePreSelecteds = (value) => {
    this.setState({
      preSelecteds: value
    })
  }

  handleSelecteds = () => {
    this.props.changeSelecteds(this.state.preSelecteds)
    this.closeModal()
  }

  render () {
    return (
      <div className="scope-plane">
        <RadioGroup value={this.props.spu.accessStatus} onChange={this.changeStatus}>
          <Radio value={1}>全网公开（需审核）</Radio>
          <Radio value={2}>我的全部客户（免审核）</Radio>
          <Radio value={3}>
            指定客户（免审核）
            { this.props.spu.accessStatus === 3 ? <Button onClick={this.showModal}>修改</Button> : '' }
          </Radio>
        </RadioGroup>
        { this.props.spu.accessStatus === 3 ? <div className="tag-list">
          { this.props.selecteds.map(item => <Tag>{item.label}</Tag>) }
          </div> : '' }
        <Modal title="选择商品可见范围" visible={this.state.visible} width={800} onCancel={this.closeModal} onOk={this.handleSelecteds}>
          <SelectArea selecteds={this.state.preSelecteds} onChange={this.handlePreSelecteds}></SelectArea>
        </Modal>
      </div>
    )
  }
}

export default ScopePlane
