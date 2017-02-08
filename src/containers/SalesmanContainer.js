import React,{Component} from 'react';
import {Row,Col,Input,Select} from 'antd';
import 'antd/dist/antd.css';
import '../index.css';
import {connect} from 'react-redux';
import {salesmanChange} from '../actions/salesman';
import {getAccount}from '../common/request';
import Employee from '../apis/employee'; 
import * as Message from '../constants/Message.js';
class SalesmanContainer extends Component{
    constructor(){
        super();
        this.cashierNameChange=this.cashierNameChange.bind(this);
        this.storeReceiptNoChange=this.storeReceiptNoChange.bind(this);
        Employee.employees(getAccount().brandCode,getAccount().shopCode,
        (data)=>{
            this.setState({employeeList:data});
            const {salesmanChange}=this.props;
            salesmanChange(
            {
                cashierName:getAccount().userId,
                storeReceiptNo:''
            });    
        },
        ()=>{}
        );
    }    

    cashierNameChange(value){
        const {salesman}=this.props;
        //this.setState({storeReceiptNo:this.state.storeReceiptNo,cashierName:value});
        const {salesmanChange}=this.props;
        salesmanChange({
            storeReceiptNo:salesman.storeReceiptNo,
            cashierName:value,
            employeeList:salesman.employeeList
        });
    }

    storeReceiptNoChange(e){
        //this.setState({cashierName:this.state.cashierName,storeReceiptNo:e.target.value});
        const {salesmanChange,salesman}=this.props;
        salesmanChange({
            cashierName:salesman.cashierName,
            storeReceiptNo:e.target.value,
            employeeList:salesman.employeeList
        });
    }

    render(){
        const {salesman}=this.props;
        let employeeOptions = [];
        let employeeMapping = this.state?this.state.employeeList : [];
        
        
        employeeMapping.forEach(function(item){
            employeeOptions.push(<Select.Option key={item.userID} value={item.userID}>{item.userName}</Select.Option>);
        });
        const cashierName=salesman.cashierName?salesman.cashierName:getAccount().userId;
        let select =<Select value={cashierName} onChange={this.cashierNameChange} style={{ width:'100%'}}>{employeeOptions}</Select>;
        //let select =<Select defaultValue={salesman.cashierName} style={{ width: '100%' }} ><Select.Option value={salesman.cashierName} >{salesman.cashierName}</Select.Option></Select>;
        return(
        <div className='fill color-white sale-border'>
                <Row style={{paddingTop:'15px'}}>
                    <Col span={4} className='salepayment-label'>
                        {Message.RECEIPT_NO}
                    </Col>
                    <Col span={15}>
                        <Input className='salesman-input' value={salesman.storeReceiptNo}
                        onChange={this.storeReceiptNoChange}/>
                    </Col>
                </Row>
                <Row style={{paddingTop:'10px'}}>
                    <Col span={4} className='salepayment-label'>
                        {Message.CASHIER}
                    </Col>
                    <Col span={15}> 
                        {select}
                    </Col>
                </Row>
        </div>
        )
    }
}


function mapStateToProps(state) {
    return { 
        salesman:state.salesman
    };
}

function mapDispatchToProps(dispatch) {
    return {
        salesmanChange:(salesman)=>dispatch(salesmanChange(salesman))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SalesmanContainer);