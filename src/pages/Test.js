import React , {Component} from 'react';
import {Button} from 'antd';
import {push as Menu}  from 'react-burger-menu';
import {Icon }from 'antd';
import OrderTest from '../apis/orderTest'; 

class Test extends Component{
    constructor(){
        super();

        this.onClickHandle=this.onClickHandle.bind(this);
    }
    onClickHandle(){
        OrderTest.crmCouponUpdate({
            couponId:"58958d848fb1f400013d3142",
            saleNo:["123test","321test"],
	        used:true,
	        usedPlaceCode:"test"
        },()=>{
            console.log('success');
        },(title,detail)=>{
            console.log(title+detail);
        })
    }
    render(){
        return (
            <div>
                <Button onClick={this.onClickHandle}></Button>
            </div>
        );
    }
}

export default Test;