import axios from 'axios';
import {urls}from '../configs';
import {getRequestHeader} from '../common/request';

export default {
    login:(username,password,successCallback,failureCallback)=>{
        console.log('api start');
        const headers=getRequestHeader();
        const usermodel={
	        "uid":username,
	        "pwd":password,
	        "mac":"test"
};
        console.log(`${urls.user}`);
        axios.post(`${urls.user}account`,usermodel,{headers:headers})
    .then(function(response){
        successCallback(response.data)
    })
    .catch(function(error){
        failureCallback('登录失败',error.message);
    });
}
};
