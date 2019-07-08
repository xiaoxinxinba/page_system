import React from 'react'
import { AppAuth } from '../../utils/appAuth.service'
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react/index";
import Loading from '../../component/Loading'
import {httpClient} from "../../axios/apiHelper";
import {Form, Input, notification, message, Button} from 'antd'
import {Constants} from "../../constants";

@withRouter @inject('appStore') @observer
class Callback extends React.Component {
    state = {
        loading: false,
        isLoginTrue: false
    }
    componentWillMount(){
        AppAuth.signinCallback().then((user) =>{
            console.log(user);
            this.getPage(user)
            // this.isGetUser();
        }).catch((e) => {
            console.log(e.message);
            if(e.message === 'The authorization was denied by the resource owner.'){
                this.setState({
                    isLoginTrue: true
                })
                message.error('登录授权失败, 即将返回登录……');
                setTimeout(() => {
                    this.props.history.push('/login');
                }, 1000)
            }else{
                this.props.history.push('/login');
            }
        });
    }

    reLogin = () => {
        this.props.history.push('/login');
    };
    // 如果存在用户信息  则登录
    getPage (user){
        if(user){
            this.props.appStore.toggleLogin(true, {username: user.profile.nickname, token: `${user.access_token}`});

            setTimeout(() => {
                const {from} = this.props.location.state || {from: {pathname: '/'}};
                this.props.history.push(from)
            }, 300)
        }else{
            this.props.history.push('/login');
        }
    }
    // 获取用户信息
    isGetUser(){
        AppAuth.getUser().then(user => {
            if (user && user.access_token) {
                console.log('has token')
                this.getPage(user)
            }
            else if (user) {
                console.log('has token1')
                AppAuth.renewToken().then(user => {
                    console.log('has token2')
                    this._callApi(user.access_token);
                });
            }
            else {
                this.getPage(false);
            }
        });
    }

    _callApi = () => {
        httpClient.get({
            url: Constants.apiRoot,
            success: (user) => {
                if(user){
                    this.getPage(user);
                }
            }
        });
    };

    render() {
        return (
            <div className='text-center'>
                {/*{!this.state.isLoginTrue? <div>*/}
                        {/*<h3 style={{marginTop: 100}} className='animated bounceInLeft'>Loading...</h3>*/}
                        {/*<Loading/>*/}
                    {/*</div> :*/}
                    {/*<div>*/}
                        {/*<h1 style={{marginTop: 100}}>登录授权失败。</h1>*/}
                        {/*<br/>*/}
                        {/*<Button type='primary' size={'large'} onClick={this.reLogin} title='点击重新登录'>重新登录</Button>*/}
                    {/*</div>*/}
                {/*}*/}
                <h3 style={{marginTop: 100}} className='animated bounceInLeft'>Loading...</h3>
                <Loading/>
            </div>
        )
    }
}

const styles = {
    loadingBox: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
    },
    loadingTitle: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginLeft: -45,
        marginTop: -18,
        color: '#000',
        fontWeight: 500,
        fontSize: 24
    },
}

export default Callback