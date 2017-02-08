import React , {Component} from 'react';
import {Input,Icon,Spin,Row,Col} from 'antd';
import {setResult} from '../actions/sale';
import {connect} from 'react-redux';
import axios from 'axios';
import {itemChange,itemAppend} from '../actions/saleItem';
import {saleResultChange} from '../actions/saleResult';
import {getAccount} from '../common/request.js';
import FaSearch from 'react-icons/lib/fa/search';
import MdCancel from 'react-icons/lib/md/cancel';
import * as Message from '../constants/Message.js';
import {message as MessageBox} from  '../common/message.js';
import Product from '../apis/product.js';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.props=props;
    this.state={
        searchText:''
    };
    
    this.componentDidMount=this.componentDidMount.bind(this);

    this.onPressEnterHandle=this.onPressEnterHandle.bind(this);
    this.onChange=this.onChange.bind(this);
    this.setDropList=this.setDropList.bind(this);
    this.onSuffixClick=this.onSuffixClick.bind(this);
    this.onPrefixClick=this.onPrefixClick.bind(this);

    this.onDropListSelect=this.onDropListSelect.bind(this);

    this.setDropListEmpty=this.setDropListEmpty.bind(this);
    this.clearDropList=this.clearDropList.bind(this);
    this.setLoading=this.setLoading.bind(this);
    this.setFailture=this.setFailture.bind(this);
    this.setDropListCache=this.setDropListCache.bind(this);
    this.getDropListCache=this.getDropListCache.bind(this);
    this.hiddenDropList=this.hiddenDropList.bind(this);
    this.showDropList=this.showDropList.bind(this);

    this.appendSaleItem=this.appendSaleItem.bind(this);
    this.brandCodeSpliter=this.brandCodeSpliter.bind(this);
    this.getBrandCodes=this.getBrandCodes.bind(this);
  }

    componentDidMount(){
        this.setState({
            searchText:'',
            visibility:'hidden',
            dropListCache:[]
        });
    }

    onPressEnterHandle(){
        if(this.state.searchText.length<5){
            MessageBox('info',Message.MSG02);
            return;
        }
      let currentBrandCode = this.getBrandCodes();
      if(!currentBrandCode){
          MessageBox('info',Message.PLEASE_LOGIN);
          return;
      }
      let requestData={
          currentBrandCode:currentBrandCode,
          prodcode:this.state.searchText,
          success:function(responseData){
              this.setDropList(responseData);
          }.bind(this),
          failure:function(responseData){
              this.setFailture();
          }.bind(this),
          error:function(errorMsg){
              this.setFailture();
          }.bind(this)
      };
      this.setLoading();
      Product.getList(requestData);
    }

    onChange(e){
        let valueText=e.target.value;
        this.setState({
            searchText:valueText
        });
    }

    onDropListSelect(e){
        let selectedProdCode = e.currentTarget.getAttribute("data-item-value");
        let selectProd = this.getDropListCache(selectedProdCode);
        console.log("selected prod:" + JSON.stringify(selectProd));
        console.log("ready to append prod");
        this.appendSaleItem(selectProd);
    }

    onSuffixClick(){
        this.hiddenDropList();
        this.setState({
            searchText:''
        });
    }

    onPrefixClick(){
        this.onPressEnterHandle();
    }

    setDropList(list){
        if(Array.isArray(list)&&list.length>0){
            this.setDropListCache(list);
            this.showDropList();
            this.setState({
                dropListHTML:
                    (
                        list.map(function (item) {
                            return <li key={item.prodCode} data-item-value={item.prodCode} onClick={this.onDropListSelect} >
                                        <Row>
                                            <Col span={8} >{item.prodCode}  </Col>
                                            <Col span={8}>{item.prodName}  </Col>
                                            <Col span={8}> {Message.CURRENCY} {item.price}  </Col>
                                        </Row>
                                        <p>  </p>
                                  </li>
                        }.bind(this))
                    )
            });
        }
        else{
            this.setDropListEmpty();
        }
    }

    setDropListEmpty(){
        this.setState({
            dropListHTML:
             (
                <li key={1} style={{textAlign:'center'}}>
                    <Icon type="frown-o" /> &nbsp; {Message.MSG03} 
                 </li>
              )
        });
    }

    clearDropList(){
        this.setState({
            dropListHTML:''
        });
    }

    setLoading(){
        this.showDropList();
        this.setState({
            dropListHTML:
                (
                    <li key={2} style={{textAlign:'center'}}>
                        <Icon type="loading" spin={true} />&nbsp; {Message.LOADING}
                    </li>
                )
        });
    }

    setFailture(){
        this.setState({
            dropListHTML:
                (
                    <li key={1} style={{textAlign:'center'}}> 
                       <Icon type="frown-o" /> &nbsp;  {Message.LOAD_FAILURE}
                     </li>
                )
        });
    }

    setDropListCache(list){
        let items = list.reduce((obj, approval) => {
            obj[`dropList_${approval.prodCode}`] = approval;
            return obj;
        }, {});

        this.setState({
            dropListCache:items
        });
    }

    getDropListCache(){
        return this.state.dropListCache;
    }

    getDropListCache(key){
        return this.state.dropListCache[`dropList_${key}`];
    }

    showDropList(){
        this.setState({
            visibility:'visible'
        });
    }

    hiddenDropList(){
        this.setState({
            visibility:'hidden'
        });
    }

    appendSaleItem(newPrd){
        const { saleItem ,coupon} = this.props;
        const {itemChange,saleResult}=this.props;
        if(coupon.content&&coupon.content.couponNo){
            MessageBox("error",Message.MSG25);
            return ;
        }
        var stop=false;
        saleItem.item.forEach(function(item){
            if(item.prodCode===newPrd.prodCode){
                item.qty+=1;
                
                itemChange(saleItem.item);
                saleResult(saleItem.item);
                stop=true;
                return;
            }         
        })
        if(!stop){
        const newData = {
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
            };
        
        const result=[...saleItem.item,newData];
        
        itemChange(result);
        saleResult(result);
        }
    }

    getBrandCodes(){
        if(this.state.brandCodes){
            return this.state.brandCodes;
        }
        let shopInfos = getAccount().shopInfos;
        let brandCodes = this.brandCodeSpliter(shopInfos);
        this.setState({
            brandCodes:brandCodes
        });
        return brandCodes;
    }

    brandCodeSpliter(shopInfos){
        if(!Array.isArray(shopInfos)){
            return undefined;
        }
        let brandCode="";
        shopInfos.map(function(v,i){
            brandCode+=v.brandCode+',';
        })
        return brandCode=brandCode.substring(0,brandCode.length-1);
    }

    render() {
        return (
            <div className="fill" style={{overflowX:'hidden'}}>
                <Input.Search
                    placeholder={Message.MSG01}
                    className="fill-height searchBox"
                    prefix={<FaSearch className="searchBox-prefix-button hover-pointer" size={25} onClick={this.onPrefixClick} />}
                    suffix={<MdCancel className="hover-pointer" size={25} onClick={this.onSuffixClick} />}
                    style= {{fontSize:'22px'}}
                    value={this.state.searchText}
                    onSearch={this.onPressEnterHandle}
                    onChange={this.onChange}
                />
                <div id="searchDropList" className="searchDropList fill-height fill-width slow-move"
                    style={{visibility:this.state.visibility}} >
                    <ul id="dropList" className="prdRst z-index-50">
                        {this.state.dropListHTML}
                    </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        saleItem : state.saleItem,
        coupon:state.coupon
    };
}

function mapDispatchToProps(dispatch){
    return {
        setResult : (results) => dispatch(setResult(results)),
        itemChange:(items)=>dispatch(itemChange(items)),
        itemAppend:(item)=>dispatch(itemAppend(item)),
        saleResult:(item)=>dispatch(saleResultChange(item))
    };
}
/*export default Search;*/
export default connect(mapStateToProps,mapDispatchToProps)(Search);