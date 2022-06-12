import React,{ useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {List, Avatar, Space, Input, Button, Modal, Tooltip, Select, Comment,message,Calendar} from 'antd';
import UserManage from '../UserManage/UserManage';

import {change_password,change_avatar,get_by_uid,change_info,getPost,get_by_title,del_mpost} from "@/request/topicAPI";

let user={};
let select='0';

export default function UserPage(props){
    const history =useHistory();

    const [isShowCalendar,setIsShowCalendar]=useState(false)
    const [isToday,setIsToday]=useState(true)
    const [day,setDay]=useState('')
    const { Search } = Input;
    const { Option } = Select;
    const [data, setData] = useState([]);
    const [isMe,setIsMe]=useState(false)

    //methods
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
  console.log(value.format('YYYY-MM-DD'));
  setDay(value.format('YYYY-MM-DD'))
  
};

    useEffect(()=>{
        if(props.match.params.uid==localStorage.getItem("token")){
            setIsMe(true)
        }else {setIsMe(false)}
        get_by_uid({uid:props.match.params.uid}).then(res=>{
            if(res.state===200){
                user=res.data
            }
        })
        getPost({uid:props.match.params.uid}).then(res => {
            if(res.state===200){
                setData(res.data);
            }
        })

    },[])


    return(<div>
                <div style={{marginBottom:"20px"}}>
                <div style={{width:'64px',margin:"0 auto"}}>
                    <Avatar size={64} src={"http://localhost:8080/upload/"+user.profile} /></div>
                   <div style={{fontSize:"18px",fontWeight:"bold" ,width:"100",overflow:"hidden",margin:"10px,auto",textAlign:"center"}}>{user.userName}</div>
               </div>
               <div>
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
          avatar={<Avatar src={"http://localhost:8080/upload/"+item.profile} />}
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
        {  isMe? (     <div style={{position:"relative",bottom:"5px"}}
                onClick={()=>{
                    del_mpost({mid:item.mpostID}).then(res=>{
                        if(res.state===200){
                            message.success("删除成功");
                            getPost({uid:props.match.params.uid}).then(res => {
                                if(res.state===200){
                                    setData(res.data);
                                }
                            })
                        }else message.error(res.message)
                    })
                }}
              ><a>删除</a>

              </div>):(<div></div>)}

              {item.mpostContent}
          </div>
        </List.Item>
     
    )}
  />
               </div>
    </div>)
}