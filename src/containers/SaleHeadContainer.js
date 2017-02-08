import React,{Component} from 'react';
import {Table, Row, Col,Layout,Input,Modal,InputNumber} from 'antd';
import Logo from "../test.png";
import Cube from '../components/Cube';
import Search from '../components/Search';
import CustomerContainer from '../containers/CustomerContainer';
import CouponContainer from '../containers/CouponContainer';
import * as Message from '../constants/Message.js';


class SaleHeadContainer extends Component
{
    constructor(props){
        super(props);
    }


    render(){
        const {Header ,Content,Sider,Footer} = Layout;
        return (
            <Row className="fill">
                <Col span={4}  style={{height:'100%',textAlign:'center' , padding:'3px 1.5px 3px 3px'}}>
                    <img onClick={this.props.menuChangeHandle} style={{height:'100%',width:'100%',cursor:'pointer'}} src={Logo} />
                </Col>
                <Col span={20} style={{height:'100%'}}>
                    <Row className="headerMenu">
                        <Col > 
                            <Cube text={Message.B} backgroundColor={'#41a7ec'} hoverBackgroundColor={'#327daf'} color={'#fff'} hoverColor={'#fff'} />
                        </Col>
                        <Col >
                            <CouponContainer />
                        </Col>
                        <Col > <Cube text={Message.D} /> </Col>
                        <Col > <CustomerContainer />
                         </Col>
                    </Row>
                    <Row className="fill-width height-p50">
                         <Search />
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default SaleHeadContainer;