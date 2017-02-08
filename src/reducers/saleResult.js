import {handleActions} from 'redux-actions';

const saleResultReducer=handleActions({
    SALERESULT_CHANGE:(state,action)=>{
        const saleItem=action.payload;
        if(saleItem===undefined)
            return {};
        var total=0.00;
        var subTotal=0.00;
        var discount=0.00;
        let qty=0;
        saleItem.forEach(function(item){
            qty+=item.qty;
            total+=item.qty*item.price;
            subTotal+=item.subTotal;
            discount+=item.discount;
        })
        const saleResult={
            qty:qty,
            total:total,
            subTotal:subTotal,
            discount:discount,
            orderType:subTotal>=0?'N':'R'
        }
        return saleResult;
    }
},{});
export default saleResultReducer;