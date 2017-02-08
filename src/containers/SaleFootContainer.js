import React,{Component} from 'react';
import Cube from '../components/Cube';
import {Table,Row,Col,Layout,Modal,InputNumber,Icon} from 'antd';
import {connect} from 'react-redux';
import {salePaymentChange,salePayChange} from '../actions/salePayment';
import {orderSave} from '../actions/orderCreate';
import {message as MessageBox} from '../common/message';
import {itemChange} from '../actions/saleItem';
import {saleResultChange} from '../actions/saleResult';
import {salesmanChange} from '../actions/salesman';
import {initCustomer} from '../actions/customer';
import {initCoupon} from '../actions/coupon';
import * as Message from '../constants/Message.js'

class SaleFootContainer extends Component{

    constructor(props){
        super(props);

        this.setPayment=this.setPayment.bind(this);
        this.getUnPayAmt=this.getUnPayAmt.bind(this);
        this.onModalOpenCheck=this.onModalOpenCheck.bind(this);

        this.cashModalShowHandle=this.cashModalShowHandle.bind(this);
        this.cashModalHideHandle=this.cashModalHideHandle.bind(this);
        this.cashModalOKHandle=this.cashModalOKHandle.bind(this);
        this.cashModalInputTextChangeHandle=this.cashModalInputTextChangeHandle.bind(this);

        this.orderSave=this.orderSave.bind(this);
        this.orderSaveSuccess=this.orderSaveSuccess.bind(this);
        this.orderSaveFailure=this.orderSaveFailure.bind(this);

        this.mainLandModalShowHandle=this.mainLandModalShowHandle.bind(this);
        this.mainLandModalHideHandle=this.mainLandModalHideHandle.bind(this);
        this.mainLandModalOKHandle=this.mainLandModalOKHandle.bind(this);
        this.mainLandModalInputTextChangeHandle=this.mainLandModalInputTextChangeHandle.bind(this);

        this.abroadModalShowHandle=this.abroadModalShowHandle.bind(this);
        this.abroadModalHideHandle=this.abroadModalHideHandle.bind(this);
        this.abroadModalOKHandle=this.abroadModalOKHandle.bind(this);
        this.abroadModalInputTextChangeHandle=this.abroadModalInputTextChangeHandle.bind(this);
    }
    
    componentDidMount(){
        this.setState({
            visible:false
        });
    }

    state={
        cashModal:{
            /* ==== */
            visible:false,
            confirmLoading:false,
            title:Message.CASH_PAY,
            closable:false,
            onOk:this.cashModalOKHandle.bind(this),
            onCancel:this.cashModalHideHandle.bind(this),
            okText:Message.OK,
            cancelText:Message.CANCEL,
            //footer:(<p>2</p>),
            /* ==== */
            price:0,
            currentPrice:0
        },
        mainLandModal:{
            /* ==== */
            visible:false,
            confirmLoading:false,
            title:Message.MAIN_LAND_PAY,
            closable:false,
            onOk:this.mainLandModalOKHandle.bind(this),
            onCancel:this.mainLandModalHideHandle.bind(this),
            okText:Message.OK,
            cancelText:Message.CANCEL,
            //footer:(<p>2</p>),
            /* ==== */
            price:0,
            currentPrice:0
        },
        abroadModal:{
            /* ==== */
            visible:false,
            confirmLoading:false,
            title:Message.ABROAD_PAY,
            closable:false,
            onOk:this.abroadModalOKHandle.bind(this),
            onCancel:this.abroadModalHideHandle.bind(this),
            okText:Message.OK,
            cancelText:Message.CANCEL,
            //footer:(<p>2</p>),
            /* ==== */
            price:0,
            currentPrice:0
        },
        paymentLoader:[],
        saveState:{
            icon:undefined,
            clickedIcon:(<Icon type="loading" />)
        },
        zeroFlag:false
    }

    onModalOpenCheck(){
        return true;
    }

