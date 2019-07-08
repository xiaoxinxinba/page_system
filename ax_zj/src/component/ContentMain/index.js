import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'

const Home = LoadableComponent(()=>import('../../pages/Home/index'));

const Record = LoadableComponent(()=>import('../../pages/Record'));
const SmartTopic = LoadableComponent(()=>import('../../pages/SmartTopic'));
const ClassManage = LoadableComponent(()=>import('../../pages/ClassManage'));
const StageClass = LoadableComponent(()=>import('../../pages/ClassManage/StageClass'));
const Paper = LoadableComponent(()=>import('../../pages/Paper'));


@withRouter
class ContentMain extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <PrivateRoute exact path='/' component={Home}/>

                    <PrivateRoute exact path='/record' component={Record}/>
                    <PrivateRoute exact path='/smartTopic' component={SmartTopic}/>
                    <PrivateRoute exact path='/classManage' component={ClassManage}/>
                    <PrivateRoute exact path='/classManage/stageClass' component={StageClass}/>
                    <PrivateRoute exact path='/paper' component={Paper}/>

                    {/*<Redirect exact from='/' to='/home'/>*/}
                </Switch>
            </div>
        )
    }
}

export default ContentMain