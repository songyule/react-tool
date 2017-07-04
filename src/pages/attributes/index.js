import React, { PureComponent } from 'react'
import AttributesTree from './attributes'
import data from './attr'
import Title from 'components/title'
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
      <div>
        <Title title="商城通用类目">
        </Title>
        <AttributesTree treeData={data}>
        </AttributesTree>
      </div>
    )
  }
}

export default Attributes
