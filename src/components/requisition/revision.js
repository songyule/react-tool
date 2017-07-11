import React, { PureComponent } from 'react'
import { Input, Row, Col } from 'antd'
import style from './css/original.css'
import { format } from 'utils'

class revision extends PureComponent {
  state = {
    secondData: [
      [{
        label: '颜色要求',
        dataIndex: 'requirement',
        twoLevel: 'color'
      }, {
        label: '材质要求',
        dataIndex: 'requirement',
        twoLevel: 'material'
      }],
      [{
        label: '形状要求',
        dataIndex: 'requirement',
        twoLevel: 'shape'
      }, {
        label: '尺寸要求',
        dataIndex: 'requirement',
        twoLevel: 'size'
      }],
      [{
        label: '样品数量',
        dataIndex: 'sample_amount',
      }, {
        label: '样品交期',
        dataIndex: 'sample_deadline'
      }],
      [{
        label: '期望大货数量',
        dataIndex: 'bulk_production_amount',
      }, {
        label: '检测标准',
        dataIndex: 'requirement',
        twoLevel: 'standard'
      }],
      [{
        label: '期望大货价格',
        dataIndex: 'bulk_production_price',
      }, {
        label: '预计大货周期',
        dataIndex: 'requirement',
        twoLevel: 'bulk_production_deliver_day'
      }]
     ],
     imgArr: []
  }

  componentWillMount () {
    console.log(this.props.samplingMes)
    this.props.samplingMes.sample_deadline = format(this.props.samplingMes.sample_deadline * 1000, 'yyyy/mm/dd HH:mm:ss')
    this.setState({
      samplingMes: this.props.samplingMes,
      imgArr: this.props.samplingMes.img_arr
    })
  }

  render () {
    const { samplingMes } = this.state
    return (
        <div className={style.main}>
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
            <Col span={10}>
              <span className={style.inputTitle}>单位:</span>
              <Input disabled style={{width: 300}} value={samplingMes.sku_snapshot.extra_attribute[0].name_cn}/>
            </Col>
          </Row>
          <Row>
            <Col className={style.flex}>
              <span className={style.inputTitle}>备注:</span>
              <Input
              type="textarea"
              disabled
              autosize
              value={samplingMes.applicant_comment}/>
            </Col>
          </Row>
        </div>
    )
  }
}

export default revision
