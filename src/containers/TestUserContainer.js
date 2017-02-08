import React,{Component} from 'react';
import { connect } from 'react-redux';
import {nameChange} from '../actions/userTest';

class TestUserContainer extends Component{
    constructor(userName){
        super(userName);
        this.state={
            userName:''
        };
        this.handleUserInputChange=this.handleUserInputChange.bind(this);
    }
    handleUserInputChange(event){
        const{nameChange}=this.props;

        //this.setState({userName:event.target.value});
        nameChange(event.target.value);
    }
    render(){
        const {userName}=this.props;
        return (
            <div>
                <input type='text' value={userName} onChange={this.handleUserInputChange}></input>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        userName: state.userTest.Name
    };
}

function mapDispatchToProps(dispatch) {
    return {
        nameChange: (userName) => dispatch(nameChange(userName))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestUserContainer);
