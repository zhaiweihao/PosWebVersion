import React ,{ Component } from 'react';
import Logo from "../test.png";
import SaleHeadContainer from '../containers/SaleHeadContainer';
import SaleItemContainer from '../containers/SaleItemContainer';
import SaleResultContainer from '../containers/SaleResultContainer';
import SaleFootContainer from '../containers/SaleFootContainer';
import {Table, Row, Col,Layout} from 'antd'
import 'antd/dist/antd.css';
import '../index.css';
import {getAccount} from '../common/request';
import {message} from '../common/message';
import SalePaymentContainer from '../containers/SalePaymentContainer';
import SalesmanContainer from '../containers/SalesmanContainer';
import {push as Menu}  from 'react-burger-menu';

class SalePage extends Component{
    constructor(){
        super();
        console.log("constructor super after");
        const account=getAccount();
        if(account===null){
            message('error','未登录','请登录');
            window.location.href='/';       
        }
        
        this.menuChangeHandle=this.menuChangeHandle.bind(this);
        console.log("constructor end");
    }

    state={
        isOpen:false
    }

  menuChangeHandle(isOpen){
      this.setState({
          isOpen:isOpen
      });
  }

    render(){
        const {Header ,Content,Sider,Footer} = Layout;

        return (
            <div className="salePage fill outer-container">
                <Menu 
                    className="fill-height"
                    isOpen={this.state.isOpen}
                    pageWrapId={"salePage"} width={300}
                    customBurgerIcon={ false } 
                    customCrossIcon={false}>
                    <div className="fill padding-3" style={{backgroundColor:'#eee'}}>
                        <div style={{height:'15%',backgroundColor:'#fff'}}>
                            <img className="fill" style={{cursor:'pointer'}} src={Logo} />
                        </div>
                        <div style={{height:'70%',backgroundColor:'#fff'}}>
                        </div>
                        <div style={{height:'15%',backgroundColor:'#fff'}}>
                        </div>
                    </div>
                </Menu>
                <div id="salePage" className="fill">
                    <Layout style={{height:'100%',backgroundColor:'#eee'}}>
                        <Header style={{height:'15%',padding:'0',backgroundColor:'#eee'}}>
                            <SaleHeadContainer menuChangeHandle={this.menuChangeHandle} />
                        </Header>
                        <Layout style={{height:'70%',backgroundColor:'#eee',flexWrap:'nowrap'}}>
                            <Content className="fill-height" style={{width:'80%',paddingLeft:'3px',paddingRight:'3px',overflowX:'hidden'}}>
                                <SaleItemContainer />
                            </Content>
                            <Sider className="fill-height" width={300} style={{backgroundColor:'#eee',position:'relative',paddingRight:'3px',paddingLeft:'3px',flex:'0 0 0 0'}}>
                                <Row style={{height:'30%'}}>
                                    <SaleResultContainer />
                                </Row>
                                <Row style={{height:'50%'}}>
                                    <SalePaymentContainer />
                                </Row>
                                <Row style={{height:'20%'}}>
                                    <SalesmanContainer />
                                </Row>
                            </Sider>
                        </Layout>
                        <Footer className='padding-0' style={{height:'15%',backgroundColor:'#eee'}}>
                            <SaleFootContainer />
                        </Footer>
                    </Layout>
                </div>
            </div>
        );
    }
}

export default SalePage;