import React, { PureComponent } from 'react'
import AttributesTree from './attributes'
import data from './attr'
import arrayToTree from 'array-to-tree'

class Attributes extends PureComponent {
  componentWillMount () {
    this.getData()
  }

  getData () {
    this.setState({ data: [arrayToTree(data.data.attribute)]})
  }

  render () {
    const { data } = this.state
    return (
      <AttributesTree treeData={data}>
      </AttributesTree>
    )
  }
}

export default Attributes
