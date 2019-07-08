import React from 'react'
import {Layout} from 'antd'
import ContentMain from '../../component/ContentMain'
import HeaderBar from '../../component/HeaderBar'
import {inject, observer} from "mobx-react/index";
import {withRouter} from "react-router-dom";
import Nav from "../../component/Nav";

const {Sider, Header, Content, Footer} = Layout;

@withRouter @inject('textPaper') @observer
class Index extends React.Component{
    state = {
        collapsed: false
    }

    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed
      })
    }

    render() {
        const {printDiv} = this.props.textPaper;
        return (
            <div id='page'>
                <div style={{display: printDiv?'none':'block'}}>
                    <HeaderBar collapsed={this.state.collapsed} onToggle={this.toggle}/>
                    <Nav></Nav>
                </div>
                <div className='main-content'>
                    <ContentMain/>
                </div>
            </div>
        );
    }
}
export default Index