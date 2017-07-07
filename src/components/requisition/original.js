import React, { PureComponent } from 'react'
import { Input, Row, Col, Table, Button } from 'antd'
import { Link } from 'react-router-dom'
import style from './css/original.css'
import Title from 'components/title'
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
        dataIndex: 'test2',
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

        <Title title='需求单号：'>
          <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: -15}}>
            <p style={{display: 'flex', alignItems: 'center'}}>670bd8afb6a749d1885ec563d624302a</p>
            <Button type="primary">
              <Link to="/main/clientNew">返回</Link>
            </Button>
          </div>
        </Title>

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
            <span style={{width:60, textAlign: 'right', marginRight: 5}}>交期:</span>
            <InputGroup compact style={{display: 'block', width: 300}}>
              <Input disabled style={{ width: 138, textAlign: 'center' }} placeholder="Minimum" />
              <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none' }} placeholder="~" />
              <Input disabled style={{ width: 138, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
            </InputGroup>
          </Row>
          <Row>
            <Table pagination={false} columns={columns} dataSource={dataSource}></Table>
          </Row>
          <Row className={style.flex}>
            <span style={{width:60, textAlign: 'right', marginRight: 5}}>备注:</span>
            <Input 
            type="textarea" 
            disabled 
            autosize
            style={{width: '80%'}}
            defaultValue="这是一大段话这是一大段话这是一大段话这是一大段话这是一大段话"/>
          </Row>
          <Row className={style.flex}>
            <span style={{width:60, textAlign: 'right', marginRight: 5}}>图片展示:</span>
            <div>
              <img src="" alt="img" className={style.originImg}/>
              <img src="" alt="img" className={style.originImg}/>
              <img src="" alt="img" className={style.originImg}/>
              <img src="" alt="img" className={style.originImg}/>
            </div>
          </Row>
        </div>
      </div>
    )
  }
}

export default original
