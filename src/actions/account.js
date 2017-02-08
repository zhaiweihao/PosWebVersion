import {LOGIN_REQUEST,
        LOGIN_SUCCESS,
        LOGIN_FAILURE
}from '../constants/ActionTypes';
import {createAction} from 'redux-actions';
import accounts from '../apis/account';
import 'antd/dist/antd.css';
import {message} from '../common/message';

let action_login_request=createAction(LOGIN_REQUEST);
let action_login_success=createAction(LOGIN_SUCCESS);
let action_login_failure=createAction(LOGIN_FAILURE);

export function login(username,password){
    console.log(username);
    console.log(password);
    
    return dispatch =>{
        console.log('login before');
        dispatch(action_login_request());
        console.log('login before');
        accounts.login(username,password,
        account=>{
            if(account.errorMessage!==null){
                const error={
                title:'登录失败',
                message:account.errorMessage
            };
                dispatch(action_login_failure(error));
                message('error','登录失败',error.message);
            }
            else{
                document.cookie=`userId=${username}`;
                dispatch(action_login_success(account));
                console.log(`${account.token}`);
                message('success','登录成功');
                sessionStorage.setItem('account',JSON.stringify(account));
                window.location.href='#/home';
            }   
        },
        (title,msg)=>{
            const error={
                title:title,
                message:msg
            };
            message('error','登录失败',error.message);
            dispatch(action_login_failure(error));
        });
        
    }
}