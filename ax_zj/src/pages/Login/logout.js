import React from 'react'
import { logout } from '../../utils/Session'
import {message} from 'antd'
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";

import Loading from '../../component/Loading'

@withRouter @inject('appStore') @observer
class Logout extends React.Component {
    state = {
        showBox: 'login',   //展示当前表单
        url: '',  //背景图片
        loading: false,
    }

    componentWillMount(){
        localStorage.clear(); // 退出成功，清空缓存
        message.success('退出成功');
        setTimeout(this.reLogin, 500);
    }

    reLogin = () => {
        this.props.history.push('/login');
    };

    render() {
        return (
            <div className='home'>
                <div style={styles.loadingBox}>
                    <h3 style={styles.loadingTitle} className='animated bounceInLeft'>载入中...</h3>
                    <Loading/>
                </div>
            </div>
        )
    }
}

export default Logout

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
