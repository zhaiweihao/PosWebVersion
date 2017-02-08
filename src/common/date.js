export function toYYYYYMMDD(date) {  
    var d = new Date(date.getTime()); 
    var mm=d.getMonth()+1;
    var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate().toString(); 
    mm = mm < 10 ? "0" + mm : mm.toString(); 
    var yyyy = d.getFullYear().toString(); //2011  
        //var YY = YYYY.substr(2);   // 11  
    return yyyy+mm+dd;  
}