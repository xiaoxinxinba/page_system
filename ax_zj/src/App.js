import React, {Component} from 'react';
import PrivateRoute from './component/PrivateRoute'
import {Route, Switch} from 'react-router-dom'
import Login from './pages/Login/index'
import Callback from './pages/Login/callback'
import Logout from './pages/Login/logout'
import Index from './pages/Index'
import {registerInterceptors} from './axios/apiHelper'
import './App.scss'

registerInterceptors();

class App extends Component {
    render() {
        return (
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/signin-callback' component={Callback}/>
                <Route path='/signout-callback' component={Logout}/>
                <PrivateRoute path='/' component={Index}/>
            </Switch>
        )
    }
}

export default App;