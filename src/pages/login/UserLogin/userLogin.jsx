import React, {Component, useEffect, useState} from 'react'
import 'moment/locale/zh-cn'
import { useHistory } from 'react-router-dom';
import {
    AutoComplete,
    Cascader,
    Col,
    InputNumber,
    Row,
    Select,
} from 'antd';
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import { LoginApi } from '@/request/api.js';
import {reg} from "@/request/topicAPI"
import axios from 'axios';
import moment from 'moment'
//import Register from "../../../components/Register/Register";
moment.locale('zh-cn');


export default function Login (){
    const { Option } = Select;

    const history=useHistory();
    const [isLogin,setIsLogin] = useState(true);
    const onFinishLogin=(value)=>{
        //console.log(value)

        LoginApi({username:value.username,password:value.password})
            .then(res=>{

                //console.log(res)
                if(res.state===200){ 

                message.success('登录成功')
                setTimeout(() => {
                    history.push('/forum')
                }, 200);
                localStorage.setItem('token',res.data.userID)
                localStorage.setItem('profile',res.data.profile)
                localStorage.setItem('userName',res.data.userName)
                localStorage.setItem('user',JSON.stringify(res.data))
                //console.log(res.data.userID)
                localStorage.setItem('lastLoginTime',moment(new Date()))
                //console.log(localStorage.getItem('token'))

            }else{
                message.error(res.data.message)
            }
        })

    };

    const onFinishRegister=async (value)=>{
        console.log(value)
        let res=await reg({userName:value.userName,email:value.email,password:value.password});
        if(res.state===200){
            message.success("注册成功");
            setIsLogin(true);
        }else{
            message.error(res.message)
        }
    }


    return(
        <div className='login'>
            <header>
                <h1>BBS论坛</h1>
            </header>

            <section>

                <div>
                    {
                        isLogin ? (
                            <div>
                                <h1>登录</h1>
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinishLogin}
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
                                            登录
                                        </Button>
                                        <Button size='large' type="primary"  className="login-form-button" onClick={()=>{setIsLogin(false)}} style={{marginLeft: '20px'}}>
                                            去注册
                                        </Button>

                                    </Form.Item>
                                </Form>
                            </div>

                        ):(
                            <div>
                                <h1>注册</h1>
                                <Form
                                    name="register"
                                    onFinish={onFinishRegister}
                                    scrollToFirstError
                                >
                                    <Form.Item
                                        name="userName"
                                        label="用户名"
                                        tooltip="唯一标识，不可更改"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your nickname!',
                                                whitespace: true,
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label="邮箱"
                                        rules={[
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your E-mail!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label="密码"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirm"
                                        label="确认密码"
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your password!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>




                                    <Form.Item>
                                        <Button size='large' type="primary" htmlType="submit" className="login-form-button">
                                            注册
                                        </Button>
                                        <Button size='large' type="primary"  className="login-form-button" onClick={()=>{setIsLogin(true)}} style={{marginLeft: '20px'}}>
                                            去登录
                                        </Button>

                                    </Form.Item>
                                </Form>
                            </div>
                        )

                    }
                        </div>


            </section>

        </div>
    )

}

