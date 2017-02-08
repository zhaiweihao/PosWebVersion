import React,{Component} from 'react';
import 'antd/dist/antd.css';
import {Table, Input, Icon, Button, Popconfirm,InputNumber,Row, Col,Modal,Spin } from 'antd';
import {itemChange,setLoading} from '../actions/saleItem';
import {saleResultChange} from '../actions/saleResult';
import {salePayChange} from '../actions/salePayment';
import {connect} from 'react-redux';
import MdCancel from 'react-icons/lib/md/cancel';
import FaShoppingCart from 'react-icons/lib/fa/shopping-cart';
import NumericInput from 'react-numeric-input';
import Cube from '../components/Cube';
import {message as MessageBox} from '../common/message';
import {initCustomer} from '../actions/customer';
import {calculate} from '../actions/coupon';
import * as ActionTypes from '../constants/ActionTypes';
import * as CommonMath from '../common/math.js';
import * as Message from '../constants/Message.js';

class SaleItemContainer extends Component {
    constructor(props) {
        super(props);
            const saleItem=[];
            const {itemChange,saleResultChange}=this.props;

            this.couponModalShowHandle=this.couponModalShowHandle.bind(this);
            this.couponModalHideHandle=this.couponModalHideHandle.bind(this);
            this.couponModalOKHandle=this.couponModalOKHandle.bind(this);
            this.couponModalInputTextChangeHandle=this.couponModalInputTextChangeHandle.bind(this);
            this.changeCalculateIntoToLocal=this.changeCalculateIntoToLocal.bind(this);

            this.showLoading=this.showLoading.bind(this);
            this.hideLoading=this.hideLoading.bind(this);
    }
    
    state={
        couponModal:{
            visible:false,
            confirmLoading:false,
            title:Message.MSG12,
            closable:true,
            onOk:this.couponModalOKHandle.bind(this),
            onCancel:this.couponModalHideHandle.bind(this),
            okText:Message.SEARCH,
            cancelText:Message.CLOSE,
            maskClosable:false
        },
        couponLoading:false,
        couponNo:undefined
    }

    couponModalShowHandle(){
        const {coupon,customer,saleItem} = this.props;
        if(!customer||!customer.data||!customer.data.custNo){
            MessageBox("error",Message.MSG22);
            return ;
        }
        if(coupon.content&&coupon.content.couponNo){
            MessageBox("error",Message.MSG16);
            return ;
        }

        if((saleItem.item||[]).length<=0){
            MessageBox("error",Message.MSG21);
            return;
        }
        this.state.couponNo='';
        this.state.couponModal.visible=true;
        this.setState(this.state);
    }

    couponModalHideHandle(){
        this.state.couponModal.visible=false;
        this.setState(this.state);
    }

    couponModalOKHandle(){
        //coupon no check
        if(!this.state.couponNo){
            MessageBox("error",Message.MSG20);
            return;
        }

        const {calculate,setLoading} = this.props;
        let {saleItem} = this.props;
        setLoading(true);
        this.showLoading();
        calculate({
            couponNo:this.state.couponNo
        },saleItem.item,undefined,true,function(responseData){//success callback
            console.log("#in success callback");
            let localData = this.changeCalculateIntoToLocal(responseData.calculateItems);
            if(localData){
                this.couponModalHideHandle();
            }else{
                MessageBox("error",Message.MSG15);
            }
            this.hideLoading();
            setLoading(false);
            this.couponModalHideHandle();
        }.bind(this),function(errorMsg){//error callback
            console.log("#in failure callback");
            this.hideLoading();
            setLoading(false);
        }.bind(this));

    }

    changeCalculateIntoToLocal(remoteData){
        //approval
        let {saleItem} = this.props;
        const {itemChange,saleResultChange,setLoading}=this.props;
        if(!Array.isArray(saleItem.item)||saleItem.item.length<=0){
            MessageBox('error',Message.MSG06);
            return false;
        }
        
        if(!Array.isArray(remoteData)||remoteData.length<=0){
            MessageBox('error',Message.MSG15);
            return false;
        }

        remoteData.map(function(v,i){
            saleItem.item.map(function(vv,ii){
                if(vv.prodCode===v.productCode){
                    vv.discount=v.discountAmount;
                    vv.subTotal=v.subTotal;
                    vv.total=v.total;
                }
            });
        });

        itemChange(saleItem.item);
        saleResultChange(saleItem.item);
        return true;
    }

    showLoading(){
        this.state.couponLoading=true;
        this.setState(this.state);
    }

    hideLoading(){
        this.state.couponLoading=false;
        this.setState(this.state);
    }

    couponModalInputTextChangeHandle(value){
        this.state.couponNo=value.target.value;
        this.setState(this.state);
    }

  render() {
    const {saleItem,saleResult,coupon}=this.props;
        
    return (
    <div className="fill">
        <Cube text={Message.C} onClick={this.couponModalShowHandle}/>
        <Modal {...this.state.couponModal}>                
            <Spin tip={Message.LOADING} spinning={this.state.couponLoading} >   
                <div className="block-center">
                    <Row className="padding-top-3">
                        <Col span={8} className="block-right padding-top-3 padding-right-3 login-font">
                            <span>{Message.MSG13}:</span>
                        </Col>
                        <Col span={10}>
                            <Input
                            onChange={this.couponModalInputTextChangeHandle}
                            value={this.state.couponNo}/>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </Modal>
    </div>);
  }
}

function mapStateToProps(state) {
    return { 
        saleItem: state.saleItem,
        saleResult:state.saleResult,
        salePay:state.salePay,
        coupon:state.coupon,
        customer:state.customer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        itemChange:(item)=>dispatch(itemChange(item)),
        saleResultChange:(item)=>dispatch(saleResultChange(item)),
        salePayChange:(item)=>dispatch(salePayChange(item)),
        initCustomer:()=>dispatch(initCustomer()),
        setLoading:(value)=>dispatch(setLoading(value)),
        calculate:(coupon,prodList,isReSale,isShowMsg,successCallback,failureCallback)=>dispatch(calculate(coupon,prodList,isReSale,isShowMsg,successCallback,failureCallback))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SaleItemContainer);

