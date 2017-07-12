import React, { PureComponent } from 'react'
import { Input, Row, Col } from 'antd'
import style from './css/original.css'
const InputGroup = Input.Group

class customize extends PureComponent {
  state = {
    secondData: [
      [{
        label: '颜色要求',
        dataIndex: 'applicant_org',
        twoLevel: 'sn'
      }, {
        label: '材质要求',
        dataIndex: 'requirement',
      }],
      [{
        label: '形状要求',
        dataIndex: 'test',
      }, {
        label: '尺寸要求',
        dataIndex: 'test',
      }],
      [{
        label: '样品数量',
        dataIndex: 'test',
      }, {
        label: '样品交期',
        dataIndex: 'test',
      }],
      [{
        label: '期望大货数量',
        dataIndex: 'test',
      }, {
        label: '检测标准',
        dataIndex: 'test',
      }]
     ],
     imgArr: ['1', '2']
  }
  render () {
    return (
        <div>
          <Row className={style.flex}>
            <span className={style.inputTitle}>用户上传图片:</span>
            <div>
              {
                this.state.imgArr.map((item, index) => {
                  return (<img key={index} src={item} alt="img" className={style.originImg}/>)
                })
              }
            </div>
          </Row>
          {
            this.state.secondData.map((item, index) => {
              return  <Row key={index}>
                        {
                          item.map((val, index) => {
                            return <Col span={10} key={index}>
                                    <span className={style.inputTitle}>{val.label}:</span>
                                    <Input disabled style={{width: 300}} value='zheshiyige zhi'/>
                                  </Col>
                          })
                        }
                      </Row>
            })
          }
          <Row>
            <Col span={10} className={style.flex}>
              <span className={style.inputTitle}>期望大货价格:</span>
              <Input disabled style={{width: 300}}/>
            </Col>
            <Col span={10} className={style.flex}>
              <span className={style.inputTitle}>预计大货周期:</span>
              <InputGroup compact style={{display: 'block', width: 300}}>
                <Input disabled style={{ width: 138, textAlign: 'center' }} placeholder="Minimum" />
                <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none' }} placeholder="~" />
                <Input disabled style={{ width: 138, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
              </InputGroup>
            </Col>
          </Row>
          <Row className={style.flex}>
            <span className={style.inputTitle}>备注:</span>
            <Input
            type="textarea"
            disabled
            autosize
            style={{width: '80%'}}
            value='zheshibiezhua'/>
          </Row>
        </div>
    )
  }
}

export default customize