import React,{Component} from 'react';
import {Table, Row, Col,Layout,Input,Modal,Spin} from 'antd';
import Logo from "../test.png";
import Cube from '../components/Cube';
import Search from '../components/Search';
import {connect} from 'react-redux';
import {getCustomer} from '../actions/customer';
import {getAccount} from '../common/request';
import {message as MessageBox} from '../common/message';
import * as Message from '../constants/Message.js';
import * as ActionTypes from '../constants/ActionTypes';

class CustomerContainer extends Component{
    constructor(){
        super();

        this.customerModalShowHandle=this.customerModalShowHandle.bind(this);
        this.customerModalHideHandle=this.customerModalHideHandle.bind(this);
        this.customerModalOKHandle=this.customerModalOKHandle.bind(this);

        this.custNoChangeHandle=this.custNoChangeHandle.bind(this);
        this.cellNoChangeHandle=this.cellNoChangeHandle.bind(this);
        this.custCardNoChangeHandle=this.custCardNoChangeHandle.bind(this);
}
    state={
        customerModal:{
            visible:false,
            confirmLoading:false,
            title:Message.MSGC01,
            closable:true,
            onOk:this.customerModalOKHandle.bind(this),
            onCancel:this.customerModalHideHandle.bind(this),
            okText:Message.SEARCH,
            cancelText:Message.CLOSE,
            maskClosable:false
        },
        searchInfo:{
            custNo:'',
            cellNo:'',
            custCardNo:''
        }
    }
    customerModalShowHandle(){
        const {customer}=this.props;
        console.log(customer.status);
        
        this.state.searchInfo.custNo='';
        this.state.searchInfo.cellNo='';
        this.state.searchInfo.custCardNo='';

        this.state.customerModal.visible=true;
        this.setState(this.state);
    }

    customerModalHideHandle(){
        this.state.customerModal.visible=false;
        this.setState(this.state);
    }

    customerModalOKHandle(){
        const {customer}=this.props;
        if(customer.status===ActionTypes.CUSTOMER_REQUEST){
            return ;
        }
        var searchInfo=this.state.searchInfo;
        if(searchInfo.cellNo===''&&searchInfo.custCardNo===''&&searchInfo.custNo===''){
            MessageBox('error','',Message.MSG14);
            return;
        }
        const {getCustomer}=this.props;
        getCustomer(getAccount().brandCode,searchInfo.custNo,'','',searchInfo.cellNo,searchInfo.custCardNo,this.customerModalHideHandle);
    }

    custNoChangeHandle(e){
        this.state.searchInfo.custNo=e.target.value;
        this.setState(this.state);
    }
    cellNoChangeHandle(e){
        this.state.searchInfo.cellNo=e.target.value;
        this.setState(this.state);
    }
    custCardNoChangeHandle(e){
        this.state.searchInfo.custCardNo=e.target.value;
        this.setState(this.state);
    }
    render(){
        const {customer}=this.props;

        var custNoValue=this.state.searchInfo.custNo;
        var cellNoValue=this.state.searchInfo.cellNo;
        var custCardNoValue=this.state.searchInfo.custCardNo;
        var cellNoStr=undefined;
        var titleStr=Message.E;
        var loading=false;
        let text=Message.E;
        let style={};

        if(customer.status===ActionTypes.CUSTOMER_CHANGE){
            text=(
                <div className="fill">
                    <table className="custCell">
                        <tr>
                            <td>
                                {"顾客名"}
                            </td>
                            <td>
                                {customer.data.name}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {"手机号"}
                            </td>
                            <td>
                                {customer.data.cellNo}
                            </td>
                        </tr>
                    </table>
                </div>
            );
            style={fontSize:'17px'};
            //custNoValue=customer.data.custNo;
            //cellNoValue=customer.data.cellNo;
            //custCardNoValue=customer.data.custCardNo;
        }
        
        if(customer.status===ActionTypes.CUSTOMER_REQUEST){
            loading=true;
        }
        
        return (
            <div className="fill">
                <Cube text={text} style={style} onClick={this.customerModalShowHandle}/>
                            <Modal {...this.state.customerModal}>    
                                <Spin tip={Message.LOADING} spinning={loading} delay={50}>            
                                    <div className="block-center">
                                        <Row className="padding-top-3">
                                            <Col span={8} className="block-right padding-top-3 padding-right-3 login-font">
                                                <span>{Message.VIPCODE}</span>
                                            </Col>
                                            <Col span={10}>
                                                <Input onChange={this.custNoChangeHandle} value={custNoValue}/>
                                            </Col>
                                        </Row>
                                        <Row className="padding-top-3">
                                            <Col span={8} className="block-right padding-top-3 padding-right-3 login-font">
                                                <span>{Message.CELLNO}</span>
                                            </Col>
                                            <Col span={10}>
                                                <Input onChange={this.cellNoChangeHandle} value={cellNoValue}/>
                                            </Col>
                                        </Row>
                                        <Row className="padding-top-3">
                                            <Col span={8} className="block-right padding-top-3 login-font" style={{paddingRight:'15px'}}>
                                                <span>{Message.CUSTNO}</span>
                                            </Col>
                                            <Col span={10}>
                                                <Input onChange={this.custCardNoChangeHandle} value={custCardNoValue}/>
                                            </Col>
                                        </Row>
                                    </div>
                                </Spin>
                            </Modal>
            </div>
            );
    }
}


function mapStateToProps(state) {
    return { 
        customer:state.customer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCustomer:(brandCode, custNo, email, custName, cellNo, custCardNo,hideModal)=>dispatch(getCustomer(brandCode, custNo, email, custName, cellNo, custCardNo,hideModal))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerContainer);