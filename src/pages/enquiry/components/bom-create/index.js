import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { Button } from 'antd'
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity'
import { Modal } from 'antd'
import BomCard from './components/bom-card'

/**
 * @export
 * @page
 * @module 新建 BOM 弹框
 */
@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
export default class extends PureComponent {
  constructor () {
    super()

    this.boms = []
  }

  changeBom = (bomPart, index) => {
    const boms = [...this.props.boms]
    const bom = {...boms[index], ...bomPart}
    boms[index] = bom
    this.props.changeBoms(boms)
  }

  removeBom = (index) => {
    const boms = [...this.props.boms]
    boms.splice(index, 1)
    this.props.changeBoms(boms)
  }

  addBom = () => {
    const boms = [...this.props.boms]
    boms.push({
      name: '',
      classesSelected: [],
      amount: '',
      unit: '',
      quality_req: '',
      quality_testing_req: '',
      attributes: [],
      attributesObj: {}
    })
    this.props.changeBoms(boms)
  }

  handleOk = () => {
    let bool = true
    this.boms.forEach(bom => bom.validateFields(err => {
      if (err) bool = false
    }))
    if (!bool) return
    this.props.callback(this.props.boms)
  }

  componentWillMount = () => {
    this.props.getClasses()
  }

  render () {
    return (
      <div className="commodity-selection">
        <Modal
          visible={this.props.visible}
          title="新建 BOM"
          width={800}
          onOk={this.handleOk}
          onCancel={this.props.onCancel}>
          { this.props.boms.map((bom, index) =>
          index === 0 ? <BomCard bom={bom} changeBom={bomPart => this.changeBom(bomPart, index)} key={index} ref={ref => this.boms[index] = ref}></BomCard>:
          <BomCard bom={bom} changeBom={bomPart => this.changeBom(bomPart, index)} key={index} onRemove={() => this.removeBom(index)} ref={ref => this.boms[index] = ref}></BomCard>) }
          <Button onClick={this.addBom}>添加</Button>
        </Modal>
      </div>
    )
  }
}
