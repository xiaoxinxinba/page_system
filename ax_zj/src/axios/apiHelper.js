import axios from 'axios';
import {message} from 'antd'
import { AppAuth } from '../utils/appAuth.service'
import { isToken } from '../utils/Session'
import {Constants} from "../constants";
/**
*  添加请求拦截器
* */
export const BASE_URL = 'https://api.qmax.com';

export const registerInterceptors = () => {
    // 添加请求拦截器
    axios.interceptors.request.use((config) => {
        return config;
    }, (error) => {
        message.error({message: '请求超时!'});
        return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use( (response) => {
        return response;
    },  (err) => {
        return Promise.reject(err);
    });
};



/**
 * http 包装
 */
export const httpClient = {
    _httpClient: axios.create({
        baseURL: BASE_URL,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin':['localhost:3000', '*.qmax.com']
        }
    }),
    request(params) {
        let request;
        this._httpClient.defaults.headers.common['Authorization'] = `Bearer ${isToken()}`;
        switch (params.method) {
            case 'GET':
                request = this._httpClient.get(params.url, {params: params.queryParams});
                break;
            case 'POST':
                request = this._httpClient.post(params.url, params.body, {params: params.queryParams});
                break;
            case 'PUT':
                request = this._httpClient.put(params.url, params.body, {params: params.queryParams});
                break;
            case 'PATCH':
                request = this._httpClient.patch(params.url, params.body, {params: params.queryParams});
                break;
            case 'DELETE':
                request = this._httpClient.delete(params.url, params.body);
                break;

            default:
                throw new Error('Method not supported');
        }
        return request.then(response => {
            typeof params.success === 'function' && params.success(response.data);
        }).catch((err) => {
            console.log(err.response);
            responseError(err);
            // typeof params.error === 'function' && params.error(err);
        });
    },

    get(params) {
        params.method = 'GET';
        return this.request(params);
    },

    post(params) {
        params.method = 'POST';
        return this.request(params);
    },

    delete(params) {
        params.method = 'DELETE';
        return this.request(params);
    },

    put(params) {
        params.method = 'PUT';
        return this.request(params);
    }
};


const responseError = (err) => {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                message.error(`请求错误：${JSON.stringify(err.response.data)}`);
                console.log(`请求错误：${JSON.stringify(err.response.data)}`);
                break;
            case 401:
                console.log('没有token值');
                // isGetUser();
                console.log('未授权，请登录');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
                break;
            case 403:
                message.error('拒绝访问');
                console.log('拒绝访问');
                break;
            case 404:
                message.error(`请求地址出错: ${err.response.config.url}`);
                console.log('请求地址出错');
                break;
            case 408:
                message.error('请求超时');
                console.log('请求超时');
                break;
            case 500: case 504:
                message.error('服务器被吃了⊙﹏⊙∥');
                console.log('服务器被吃了⊙﹏⊙∥');
                break;
            default:
        }
    }
}

const isGetUser = () => {
    AppAuth.getUser().then(user => {
        if (user && user.access_token) {
            window.location.reload();
        }
        else if (user) {
            AppAuth.renewToken().then(user => {
                this._callApi(user.access_token);
            });
        }
        else {
            message.error('未登录授权. 即将返回登录...');
            console.log('未授权，请登录');
            setTimeout(() => {
                window.location.href = '/login';
            },1000)
        }
    });
}

const _callApi = () => {
    httpClient.get({
        url: Constants.apiRoot,
        success: (user) => {
            if(user){
                window.location.reload();
            }
        }
    });
};