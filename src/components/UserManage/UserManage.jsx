import React, { useState, useEffect } from 'react'
import axios  from 'axios';
import {List, Avatar, Space, Input, Button, Modal, Tooltip, Select, Comment,message,Calendar} from 'antd';
import {MessageOutlined, LikeOutlined, StarOutlined, PlusOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom'
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import {getall,get_by_tid,get_by_mid, get_by_title,new_mpost,get_by_day} from '@/request/topicAPI'
import MyComment from "@/components/Post/Post";

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

let input1=false;
let select='0';
const { TextArea } = Input;


export default function UserManage(props){
    //console.log(props);
    //console.log(props.location.search);
    //console.log(props.match.params.tid);

    const { Search } = Input;
    const { Option } = Select;
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title,setTitle]=useState('');
    const [txt,setTxt]=useState('')
    const [userInfo,setUserInfo]=useState({});
    const [isShowCalendar,setIsShowCalendar]=useState(false)
    const [isToday,setIsToday]=useState(true)
    const [day,setDay]=useState(moment().format('YYYY-MM-DD'))
   // const [select,setSelect]=useState('');
    
    const history =useHistory();

    //methods:

    const handleChange=(selectedItems,option)=>{
      //setSelect(option.value)
      select=option.value;
      if(select==1||select=="1"){
        setIsShowCalendar(true)
      }
    }
    const selectBefore = (
      <Select defaultValue="0" className="select-before" onChange={handleChange}
        onSelect={(a,option)=>{
          select=option.value;
      if(select==1||select=="1"){
        setIsShowCalendar(true)
      }
        }}
      >
        <Option value="0">标题</Option>
        <Option value="1" onClick={()=>{setIsShowCalendar(true)}}>日期</Option>
      </Select>
    );


    useEffect(() => {
        get_by_tid({tid:props.match.params.tid})
            .then(res => {
                if(res.state===200){
                    setData(res.data);
                }
            })
      }, [props.match.params.tid]);
    
        

const onSearch = value => {
    get_by_title({title:value,tid:props.match.params.tid}).then(
      res=>{
        if(res.state===200){
          setData(res.data);
        }
      }
    )
    
};
const onPanelChange = (value) => {
  setIsToday(false)
  setDay(value.format('YYYY-MM-DD'))
  
};
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
    const createPost=()=>{
        setVisible(true)
    }

    return(
        <div>
           <Modal title="选择日期" visible={isShowCalendar} onOk={()=>{
             setIsShowCalendar(false);
             get_by_day({day:day,tid:props.match.params.tid}).then(res=>{
              if(res.state===200){
                setData(res.data)
              }
            })
           }} onCancel={()=>{setIsShowCalendar(false)}}>
            <div className="site-calendar-demo-card">
                  <Calendar fullscreen={false} onChange={onPanelChange} />
            </div>
        </Modal>
            <Modal
                title="发帖"
                centered
                visible={visible}
                onOk={async () => {
                    setVisible(false);
                    let res=await new_mpost({mpostTitle:title,mpostContent:txt,topicID:props.match.params.tid})
                    if(res.state===200){
                        message.success("发帖成功");
                        get_by_tid({tid:props.match.params.tid})
                          .then(res => {
                              if(res.state===200){
                                  //console.log(1);
                                  /*setData([...data, ...JSON.parse(res.data.data.adminInfo1) ]);*/
                                  setData(res.data);
                              }

                          })

                    }else{
                        message.error(res.message)
                    }
                }}
                onCancel={() => setVisible(false)}
                width={700}
            >
                <div style={{width:"70%",margin:"0 auto"}}>
                    <div style={{fontWeight:"bold",marginBottom:"10px"}}>标题：</div>
                    <TextArea
                        showCount
                        maxLength={40}
                        style={{
                            height: 40,width:440
                        }}
                        onChange={(e)=>{setTitle(e.target.value)}}
                    />
                    <Comment
                        style={{marginTop:"20px"}}
                        content={
                            <div>
                                <div style={{fontWeight:"bold",marginBottom:"20px"}}>正文：</div>
                                <TextArea
                                    showCount
                                    maxLength={1000}
                                    style={{
                                        height: 240,width:440
                                    }}
                                    onChange={(e)=>{setTxt(e.target.value)}}
                                />
                            </div>

                        }
                    />
                </div>
                <MyComment />
            </Modal>

        <Search addonBefore={selectBefore} placeholder="输入搜索内容" onSearch={onSearch} enterButton style={{maxWidth:'40%'}}/>
            <div  onClick={createPost}
                  style={{position:'fixed',width:'43px',height:"43px",
                      background:"#1890ff",borderRadius:"50%","bottom":"110px",
                      right:"98px",zIndex:"999",textAlign:"center",lineHeight:"45px",fontSize:"20px",color:"white"}}>
                <PlusOutlined />
            </div>

        <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: page => {
       // console.log(page);
      },
      pageSize:6,
    }}
    dataSource={data}
    // footer={
    //   <div>
    //     <b>ant design</b> footer part
    //   </div>
    // }
    renderItem={item => (
      <List.Item

        extra={
            <span>{item.address}</span>
        }
      >
        <List.Item.Meta
          avatar={<a>
            <Avatar src={"http://localhost:8080/upload/"+item.profile} onClick={() => {
                                history.push('/forum/userPage/'+item.userID)}}/>
            </a>}
          title={
            <a onClick={() => {
             history.push('/forum/follows/'+item.mpostID)
          }}
            style={{fontWeight:'bold'}}
          >
          {item.mpostTitle}
          </a>
        }
          description={item.mpostTime?item.mpostTime.slice(0,10):"暂无时间"}
        />
        <div
          style={{position:"relative",bottom:"12px",left:"45px",width:"400px",overflow:"hidden",fontWeight:"500"}}
        ><span style={{fontWeight:"500"}}>作者：</span>{item.userName}</div>
          <div style={{width:"90%",margin:"0 auto" ,maxHeight:"110px",overflow:"hidden",textOverflow:"ellipsis"}}>
              {item.mpostContent}
          </div>
        </List.Item>
     
    )}
  />
  
   </div>
    )
}