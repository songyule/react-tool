import React, { PureComponent } from 'react'
import Original from 'components/requisition/original'
import Revision from 'components/requisition/revision'
import style from '../../components/requisition/css/original.css'
import { Button, Row, Col, Input } from 'antd'
import Title from 'components/title'
import { Link } from 'react-router-dom'
import { postSamplingSearch } from 'actions/requisition'

export default class requisition extends PureComponent {
  state = {
    data: [
    [{
        label: '客户编码',
        dataIndex: ['applicant_org', 'sn'],
        twoLevel: 'sn'
      }, {
        label: '客户等级',
        dataIndex: ['requirement'],
        childrenData: 'true'
      }],
      [{
        label: '业务员',
        dataIndex: ['test'],
      }, {
        label: '提交人',
        dataIndex: ['test'],
      }]
    ],
    type: 0 // 0 原版 ，1 改版， 2 定制
  }
  // 17071118091016882 0 17071118091024410 1 17071118170096655 2
  componentWillMount () {
    let data = {
      id_arr: [this.props.match.params.id]
    }
    postSamplingSearch(data).then(res => {
      this.setState({
        samplingMes: res.data.sampling[0],
        dataSource: res.data.sampling[0].sku_snapshot.attribute,
        type: res.data.sampling[0].classification
      })
    })
  }

  render () {
    const { samplingMes } = this.state

    return (
      <div>
        <Title title='需求单号：'>
          <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: -15}}>
            <p style={{display: 'flex', alignItems: 'center'}}>{this.props.match.params.id}</p>
            <Button type="primary">
              <Link to="/main/clientNew">返回</Link>
            </Button>
          </div>
        </Title>
        <div className={style.main}>
          <Row>
            <Col span={10}>
              <span className={style.inputTitle}>客户编码:</span>
              <Input disabled style={{width: 300}} value={ samplingMes && 'SN' + samplingMes.applicant_org.sn }/>
            </Col>
            <Col span={10}>
              <span className={style.inputTitle}>客户等级:</span>
              <Input disabled style={{width: 300}} value={samplingMes && samplingMes.applicant_org.client_level.name}/>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <span className={style.inputTitle}>业务员:</span>
              <Input disabled style={{width: 300}} value={samplingMes && samplingMes.applicant_org.seller.name_cn}/>
            </Col>
            <Col span={10}>
              <span className={style.inputTitle}>提交人:</span>
              <Input disabled style={{width: 300}} value={samplingMes && samplingMes.applicant_user.name_cn}/>
            </Col>
          </Row>
        </div>
        {
          (this.state.type === 0 || this.state.type === 1) && <Original samplingMes={samplingMes}></Original>
        }
        {
          (this.state.type === 1 || this.state.type === 2) && <Revision samplingMes={samplingMes}></Revision>
        }
      </div>
    )
  }
}