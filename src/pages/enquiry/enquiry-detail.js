import React, { PureComponent } from 'react'
import { Input, Row, Col, Radio, Button, Table } from 'antd'
import style from './css/enquiry-detail.css'

const RadioGroup = Radio.Group
export default class extends PureComponent {
  state = {
    defaultSource: true,
    skuData: [],
    spuData: [],
    imgArr: ['https://timage.fuliaoyi.com/FnV4neLabh9t7iXXK2ZH4W8qgryJ', 'https://timage.fuliaoyi.com/FskxEs_W5dnGOj78q8FU6ljTGCc3']
  }
  onChangeSource = (e) => {
    this.setState({
      defaultSource: e.target.value,
    })
  }
  render () {
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
    const shopRequire = [
      {
        name: '颜色要求'
      },
      {
        name: '尺寸要求'
      },
      {
        name: '形状要求'
      },
      {
        name: '材质要求'
      },
      {
        name: '品质要求'
      },
      {
        name: '质检要求'
      },
    ]
    return (
      <div style={{margin: 20}}>
        <Row className={style.dataSources}>
          <Col className={style.col}>数据来源</Col>
          <Col span={10} style={{marginTop: 4}}>
            <RadioGroup value={this.state.defaultSource} onChange={this.onChangeSource}>
              <Radio value={true}>需求单</Radio>
              <Radio value={false}>其他来源</Radio>
            </RadioGroup>
            {
              this.state.defaultSource && <div className={style.clickReq}>
                                            <Button type="primary" >选择需求单</Button>
                                            <p>需求单号：234324324</p>
                                          </div>
            }
          </Col>
        </Row>
        <Row className={style.dataSources}>
          <Col className={style.col}>客户情况</Col>
          <Col span={10}>
            <span className={style.inputTitle}>客户简称:</span>
            <Input style={{width: 300}} value='2333'/>
          </Col>
          <Col span={10}>
            <span className={style.inputTitle}>客户编码:</span>
            <Input style={{width: 300}} disabled value='32222'/>
          </Col>
        </Row>
        <Row className={style.dataSources}>
          <Col className={style.col}></Col>
          <Col span={10}>
            <span className={style.inputTitle}>客户级别:</span>
            <Input style={{width: 300}} value='2333'/>
          </Col>
          <Col span={10}>
            <span className={style.inputTitle}>提交人:</span>
            <Input style={{width: 300}} value='32222'/>
          </Col>
        </Row>
        <Row className={style.dataSources}>
          <Col className={style.col}>商品类型</Col>
          <RadioGroup value='1' style={{marginTop: 4}}>
            <Radio value='1'>原版</Radio>
            <Radio value='2'>改版</Radio>
            <Radio value='3'>定制</Radio>
          </RadioGroup>
        </Row>
        <Row className={style.dataSources}>
          <Col className={style.col}>商品详情</Col>
          <Col span={10}>
            <span className={style.inputTitle}>商品名称:</span>
            <Input style={{width: 300}} value='2333'/>
          </Col>
          <Col span={10}>
            <span className={style.inputTitle}>类目:</span>
            <Input style={{width: 300}} value='32222'/>
          </Col>
        </Row>
        <Row className={style.dataSources}>
          <Col className={style.col}></Col>
          <Col span={10}>
            <span className={style.inputTitle}>SKUID:</span>
            <Input style={{width: 300}} value='2333'/>
          </Col>
          <Button type="primary" >选择商品</Button>
        </Row>
        <Row>
          <h4>SKU描述:</h4>
          <Table pagination={false} columns={columns} dataSource={this.state.skuData} key='0'></Table>
        </Row>
        <Row>
          <h4>商品描述:</h4>
          <Table pagination={false} columns={columns} dataSource={this.state.spuData} key='1'></Table>
        </Row>
        <Row className={style.dataSources}>
          <span className={style.inputTitle}>用户上传图片:</span>
          <div>
            {
              this.state.imgArr.map((item, index) => {
                return (<img key={index} src={item} alt="img" className={style.originImg}/>)
              })
            }
          </div>
        </Row>
        <Row className={style.dataSources}>
          <span className={style.inputTitle}>上传补充图片:</span>
          <div>
            {
              this.state.imgArr.map((item, index) => {
                return (<img key={index} src={item} alt="img" className={style.originImg}/>)
              })
            }
          </div>
        </Row>
        <Row className={style.dataSources}>
          <Col className={style.col}>商品要求</Col>
          <Col span={10}>
          {
            shopRequire.map((item, index) => {
              return  <div style={{marginBottom: 10}}>
                        <span className={style.inputTitle}>{item.name}:</span>
                        <Input style={{width: 300}} value='2333'/>
                      </div>
            })
          }
          </Col>
        </Row>
        <Row className={style.dataSources}>
          <Col className={style.col}></Col>
          <Col >
            <span className={style.inputTitle}>SKUID:</span>
            <Input style={{width: 300}} type="textarea" autosize value='2333'/>
          </Col>
        </Row>
      </div>
    )
  }
}