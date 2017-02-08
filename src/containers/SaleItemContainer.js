import React,{Component} from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Icon, Button, Popconfirm,InputNumber,Row, Col,Spin } from 'antd';
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
import {setCoupon,calculate} from '../actions/coupon';
import {initCoupon} from '../actions/coupon';
import * as CommonMath from '../common/math.js';
import * as Types from '../constants/ActionTypes';
import * as Message from '../constants/Message.js';

class SaleItemContainer extends Component {
  constructor(props) {

    super(props);
        const saleItem=[];
        const {itemChange,saleResultChange}=this.props;

        itemChange(saleItem);
        saleResultChange(saleItem);

        this.onDelete=this.onDelete.bind(this);
        this.onQtyChange=this.onQtyChange.bind(this);
        this.clear=this.clear.bind(this);
        this.shoppingCartClear=this.shoppingCartClear.bind(this);
        this.checkCoupon=this.checkCoupon.bind(this);
        this.changeCalculateIntoToLocal=this.changeCalculateIntoToLocal.bind(this);
        this.arrayCopy=this.arrayCopy.bind(this);
        this.deepCopy=this.deepCopy.bind(this);
    }

    state = {
        tableItem:{
            bordered: false,
            loading: false,
            pagination: false,
            size: 'middle',
            scroll: undefined,
            columns:[{

                        width:'5%',
                        title:'序号',
                        dataIndex:'key',
                        render(text,record,index){
                            return (
                                <div>
                                    <p>
                                        {index+1}
                                    </p>
                                </div>
                            );
                        }
                    },
                        {
                        width:'25%',
                        title: '商品号',
                        dataIndex: 'prodCode'
                    }, {
                        width:'15%',
                        title: '价格',
                        dataIndex: 'price',
                        render(text){
                            return (
                                <div >
                                    <p>
                                        {Message.CURRENCY}{CommonMath.thousandBitSeparator(CommonMath.toDecimal2(text))}
                                    </p>
                                </div>
                            );
                        }
                    },{
                        width:'15%',
                        title:'数量',
                        dataIndex:'qty',
                        render:(text,record,index)=>{
                            return (
                                    <NumericInput 
                                    className="form-control" 
                                    value={ 54 }
                                    disabled={(this.props.salePay.paymentLoader||[]).length>0} 
                                    min={ 1 } 
                                    max={ 100 } 
                                    step={ 1 } 
                                    precision={ 0 } 
                                    size={ 5 } 
                                    mobile
                                    value={text}
                                    onChange={this.onQtyChange(index)}
                                    />
                            )
                        }
                    }, {
                        width:'15%',
                        title:'折扣',
                        dataIndex:'discount',
                        render(text,record,index){
                            return (
                                <div>
                                    <p>
                                        {Message.CURRENCY}{CommonMath.thousandBitSeparator(CommonMath.toDecimal2(text)||0.00)}
                                    </p>
                                </div>
                            );
                        }
                    },{
                        width:'15%',
                        title:'销售金额',
                        dataIndex:'subTotal',
                        render(text){
                            return (
                                <div >
                                    <p>
                                        {Message.CURRENCY}{CommonMath.thousandBitSeparator(CommonMath.toDecimal2(text))}
                                    </p>
                                </div>
                            );
                        }
                    },{
                    width:'10%',
                    title: '删除',
                    dataIndex: 'operation',
                    render: (text, record, index) => {
                            return (
                                <div>
                                    <MdCancel className="sale-item-delete-button hover-pointer" size={30} onClick={this.onDelete(index)}   />
                                </div>
                            )
                        }
                    }]
        },
        isLoading:false
    }

  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }

  onQtyChange=(index)=>{
      return (value)=>{
          const {saleItem}=this.props;
          const {itemChange,saleResultChange}=this.props;
          const dataSource=saleItem.item;
          let dataSourceClone = this.arrayCopy(dataSource);
          dataSource[index]['qty']=value;
          dataSource[index]['subTotal']=dataSource[index]['price']*value;
          dataSource[index]['total']=dataSource[index]['price']*value;
          this.checkCoupon({
                source:dataSourceClone,
                destination:dataSource,
                isShowMsg:false,
                success:function(ds){
                    itemChange(ds);
                    saleResultChange(ds);
                },
                failure:function(ds){
                    MessageBox("error",Message.MSG24);
                    itemChange(ds);
                    saleResultChange(ds);
                }
            });
          /*itemChange(dataSource);
          saleResultChange(dataSource);*/
      }
  }

  onDelete(index){
        return () => {
            const {saleItem,salePay}=this.props;
            const{itemChange,saleResultChange}=this.props;
            const dataSource = saleItem.item;
            if((salePay.paymentLoader||[]).length>0){
                MessageBox('error','',Message.MSG08);
                return ;
            }
            let dataSourceClone = this.arrayCopy(dataSource);
            dataSourceClone.splice(index, 1);

            this.checkCoupon({
                source:dataSource,
                destination:dataSourceClone,
                isShowMsg:false,
                success:function(ds){
                    itemChange(ds);
                    saleResultChange(ds);
                },
                failure:function(ds){
                    MessageBox("error",Message.MSG23);
                    itemChange(ds);
                    saleResultChange(ds);
                }
            });


            /*itemChange(dataSource);
            saleResultChange(dataSource);*/
        };
  }

  /*{
      source:{...},
      destination:{...}
  }*/
  checkCoupon(item,callback){
      const {calculate,setLoading,coupon} = this.props;
      //setLoading(false);
      if(coupon.content&&coupon.content.couponNo){
          setLoading(true);
          let resultData = calculate(coupon.content,item.destination,undefined,item.isShowMsg,function(responseData){//success callback
              let localData = this.changeCalculateIntoToLocal(responseData.calculateItems,item.destination);
              setLoading(false);
        }.bind(this),function(errorTitle,errrDetail){//error callback
            if(errorTitle==Message.MSG15){
                MessageBox("error",errorTitle);
            }
            setLoading(false);
            item.failure(item.source)
        });
      }else{
          item.success(item.destination);
      }
  }

  changeCalculateIntoToLocal(remoteData,destination){
        //approval
        let {saleItem} = this.props;
        const {itemChange,saleResultChange,setLoading}=this.props;
        if(!Array.isArray(saleItem.item)||saleItem.item.length<=0){
            MessageBox('error',Message.MSG06);
            return;
        }
        
        if(!Array.isArray(remoteData)||remoteData.length<=0){
            MessageBox('error',Message.MSG15);
            return;
        }

        let resultData=[];
        remoteData.map(function(v,i){
            destination.map(function(vv,ii){
                if(vv.prodCode===v.productCode){
                    vv.discount=v.discountAmount;
                    vv.subTotal=v.subTotal;
                    vv.total=v.total;
                    resultData.push({
                        key:i,
                        prodCode:vv.prodCode,
                        price:vv.price,
                        qty:vv.qty,
                        brandCode:vv.brandCode,
                        discount:v.discountAmount,
                        subTotal:v.subTotal,
                        total:v.total,
                        itemCode:vv.itemCode,
                        styleCode:vv.styleCode
                    });
                    //vv.price=v.total;
                }
            });
        });

        /*
                key:saleItem.item.length+1,
                prodCode:newPrd.prodCode,
                price:newPrd.price,
                qty:1,
                discount:0.0,
                subTotal:newPrd.price,
                brandCode:newPrd.brandCode,
                total:newPrd.price,
                itemCode:newPrd.itemCode,
                styleCode:newPrd.styleCode
        */

        console.log(JSON.stringify("#changeCalculateIntoToLocal:"+resultData));
        itemChange(resultData);
        saleResultChange(resultData);
        return true;
    }

  clear(){

  }

  shoppingCartClear(){

      const {itemChange,saleResultChange,salePayChange,salePay,initCustomer,initCoupon}=this.props;
      let {coupon} = this.props;

      var _salePay = salePay;
      if(Array.isArray(_salePay.paymentLoader)&&_salePay.paymentLoader.length>=1){
          MessageBox('error','',Message.MSG08);
          return ;
      }
      _salePay.paymentLoader=undefined;
      _salePay.cashPaid=undefined;
      _salePay.mainlandCardPaid=undefined;
      _salePay.mainlandCardPaid=undefined;
      _salePay.aboradCardPaid=undefined;
      coupon.content=undefined;
      itemChange([]);
      saleResultChange([]);
      initCustomer();
      initCoupon();
  }

  arrayCopy(o){
        if (o instanceof Array) {
            let n = [];
            for (var i = 0; i < o.length; ++i) {
                n[i] = this.deepCopy(o[i]);
            }
            return n;
        }
    }

    deepCopy(source) { 
        var result={};
        for (var key in source) {
            result[key] = typeof source[key]==='object'? this.deepCoyp(source[key]): source[key];
        } 
        return result; 
    }


  render() {
    const {saleItem,saleResult,coupon}=this.props;
    console.log("isLoading:"+this.props.saleItem.isLoading);
    if(saleItem.isLoading===undefined){
        saleItem.isLoading=false;
    }
    return (
    <div className="fill color-white padding-3">
        <div className="fill" style={{height:'90%',overflowY:'scroll'}} >
            <Spin tip={Message.LOADING} className="fill" spinning={saleItem.isLoading} >
                <Table {...this.state.tableItem} dataSource={saleItem.item}/>
            </Spin>
        </div>
        <div className="sale-item-bottomBox fill-width" style={{height:'10%'}}>
            <Row className="fill-height">
                <Col className="fill-height" span={4} offset={16}>
                    <div className="fill padding-3">
                        <div className="fill block-center" style={{display:'block',textAlign:'center',fontSize:'21px'}}>
                            <div className="centered">
                                <b>{Message.PRODUCT_COUNT}:{saleResult.qty}</b> 
                            </div>
                        </div>
                    </div>
                </Col>
                <Col className="fill-height" span={4}>
                    <div className="fill padding-3">
                        <Cube text={Message.F} fontSize={'15px'} icon={<Icon type="shopping-cart" />} backgroundColor={'#ff7f79'} hoverBackgroundColor={'#c5534e'} onClick={this.shoppingCartClear} />
                    </div>
                </Col>
            </Row>
        </div>
    </div>);
  }
}

function mapStateToProps(state) {
    return { 
        saleItem: state.saleItem,
        saleResult:state.saleResult,
        salePay:state.salePay,
        coupon:state.coupon
    };
}

function mapDispatchToProps(dispatch) {
    return {
        itemChange:(item)=>dispatch(itemChange(item)),
        saleResultChange:(item)=>dispatch(saleResultChange(item)),
        salePayChange:(item)=>dispatch(salePayChange(item)),
        initCustomer:()=>dispatch(initCustomer()),
        setLoading:(value)=>dispatch(setLoading(value)),
        initCoupon:()=>dispatch(initCoupon()),
        calculate:(couponNo,prodList,isReSale,isShowMsg,successCallback,failureCallback)=>dispatch(calculate(couponNo,prodList,isReSale,isShowMsg,successCallback,failureCallback))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SaleItemContainer);

