import React,{Component} from 'react'
import "antd/dist/antd.less"
import 'moment/locale/zh-cn'
import {Route,Switch,useHistory } from 'react-router-dom'
import { Button,message } from 'antd'
import MasterLogin from './pages/login/login'
import Login from './pages/login/UserLogin/userLogin'

import Admin from './pages/admin/forum'

import moment from 'moment';
moment.locale('zh-cn');  




export default function App (){
        const history=useHistory();
        //let a=moment(new Date());
       // let b=localStorage.getItem('lastLoginTime')
       //  if(!localStorage.getItem('token')){history.push('/login')}
       //  else{
       //      if(a.diff(b,"hour")>2){
       //          history.push('/login')
       //      }else{
       //          history.push('/forum')
       //      }
       //  }
    if(!localStorage.getItem('token')){
        history.push('/login')
    }else{
        history.push('/forum')
    }
        return (
            
            <div className='app'>
                <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/master' component={MasterLogin}/>
                <Route path='/forum' component={Admin}/>
                    <Route path='/' component={Admin}/>
                </Switch>
            </div>
            
        )
    }



