import React from 'react'
import {Icon, Badge, Dropdown, Menu, Modal} from 'antd'
import {inject, observer} from 'mobx-react'
import {Link, withRouter} from 'react-router-dom'
import {isAuthenticated} from '../../utils/Session'
import {AppAuth} from "../../utils/appAuth.service";
const confirm = Modal.confirm;

@withRouter @inject('appStore') @inject('textPaper') @inject('formatePaper') @observer
class HeaderBar extends React.Component {
    state = {
        icon: 'arrows-alt',
        count: 100,
        visible: false,
        avatar: require('../../assets/img/defaultUser.jpg'),
        linkListSelected: 'linkList1',
        linkList: [
            {
                key: 'linkList1',
                path: '/',
                title: '手动选题'
            },
            {
                key: 'linkList2',
                path: '/smartTopic',
                title: '智能选题'
            },
            {
                key: 'linkList3',
                path: '/record',
                title: '作业记录'
            },
            {
                key: 'linkList4',
                path: '/classManage',
                title: '班级管理'
            }
        ]
    }

    componentDidMount() {
        const pathname = this.props.location.pathname;
        const rank = pathname.split('/');
        const _this = this;
        if(rank[1]){
            const path = this.state.linkList.filter(o => o.path === `/${rank[1]}`)[0];
            if(path && path.key && path.key === 'linkList2'){
                _this.props.formatePaper.toggleChooseUnitFun(true);
            }else{
                _this.props.formatePaper.toggleChooseUnitFun(false);
            }// 显示和隐藏知识点、章节选题
            path && _this.setState({linkListSelected: path.key});
        }

    }

    changeUrl = (key) => {
        const _this = this;
        if(key === 'linkList1' || key === 'linkList2'){
            _this.props.formatePaper.toggleChooseUnitFun(true);
        }else{
            _this.props.formatePaper.toggleChooseUnitFun(false);
        } // 显示和隐藏知识点、章节选题
        _this.setState({linkListSelected: key});
    }

    logout = () => {
        const {getLength} = this.props.textPaper;
        const _this = this;
        if(getLength > 0){ // 当有选择的试题时，提示是否退出
            confirm({
                title: '您确定要注销当前账户吗?',
                content: '注销账户将会清空已选择的试题。',
                onOk() {
                    _this.props.appStore.toggleLogin(false);
                    AppAuth.logout().catch(err => console.log(err));
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }else{ // 没有试题时   直接退出
            _this.props.appStore.toggleLogin(false);
            AppAuth.logout().catch(err => console.log(err));
        }
    }

    render() {
        const {linkListSelected, count, visible, avatar} = this.state;
        const {appStore, collapsed, location} = this.props;
        // const {toggleChooseUnit} = this.props.formatePaper;
        const notLogin = (<span><Link to={{pathname: '/login', state: {from: location}}}
              style={{color: 'rgba(0, 0, 0, 0.65)', display: 'inline-block'}}>登录</Link>&nbsp;
                <img src={require('../../assets/img/defaultUser.jpg')} alt=""/></span>);
        const menu = (
            <Menu className='menu'>
                <Menu.Item><a href='https://accounts.qmaixiang.com' target='_blank'>个人资料</a></Menu.Item>
                <Menu.Item><span onClick={this.logout}>退出登录</span></Menu.Item>
            </Menu>);
        const menu1 = (<Menu className='menu' style={{width: 150, textAlign: 'center'}}>
                <Menu.Item><a href='https://accounts.qmaixiang.com'>章节选题</a></Menu.Item>
                <Menu.Item><span>知识点选题</span></Menu.Item>
            </Menu>);
        const login = (
            <Dropdown overlay={menu}>
                <img onClick={() => this.setState({visible: true})} src={avatar} alt=""/>
            </Dropdown>);
        return (
            <div className='header'>
                <ul className='main-menu'>
                    <li className={ linkListSelected === 'linkList1'? 'active' : ''}
                        onClick={this.changeUrl.bind(this, 'linkList1')}>
                        {/*<Dropdown overlay={menu1}>*/}
                            <Link to={'/'}>手动选题</Link>
                        {/*</Dropdown>*/}
                    </li>
                    {this.state.linkList.map((item, i) => {
                        if(i === 0) return;
                        return <li className={ linkListSelected === item.key? 'active' : ''} key={item.key}
                                   onClick={this.changeUrl.bind(this, item.key)}><Link to={item.path}>{item.title}</Link>
                        </li>;
                    })}
                </ul>
                <ul className='header-ul'>
                    <li>欢迎您：{isAuthenticated()} {appStore.isLogin ? login : notLogin}</li>
                </ul>
            </div>
        )
    }
}

export default HeaderBar