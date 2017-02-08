import React,{Component} from 'react';
import {Input,Button,Row,Col} from 'antd';
import 'antd/dist/antd.css';
import {connect} from 'react-redux';
import '../index.css';
import {toDecimal2} from '../common/math';
import * as Message from '../constants/Message.js';

class SaleResultContainer extends Component{
    constructor(){
        super();
        this.toDecimal2=toDecimal2.bind(this);
    }
    render(){
        const {saleresult}=this.props;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        };
        return (
            <div className="fill color-white">
                <Row >
                    <Col className='block-center salepayment-header'>
                        <b>{Message.RESULT_DETAIL}</b>
                    </Col>
                </Row>
                <Row className='saleresult-row'>
                    <Col span={5} offset={2} className='saleresult-label'>金额</Col>
                    <Col span={8} className='saleresult-input'>
                    {toDecimal2(saleresult.total)}
                    </Col>
                    <Col span={2} className='saleresult-label'>元</Col>
                </Row>

                <Row className='saleresult-row'>
                    <Col span={5} offset={2} className='saleresult-label' >折扣</Col>
                    <Col span={15} className='saleresult-input'>
                        {toDecimal2(saleresult.discount)}
                    </Col>
                    <Col span={2} className='saleresult-label'>元</Col>
                </Row>

                <Row className='saleresult-row'>
                    <Col span={5} offset={2} className='saleresult-label' style={{fontSize:'20px',paddingTop:'1px'}}>总计</Col>
                    <Col span={15} className='saleresult-input'  style={{color:'red',fontSize:'20px',paddingTop:'0px'}}>
                        {toDecimal2(saleresult.subTotal)}
                    </Col>
                    <Col span={2} className='saleresult-label'>元</Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        saleresult: state.saleResult
    };
}

function mapDispatchToProps(dispatch) {
    return {
        //itemChange:(item)=>dispatch(itemChange(item))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SaleResultContainer);

