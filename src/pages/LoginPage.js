import React, { Component } from 'react';
import LoginContainer from '../containers/LoginContainer';
import { Row, Col,Panel} from 'antd';
import 'antd/dist/antd.css';
import Logo from '../imgs/logo.png';
import Logo_ from '../imgs/logo_.png';

const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

export default class LoginPage extends Component {
    render() {
        const { params } = this.props;
        return (
            <div className='block-center' style={{height:'90%'}}>
            <div className='centered' style={{border:'1px',borderStyle:'ridge',width:'650px',height:'438px'}}>
                <Row>
                    <p style={{height:'60px'}}></p>
                </Row>
                <Row>
                    <Col span={2}/>
                    <Col span={20}>
                            <img src={Logo} />
                    </Col>
                    <Col span={2}/>
                </Row>
                <Row>
                    <Col span={2}/>
                    <Col span={20} >
                        <img src={Logo_} style={{width:"278px"}}/>
                    </Col>
                    <Col span={2}/>
                </Row>
                <Row>
                    <p style={{height:'18px'}}></p>
                </Row>
                <Row>
                    <Col span={2}/>
                    <Col span={20}>
                        <LoginContainer />
                    </Col>
                    <Col span={2}/>
                </Row>
            </div>
            </div>
        );
    }
}