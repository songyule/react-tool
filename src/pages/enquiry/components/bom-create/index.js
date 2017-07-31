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

    this.state = {
      boms: [{
        name: '',
        classesSelected: [],
        amount: '',
        unit: '',
        quality_req: '',
        quality_testing_req: '',
        attributes: []
      }]
    }
  }

  changeBom = (bomPart, index) => {
    const boms = [...this.state.boms]
    const bom = {...boms[index], ...bomPart}
    boms[index] = bom
    this.setState({
      boms: [ ...boms ]
    })
  }

  removeBom = (index) => {
    const boms = [...this.state.boms]
    boms.splice(index, 1)
    this.setState({
      boms: [ ...boms ]
    })
  }

  addBom = () => {
    const boms = [...this.state.boms]
    boms.push({
      name: '',
      classesSelected: [],
      amount: '',
      unit: '',
      quality_req: '',
      quality_testing_req: '',
      attributes: []
    })
    this.setState({
      boms: [ ...boms ]
    })
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
          onOk={() => this.props.callback(this.state.boms)}
          onCancel={this.props.onCancel}>
          { this.state.boms.map((bom, index) =>
          index === 0 ? <BomCard bom={bom} changeBom={bomPart => this.changeBom(bomPart, index)} key={index}></BomCard>:
          <BomCard bom={bom} changeBom={bomPart => this.changeBom(bomPart, index)} key={index} onRemove={() => this.removeBom(index)}></BomCard>) }
          <Button onClick={this.addBom}>添加</Button>
        </Modal>
      </div>
    )
  }
}
