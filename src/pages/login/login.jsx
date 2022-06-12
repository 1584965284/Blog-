import React,{Component}  from 'react'
import 'moment/locale/zh-cn'
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './css/login.less'
import { LoginApi } from '../../request/api';
import axios from 'axios';
import moment from 'moment'
moment.locale('zh-cn');  

export default function Login (){
     
       const history=useHistory()
      const onFinish=(value)=>{
         axios({
          method: 'post',
          url: 'http://114.55.119.223/prod-api/api/master/adminLogin',
          headers: {
            "Authorization": "APPCODE " + '77814df9dff44705998c764a6fa71f54'
        },
          data:{name:value.username,pwd:value.password}
      }).then(res=>{
        
        if(res.data.errCode===0){
          message.success('登录成功')
          localStorage.setItem('token',res.data.data.token)
          localStorage.setItem('name',res.data.data.name)
          localStorage.setItem('lastLoginTime',moment(new Date()))
          
          setTimeout(() => {
            //history.push('/admin')
          }, 200);
        }else{
          message.error('登录失败')
        }
      })

      };

        return(
        <div className='login'>
            <header>
                <h1>BBS后台管理系统</h1>
            </header>

            <section>
                <h1>管理员登录</h1>
                <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      

      <Form.Item>
        <Button size='large' type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
       
      </Form.Item>
    </Form>

            </section>

        </div>
        )
    
}

