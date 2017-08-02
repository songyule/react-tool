import React, { PureComponent } from 'react'
import { Input, Row, Col, Table } from 'antd'
import style from './css/original.css'
import { mergeSpuAttr } from 'utils'

class original extends PureComponent {
  state = {
    initData: [
      [{
        label: '商品名称',
        dataIndex: 'sku_snapshot',
        twoLevel: 'spu_name_cn'
      }, {
        label: 'SKUID',
        dataIndex: 'sku_snapshot',
        twoLevel: 'id'
      }],
      [{
        label: '数量',
        dataIndex: 'sample_amount',
      }, {
        label: '单价',
        dataIndex: 'sku_snapshot',
        twoLevel: 'price'
      }],
      [{
        label: '商品类目',
        dataIndex: 'classify',
      }]
     ],
    samplingMes: {},
    spu_img_arr: [],
    skuData: [],
    spuData: []
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps.samplingMes)
    console.log(nextProps.samplingMes.sku_snapshot.spu.commodity_attribute)
    let classify = nextProps.samplingMes.sku_snapshot.spu.commodity_class
    let classifyStr = ''
    let classifyStrC = classify.map(item => {
      let lv = item.level
      let lvText =''
      for (let i = 1; i <= lv; i ++) {
        lvText = i === 1 ? lvText + `${item['lv' + [i] + '_name_cn']}` : lvText + `/${item['lv' + [i] + '_name_cn']}`
      }
      return lvText
    })
    classifyStr = classifyStr + classifyStrC + '&'
    nextProps.samplingMes.classify = classifyStr
    this.setState({
      samplingMes: nextProps.samplingMes,
      spu_img_arr: nextProps.samplingMes.sku_snapshot.spu.image_url,
      skuData: nextProps.samplingMes.sku_snapshot.attribute,
      spuData: mergeSpuAttr(nextProps.samplingMes.sku_snapshot.spu.commodity_attribute)
    })
  }

  render () {
    const { samplingMes } = this.state
    const columns = [{
      title: '属性',
      dataIndex: 'lv1_name_cn',
      key: 'lv1_name_cn',
      width: '200'
    },{
      title: '属性值',
      dataIndex: 'name_cn',
      key: 'name_cn',
    }]

    return (
      <div className={style.main}>
        <div>
          {
            this.state.initData.map((item, index) => {
              return  <Row key={index}>
                        {
                          item.map((val, index) => {
                            return <Col span={10} key={index}>
                                    <span className={style.inputTitle}>{val.label}:</span>
                                    <Input disabled style={{width: 300}} value={
                                      val.twoLevel ? samplingMes[val.dataIndex] && samplingMes[val.dataIndex][val.twoLevel] : samplingMes[val.dataIndex]
                                    }/>
                                  </Col>
                          })
                        }
                      </Row>
            })
          }
          <Row>
            <h4>SKU描述:</h4>
            <Table pagination={false} columns={columns} dataSource={this.state.skuData} key='123'></Table>
          </Row>
          <Row>
            <h4>商品描述:</h4>
            <Table pagination={false} columns={columns} dataSource={this.state.spuData} key='1234'></Table>
          </Row>
          <Row className={style.flex}>
            <span className={style.inputTitle}>商品图片:</span>
            <div>
              {
                this.state.spu_img_arr && this.state.spu_img_arr.map((item, index) => {
                  return (<img key={index} src={item} alt="img" className={style.originImg}/>)
                })
              }
            </div>
          </Row>
        </div>
      </div>
    )
  }
}

export default original