    setPayment(paymentType,price){
        var {salePayChange,salePay,saleResult} = this.props;

        if((!price||price<=0)){
            //check saleResult.subTotal==0 
            if(!(saleResult.subTotal==0&&(salePay.paymentLoader||[]).length<=0)){
                MessageBox('error','',Message.MSG05);
                return;
            }
        }

        if(price>((saleResult.subTotal||0.00)-((salePay.cashPaid||0.00)+(salePay.mainlandCardPaid||0.00)+(salePay.aboradCardPaid||0.00)))){
            MessageBox('error','',Message.MSG07);
            return;
        }

        let newItem = {
            paymentType:paymentType,
            amt:price
        };
        if(!salePay.paymentLoader){
            salePay.paymentLoader=[];
        }
        salePay.paymentLoader.push(newItem);

        let cashPaid = 0.00;
        let mainlandPaid=0.00;
        let abroadPaid=0.00;

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

    getUnPayAmt(){
        const {saleResult,salePay} = this.props;
        return (((saleResult.subTotal||0.00)-((salePay.cashPaid||0.00)+(salePay.mainlandCardPaid||0.00)+(salePay.aboradCardPaid||0.00))));
    }

    getPayCheckResult(){
        const {saleResult} = this.props;
        return saleResult.qty>0||MessageBox('error','',Message.MSG06);
    }

    cashModalShowHandle(){
        if(!this.getPayCheckResult()) return;
        this.state.cashModal.visible=true;
        this.state.cashModal.currentPrice=this.getUnPayAmt();
        this.setState(this.state);
    }

    cashModalHideHandle(){
        this.state.cashModal.visible=false;
        this.state.cashModal.currentPrice=this.state.cashModal.price;
        this.setState(this.state);
    }

    cashModalOKHandle(){
        let cashPrice = this.state.cashModal.currentPrice;
        let paymentType=Message.CASH_PAY;
        this.state.cashModal.price=cashPrice;
        this.setState(this.state);
        this.setPayment(paymentType,cashPrice);
        this.cashModalHideHandle();
    }

    cashModalInputTextChangeHandle(value){
        this.state.cashModal.currentPrice=value;
        this.setState(this.state);
    }

    mainLandModalShowHandle(){
        if(!this.getPayCheckResult()) return;
        this.state.mainLandModal.visible=true;
        this.state.mainLandModal.currentPrice=this.getUnPayAmt();
        this.setState(this.state);
    }

    mainLandModalHideHandle(){
        this.state.mainLandModal.visible=false;
        this.state.mainLandModal.currentPrice=this.state.mainLandModal.price;
        this.setState(this.state);
    }

    mainLandModalOKHandle(){
        let mainLandPrice = this.state.mainLandModal.currentPrice;
        this.state.mainLandModal.price=mainLandPrice;
        this.setState(this.state);
        this.setPayment(Message.MAIN_LAND_PAY,mainLandPrice);
        this.mainLandModalHideHandle();
    }

    mainLandModalInputTextChangeHandle(value){
        this.state.mainLandModal.currentPrice=value;
        this.setState(this.state);
    }

    abroadModalShowHandle(){
        if(!this.getPayCheckResult()) return;
        this.state.abroadModal.visible=true;
        this.state.abroadModal.currentPrice=this.getUnPayAmt();
        this.setState(this.state);
    }

    abroadModalHideHandle(){
        this.state.abroadModal.visible=false;
        this.state.abroadModal.currentPrice=this.state.abroadModal.price;
        this.setState(this.state);
    }

    abroadModalOKHandle(){
        let abroadPrice = this.state.abroadModal.currentPrice;
        this.state.abroadModal.price=abroadPrice;
        this.setState(this.state);
        this.setPayment(Message.ABROAD_PAY,abroadPrice);
        this.abroadModalHideHandle();
    }

    abroadModalInputTextChangeHandle(value){
        this.state.abroadModal.currentPrice=value;
        this.setState(this.state);
    }

    /******************************/
    orderSave(cancelHandle){
        const{saleItem,saleResult,salePayment,salesman,customer,coupon,orderSave}=this.props;
        orderSave(saleItem.item,saleResult,salePayment,salesman,customer.data,coupon.content,undefined,this.orderSaveSuccess,cancelHandle);
    }

    orderSaveFailure(cancelHandle){
        alert("im failure");
        cancelHandle();
    }

    orderSaveSuccess(){
        //alert('you should redirect ! ');
        const {saleItemChange,saleResultChange,salePayChange,salesmanChange,initCustomer,initCoupon}=this.props;
        saleItemChange([]);
        saleResultChange([]);
        salePayChange({});
        salesmanChange({});
        initCustomer();
        initCoupon();
    }

    
    /******************************/
    render(){
    const {Header ,Content,Sider,Footer} = Layout;
    const {saleModalChange,order} = this.props;

        return (
            <div className="fill" style={{backgroundColor:'yellow'}}>
                <Layout style={{height:'100%',backgroundColor:'#eee',flexWrap:'nowrap'}}>
                        <Content className="fill-height" style={{width:'80%',overflowX:'hidden'}}>
                            <Row className="footerMenu fill-height">
                                <Col>
                                    <Cube onClick={this.cashModalShowHandle} text={Message.G} backgroundColor={'#fff'} hoverBackgrounColor='#eee' color='#000' hoverColor='#000'  />
                                    <Modal {...this.state.cashModal}>                
                                        <div className="block-center">
                                            <span>{Message.PAY}:</span>
                                            <InputNumber 
                                            min={0} 
                                            max={100000} 
                                            step={0.1}
                                            value={this.state.cashModal.currentPrice}
                                            onChange={this.cashModalInputTextChangeHandle.bind(this)}/>
                                        </div>
                                    </Modal>
                                </Col>
                                <Col >
                                    <Cube onClick={this.mainLandModalShowHandle} text={Message.H} backgroundColor={'#fff'} hoverBackgrounColor='#eee' color='#000' hoverColor='#000'  />
                                    <Modal {...this.state.mainLandModal}>                
                                        <div className="block-center">
                                            <span>{Message.PAY}:</span>
                                            <InputNumber 
                                            min={0} 
                                            max={100000} 
                                            step={0.1}
                                            value={this.state.mainLandModal.currentPrice}
                                            onChange={this.mainLandModalInputTextChangeHandle.bind(this)}/>
                                        </div>
                                    </Modal>
                                </Col>
                                <Col >
                                    <Cube onClick={this.abroadModalShowHandle} text={Message.I} backgroundColor={'#fff'} hoverBackgrounColor='#eee' color='#000' hoverColor='#000'  />
                                    <Modal {...this.state.abroadModal}>                
                                        <div className="block-center">
                                            <span>{Message.PAY}:</span>
                                            <InputNumber 
                                            min={0} 
                                            max={100000} 
                                            step={0.1}
                                            value={this.state.abroadModal.currentPrice}
                                            onChange={this.abroadModalInputTextChangeHandle.bind(this)}/>
                                        </div>
                                    </Modal> 
                                </Col>
                            </Row>
                        </Content>
                        <Sider className="fill-height" width={300} style={{backgroundColor:'#eee',position:'relative',paddingLeft:'3px'}}>
                            <div className="fill padding-top-3 padding-bottom-3 padding-right-3">
                                <Cube onClick={this.orderSave} /*order.status==='ORDER_SAVE_REQUEST'?undefined:*/
                                icon={order.status==='ORDER_SAVE_REQUEST'?undefined:this.state.saveState.icon} 
                                clickedIcon={this.state.saveState.clickedIcon} text={Message.J} backgroundColor={'#ff7f79'} hoverBackgroundColor={'#c5534e'} color='#000' hoverColor='#000'  />
                            </div>
                        </Sider>
                </Layout>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        modal: state.modal,
        saleItem:state.saleItem,
        saleResult:state.saleResult,
        salesman:state.salesman,

        salePayment: state.salePayment,
        salePay:state.salePay,
        order:state.order,
        customer:state.customer,
        coupon:state.coupon
    };
}

function mapDispatchToProps(dispatch) {
    return {

        orderSave:(saleItem,saleResult,salePayment,salesman,customer,coupon,origOrder,
        successCallback,failureCallback)=>dispatch(
            orderSave(saleItem,saleResult,salePayment,salesman,customer,coupon,origOrder,
            successCallback,failureCallback)),
        
        salePaymentChange:(salePayment)=>dispatch(salePaymentChange(salePayment)),
        salePayChange:(payment)=>dispatch(salePayChange(payment)),
        saleItemChange:(item)=>dispatch(itemChange(item)),
        saleResultChange:(result)=>dispatch(saleResultChange(result)),
        salesmanChange:(salesman)=>dispatch(salesmanChange(salesman)),
        initCustomer:()=>dispatch(initCustomer()),
        initCoupon:()=>dispatch(initCoupon())
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SaleFootContainer);

//export default SaleFootContainer;