import axios from 'axios';
import {urls}from '../configs';
import {getRequestHeader} from '../common/request';

export default {
    employees:(brandCode,shopCode,success,failure)=>{
        const headers=getRequestHeader();
        axios.get(`${urls.user}Employee`,{
            params:{
                brandCode:brandCode,
                shopCode:shopCode
            }
        },{headers:headers})
        .then(function(response){
            console.log('employees success');
           success(response.data.result);
        }).catch(function (error){
            console.log(error.message);
            failure();
        })
    }
}