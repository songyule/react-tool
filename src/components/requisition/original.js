import React, { PureComponent } from 'react'
import { Input, Icon, Row, Col, Table } from 'antd'
import style from './css/original.css'
const InputGroup = Input.Group
class original extends PureComponent {
  state = {
    initData: [
      [{
        label: '客户编码',
        dataIndex: 'test',
      }, {
        label: '客户等级',
        dataIndex: 'test',
      }],
      [{
        label: '业务员',
        dataIndex: 'test',
      }, {
        label: '提交人',
        dataIndex: 'test',
      }],
      [{
        label: '商品名称',
        dataIndex: 'test',
      }, {
        label: '商品类目',
        dataIndex: 'test',
      }],
      [{
        label: 'SKU料号',
        dataIndex: 'test',
      }, {
        label: 'SKUID',
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
        label: '质检内容',
        dataIndex: 'test',
      }, {
        label: '合计',
        dataIndex: 'test',
      }]
     ],
    data: {
      test: 'hahah',
      test2: 'heeieieie'
    }
  }
  render () {
    const dataSource = [{
      attr: 'a',
      attrData: 'aaaaa',
      key: '1'
    }, {
      attr: 'b',
      attrData: 'bbbbbb',
      key: '2'
    }]
    const columns = [{
      title: '属性',
      dataIndex: 'attr',
      key: 'attr',
      width: '200'
    },{
      title: '属性值',
      dataIndex: 'attrData',
      key: 'attrData',
    }]
    return (
      <div className={style.original_box}>
        <div className={style.title}>
          <Icon type="exception" style={{ fontSize: 16, color: '#08c', marginTop: 3, marginRight:5 }} />
          <span>需求单号: </span>
          <span>21032321421312312</span>
        </div>
        <div>
          {
            this.state.initData.map((item, index) => {
              return  <Row key={index}>
                        {
                          item.map((item, index) => {
                            return <Col span={10} key={index}>
                                    <span className={style.inputTitle}>{item.label}:</span>
                                    <Input disabled style={{width: 300}} value={this.state.data[item.dataIndex]}/>
                                  </Col>
                          })
                        }
                      </Row>
            })
          }
          <Row className={style.flex}>
            <span className={style.inputTitle}>交期:</span>
            <InputGroup compact>
              <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
              <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none' }} placeholder="~" />
              <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
            </InputGroup>
          </Row>
          <Row>
            <Table pagination={false} columns={columns} dataSource={dataSource}></Table>
          </Row>
        </div>
      </div>
    )
  }
}

export default original
