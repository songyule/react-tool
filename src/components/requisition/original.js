import React, { PureComponent } from 'react'
import { Input, Row, Col, Table } from 'antd'
import style from './css/original.css'

class original extends PureComponent {
  state = {
    initData: [
      [{
        label: '商品名称',
        dataIndex: 'test',
      }, {
        label: '商品类目',
        dataIndex: 'test',
      }],
      [{
        label: '数量',
        dataIndex: 'test',
      }, {
        label: '单价',
        dataIndex: 'test',
      }],
      [{
        label: 'SKUID',
        dataIndex: 'test',
      }]
     ],
    data: {
      test: 'hahah',
      test2: 'heeieieie'
    },
    samplingMes: {},
    dataSource: []
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
                                    {console.log(val.twoLevel)}
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
            <Table pagination={false} columns={columns} dataSource={this.state.dataSource} key='123'></Table>
          </Row>
          <Row>
            <h4>商品描述:</h4>
            <Table pagination={false} columns={columns} dataSource={this.state.dataSource} key='1234'></Table>
          </Row>
          <Row className={style.flex}>
            <span className={style.inputTitle}>商品图片:</span>
            <div>
              {
                this.state.samplingMes.img_arr && this.state.samplingMes.img_arr.map((item, index) => {
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
