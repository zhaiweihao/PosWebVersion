import React ,{ Component } from 'react';

class Cube extends Component{
    constructor(props){
        super();
        this.props = props;
        this.state = props;
        this.OnClickHandle = this.OnClickHandle.bind(this);
        this.onClickCancelHandle=this.onClickCancelHandle.bind(this);
        this.onMouseEnterHandle = this.onMouseEnterHandle.bind(this);
        this.onMouseLeaveHandle = this.onMouseLeaveHandle.bind(this);
    }

    componentDidMount (){
        this.setState({
            backgroundColor : this.props.backgroundColor||'#fff',
            hoverBackgroundColor:this.props.hoverBackgroundColor||'#eee',
            hoverColor:this.props.hoverColor||'#000',
            icon:this.props.icon,
            clickedIcon:this.props.clickedIcon,
            text:this.props.text
        });
    }

    OnClickHandle(){
        console.log('clicked OnClickHandle');
        if(this.props.onClick){
            if(this.props.clickedIcon){
                console.log('clicked icon');
                this.setState({
                    icon:this.props.clickedIcon
                });
            }
            this.props.onClick(this.onClickCancelHandle);
        }
    }

    onClickCancelHandle(){
        this.setState({
            icon:this.props.icon
        });
    }

    onMouseEnterHandle(){
        this.setState({
            backgroundColor:this.props.hoverBackgroundColor||'#ddd'
        });
    }

    onMouseLeaveHandle(){
        this.setState({
            backgroundColor:this.props.backgroundColor||"#fff"
        });
    }

    render(){
        let _width=this.props.width === undefined ?'100%':this.props.width;
        let _height=this.props.height === undefined?'100%':this.props.height;
        let _backgroundColor = this.props.backgroundColor;
        let _fontSize=this.props.fontSize||'21px';
        let _color=this.props.color||'#000';

        let style ={
            width:_width,
            height:_height,
            backgroundColor:this.state.backgroundColor,
            lineHeight:_height,
            fontSize:_fontSize,
            color:_color 
        };
        style=Object.assign(style,this.props.style)
        return (
            <div className="block-center cube" 
            style={style}
            onClick={this.OnClickHandle}
            onMouseEnter={this.onMouseEnterHandle}
            onMouseLeave={this.onMouseLeaveHandle}>
                <div className="centered">
                     <div>
                        {this.state.icon}
                        {'   '}
                        {this.props.text}
                    </div></div>
            </div>
        );
    }
}

export default Cube;