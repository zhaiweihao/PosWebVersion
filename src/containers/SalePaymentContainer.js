import React,{Component} from 'react';
import {Row,Col,Input} from 'antd';
import 'antd/dist/antd.css';
import '../index.css';
import {connect} from 'react-redux';
import {toDecimal2} from '../common/math';
import MdCancel from 'react-icons/lib/md/cancel';
import {salePaymentChange,salePayChange} from '../actions/salePayment';
import * as Payment from '../constants/PaymentMethod';
import * as Message from '../constants/Message.js';


class SalePaymentContainer extends Component{
    constructor(){
        super();
        
        this.toDecimal2=toDecimal2.bind(this);
        this.getPaymentResult=this.getPaymentResult.bind(this);
        this.removePayment=this.removePayment.bind(this);
    }

    getPaymentResult(payment,saleResult){
        if(saleResult===undefined){
            return {
            paid:0.00,
            waitPay:0.00,
            cashPaid:0.00,
            aboradCardPaid:0.00,
            mainlandCardPaid:0.00
            };
        }
        if(payment===undefined||!Array.isArray(payment)||!payment[0].paidAmt){
            payment=[];
            return {
            paid:0.00,
            waitPay:saleResult.subTotal,
            cashPaid:0.00,
            aboradCardPaid:0.00,
            mainlandCardPaid:0.00
            };
        }
        var paid=0.00;
        var cashPaid=0.00;
        var abroadCardPaid=0.00;
        var mainlandCardPaid=0.00;

        payment.forEach(function(item){
            paid+=item.paidAmt;
            if(item.paymentMethod===Payment.CASH){
                cashPaid+=item.paidAmt;
            }
            if(item.paymentMethod===Payment.ABROAD_CARD){
                abroadCardPaid+=item.paidAmt;
            }
            if(item.paymentMethod===Payment.MAINLAND_CARD){
                mainlandCardPaid+=item.paidAmt;
            }
        });
        const paymentResult={
            paid:paid,
            waitPay:saleResult.subTotal-paid,
            cashPaid:cashPaid,
            aboradCardPaid:abroadCardPaid,
            mainlandCardPaid:mainlandCardPaid
        };
        return paymentResult;
    }

    removePayment(e){
        let {salePay,salePayChange} = this.props;
        let cashPaid = 0.00;
        let mainlandPaid=0.00;
        let abroadPaid=0.00;
        let index= e.currentTarget.getAttribute("data-item-index");
        salePay.paymentLoader.splice(index, 1);
        salePay.paymentLoader.map(function(item,index){
            if(item.paymentType==Message.CASH_PAY){
                cashPaid+=item.amt;
            }else if(item.paymentType==Message.MAIN_LAND_PAY){
                mainlandPaid+=item.amt;
            }else if(item.paymentType==Message.ABROAD_PAY){
                abroadPaid+=item.amt;
            }
        });
        salePay.cashPaid=cashPaid;
        salePay.mainlandCardPaid=mainlandPaid;
        salePay.aboradCardPaid=abroadPaid;

        salePayChange({...salePay});
    }

    render(){
        const payment=this.props.salePayment;
        const saleResult=this.props.saleResult;
        const paymentResult=this.getPaymentResult(payment,saleResult);
        const {salePay} = this.props;
        /*const salePay=this.props.salePay===undefined?{
            amt:saleResult===undefined?0.00:(saleResult.subTotal===undefined?0.00:saleResult.subTotal),
            paid:this.props.salePay===undefined?0.00:(this.props.salePay.paid===undefined?0.00:this.props.salePay.paid),
            waitPay:this.props.salePay===undefined?0.00:((this.props.salePay.amt===undefined?0.00:this.props.salePay.amt)-(this.props.salePay.paid===undefined?0.00:this.props.salePay.paid)),
            cashPaid:0.00,
            aboradCardPaid:0.00,
            mainlandCardPaid:0.00
        }:this.props.salePay;*/
        
        return(
            <div className='fill color-white sale-broder'>
                <div className="fill-width" style={{height:'30%'}}>
                <Row >
                    <Col className='block-center salepayment-header'>
                        <b>{Message.PAYMENT_DETAIL}</b>
                    </Col>
                </Row>
                <Row className='saleresult-row'>
                    <Col span={3} className='salepayment-label'>已付</Col>
                    <Col span={6} className='salepayment-input'>
                        {toDecimal2((salePay.cashPaid||0.00)+(salePay.mainlandCardPaid||0.00)+(salePay.aboradCardPaid||0.00))}
                    </Col>
                    <Col span={2} className='salepayment-label-small'>元</Col>
                    
                    <Col span={4} className='salepayment-label'>未付</Col>
                    <Col span={6} className='salepayment-input'>
                        {toDecimal2(((saleResult.subTotal||0.00)-((salePay.cashPaid||0.00)+(salePay.mainlandCardPaid||0.00)+(salePay.aboradCardPaid||0.00))))}
                    </Col>
                    <Col span={2} className='salepayment-label-small'>元</Col>
                </Row>
                {/*<Row className='saleresult-row'>
                    <Col span={3} className='salepayment-label'>现金</Col>
                    <Col span={6} className='salepayment-input'>
                        {toDecimal2(salePay.cashPaid||0.00)}
                    </Col>
                    <Col span={2} className='salepayment-label-small'>元</Col>
                    
                    <Col span={4} className='salepayment-label'>国内卡</Col>
                    <Col span={6} className='salepayment-input'>
                        {toDecimal2(salePay.mainlandCardPaid||0.00)}
                    </Col>
                    <Col span={2} className='salepayment-label-small'>元</Col>
                </Row>
                <Row className='saleresult-row'>
                    <Col span={4} offset={11} className='salepayment-label'>国外卡</Col>
                    <Col span={6} className='salepayment-input'>
                        {toDecimal2(salePay.aboradCardPaid||0.00)}
                    </Col>
                    <Col span={2} className='salepayment-label-small'>元</Col>
                </Row>*/}
                </div>
                <div className="fill-width" className="fill-width" style={{height:'70%',overflowY:"scroll",borderTop:'1px solid #ccc'}} >
                    {(salePay.paymentLoader||[]).map(function(item,index){
                        return (<Row key={index} className='saleresult-row'>
                            <Col span={8}  className='salepayment-label'>{item.paymentType}</Col>
                            <Col span={8}  className='salepayment-input'>
                                {toDecimal2(item.amt||0.00)}
                            </Col>
                            <Col span={2} className='salepayment-label-small'>元</Col>
                            <Col span={6} className='salepayment-label-small'>
                                <MdCancel className="hover-pointer" key={index} data-item-index={index} onClick={this.removePayment} size={15} />
                            </Col>
                        </Row>);
                    }.bind(this))}
                </div>
            </div>
        )
            
    }
}

function mapStateToProps(state) {
    return { 
        salePayment: state.salePayment,
        saleResult:state.saleResult,
        salePay:state.salePay
    };
}

function mapDispatchToProps(dispatch) {
    return {
        salePayChange:(payment)=>dispatch(salePayChange(payment))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SalePaymentContainer);

