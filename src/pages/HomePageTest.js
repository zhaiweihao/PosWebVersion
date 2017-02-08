import React,{Component} from 'react';
import { DatePicker,Button,Alert,message}from 'antd';
import 'antd/dist/antd.css';

export default class HomePage extends Component{
     constructor(){
        super();
        this.state = {
            alert:false
        };
        this.handleClick=this.handleClick.bind(this);
     }
    handleClick(){
       this.setState({alert:true});
    }
    error() {
        message.error('This is a message of error');
    }

    render(){
        let alert=null;
        if(this.state.alert!==undefined){
            if(this.state.alert){
            alert=<Alert message="Error" description="This is an error message about copywriting." type="error" showIcon />;
        }
    }

        return (
            <div>
            {alert}
            <Button type='ghost' onClick={this.error}>点击</Button>
            <DatePicker />
            </div>
        );
    }
}