import React from 'react'
import {message, Button, Col} from 'antd'
import './style.scss'
import {withRouter} from 'react-router-dom'
import {inject, observer} from 'mobx-react/index'
import {AppAuth} from '../../utils/appAuth.service'
import Loading from '../../component/Loading'

@withRouter @inject('appStore') @observer
class Login extends React.Component {
    state = {
        showBox: 'login',   //展示当前表单
        url: '',  //背景图片
        loading: false,
    }


    login = () => {
        // this.setState({loading: true}, () => {
        //     AppAuth.login().then(() => {
        //         message.success('进入登录页……');
        //     }).catch(err => {
        //         this.setState({loading: false});
        //         message.error(`${err}-获取登录失败……`);
        //     });
        // });

        this.props.appStore.toggleLogin(true, {username: 'Admin'});

        const {from} = this.props.location.state || {from: {pathname: '/'}};
        this.props.history.push(from)
    }

    render() {
        return (
            <div>
                <div className='login-page'>
                    <div className='page-top'></div>
                    <div className='page-content'>
                        <div className='login-bg'></div>
                        <div className='login-btn bg-img'>
                            <h1 className='title'>欢迎使用XX组题系统</h1>
                            <Button className='login-button' disabled={this.state.loading}  loading={this.state.loading} onClick={this.login}>登录</Button>
                        </div>
                    </div>
                    <div className='login-foot'>
                        <h1>重庆XXXXXX有限公司</h1>
                        <p>Chongqing XXXXXX Co., Ltd.</p>
                    </div>
                </div>
            </div>
        )
    }
}


export default Login