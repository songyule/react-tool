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
        dataIndex: 'applicant_org',
        twoLevel: 'sn'
      }, {
        label: '客户等级',
        dataIndex: 'requirement',
      }],
      [{
        label: '业务员',
        dataIndex: 'test',
      }, {
        label: '提交人',
        dataIndex: 'test',
      }]
    ]
  }

  componentWillMount () {
    let data = {
      id_arr: ['2127201eec354ea7bca72e851dc16b3b']
    }
    postSamplingSearch(data).then(res => {
      console.log(res)
      this.setState({
        samplingMes: res.data.sampling[0],
        dataSource: res.data.sampling[0].sku_snapshot.attribute
      })
    })
  }

  render () {
    return (
      <div>
        <Title title='需求单号：'>
          <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: -15}}>
            <p style={{display: 'flex', alignItems: 'center'}}>'670bd8afb6a749d1885ec563d624302a'</p>
            <Button type="primary">
              <Link to="/main/clientNew">返回</Link>
            </Button>
          </div>
        </Title>
        <div className={style.main}>
          {
            this.state.data.map((item, index) => {
              return  <Row key={index}>
                        {
                          item.map((val, index) => {
                            return <Col span={10} key={index}>
                                    <span className={style.inputTitle}>{val.label}:</span>
                                    <Input disabled style={{width: 300}} value='233'/>
                                  </Col>
                          })
                        }
                      </Row>
            })
          }
        </div>
        <Original></Original>
        <Revision></Revision>
      </div>
    )
  }
}