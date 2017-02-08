import { 
    LOGIN_REQUEST,
    LOGIN_SUCCESS, 
    LOGIN_FAILURE 
} from '../constants/ActionTypes';
import React, { Component } from 'react';
import {Row,Col, Icon, Input, Button, Checkbox,Modal} from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { login } from '../actions/account';
import '../index.css';
import {getCookie} from '../common/cookie';
class LoginContainer extends Component{
    constructor(){
        super();
        const cookieUser=getCookie("userId");
        this.state = {
            userName: cookieUser||'',
            password: ''
        };
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.loginError=this.loginError.bind(this);
        this.handleKeyPress=this.handleKeyPress.bind(this);
    }
    loginError(error) {
        Modal.error({
                    title: error.title,
                    content: error.message
                    });
    }
    handleUserNameChange(event){
        this.setState({ userName: event.target.value });
    }
    handlePasswordChange(event){
        this.setState({ password: event.target.value });
    }
    handleLoginClick(){
        const { login } = this.props;
        login(this.state.userName, this.state.password);
    }
    handleKeyPress(e){
        console.log(e.key);
        if(e.key==="Enter"){
            this.handleLoginClick();
        }
    }
    render() {
        const { account } = this.props;
        
        const isLoginLoading = account.status === LOGIN_REQUEST ? true : false;
        if(account.status === LOGIN_FAILURE){
            //this.loginError(account.data);
        }
        //const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        };
        
        return (
            <div style={{fontSize:'4.23px'}} >
                <Row style={{paddingLeft:'40px'}}>
                <Col span={4} className='login-font' style={{textAlign:'left',marginTop:'8px',paddingLeft:'30px'}}>
                    用户名
                </Col>
                <Col span={10}>
                  <Input
                        className='login-input'
                        type="text"
                        value={this.state.userName}
                        placeholder="请输入用户名"
                        onChange={this.handleUserNameChange}
                         />
                </Col>
                <Col span={10}/>
                </Row>

                <Row>
                    <p style={{height:'17px'}}></p>
                </Row>

                <Row style={{paddingLeft:'40px'}}>
                <Col span={4} className='login-font'  style={{textAlign:'left',marginTop:'8px',paddingLeft:'30px'}}>
                    密码
                </Col>
                <Col span={15}>
                    <Input
                        className='login-input'
                        type="password"
                        value={this.state.password}
                        placeholder="请输入密码"
                        onChange={this.handlePasswordChange}
                        onKeyPress={!isLoginLoading ? this.handleKeyPress : null}
                       />
                </Col>
                </Row>

                <Row>
                    <p style={{height:'37px'}}></p>
                </Row>
                <Row className='login-font'>
                    <Button  type="primary" className="login-button" htmlType="submit"
                        loading={isLoginLoading}
                        onClick={!isLoginLoading ? this.handleLoginClick : null}>
                        {isLoginLoading ? '登录中...' : '登录'}
                    </Button>
                </Row>
                </div>
        );
    }
}
function mapStateToProps(state) {
    return { 
        account: state.account //state.account 这个account对应的reducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: (userName, password) => dispatch(login(userName, password))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);