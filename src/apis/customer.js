import axios from 'axios';
import {getRequestHeader} from '../common/request';
import {urls}from '../configs';

/*弃用的前台调用webservice的方法*/
/*function requstbody(custname,custcarno,custno,custcellno,brandcode){
    return `<?xml version=""1.0"" encoding=""utf-8""?>
                <soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>
                    <soap:Body>
                     <memberinfoinquiry xmlns='http://EWIF.com/services'>
                       <strCallUserCode>Eland</strCallUserCode>
                       <strCallPassword>Eland1234</strCallPassword>
                       <vipCode>${custno===null?'':custno}</vipCode>
                       <mobile>${custcellno===null?'':custcellno}</mobile>
                       <email></email>
                       <name>${custname===null?'':custname}</name>
                       <brandCode>${brandcode===null?'':brandcode}</brandCode>
                       <cardNo>${custcarno===null?'':custcarno}</cardNo >
                     </memberinfoinquiry>
                    </soap:Body>
                </soap:Envelope>`;
}*/

export default {
     getCustomer:(brandCode, custNo, email, custName, cellNo, custCardNo,successCallback,failureCallback)=>{
         var headers=getRequestHeader();
        axios.get(`${urls.user}Customer`
        ,{
            params:{
                brandCode:brandCode,
                custNo:custNo,
                email:email,
                custName:custName,
                cellNo:cellNo,
                custCardNo:custCardNo
            }
        },
        {headers:headers})
        .then(function(response){
            console.log('success hello');
            successCallback(response.data)
        })
        .catch(function(error){
            failureCallback('登录失败',error.message);
        });
    }
}