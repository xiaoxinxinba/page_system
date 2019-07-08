import {observable, action} from 'mobx'
import {isAuthenticated,authenticateSuccess,logout} from '../utils/Session'
import { AppAuth } from '../utils/appAuth.service'

class AppStore {
  @observable isLogin = !!isAuthenticated()
  @observable loginUser = {}  //当前登录用户信息

  @action toggleLogin(flag,info={}) {
    this.loginUser = info  //设置登录用户信息
    if (flag) {
      authenticateSuccess(info.username, info.token);
      this.isLogin = true
    } else {
      this.isLogin = false;
        authenticateSuccess('');
      this.logout();
    }
  }

    logout(){
        AppAuth.logout().catch(err => console.log(err));
    }
}

export default new AppStore()