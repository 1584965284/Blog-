import React,{ useEffect, useState}   from 'react'
import { Layout, Menu, Breadcrumb, message } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import {useHistory,Route,Switch} from 'react-router-dom'
import { get_by_uid } from '@/request/topicAPI';
import Avatar from 'antd/lib/avatar/avatar';
const { Header, Content, Sider } = Layout;


 
const headerNavPage=['posts','MyPage']
const headerNavInfo=['主页','我的','退出登录'];
const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: headerNavInfo[key-1],
  
}));
const user={}

export default function MyHeader(){
  const [isLog,setIsLog] = useState(false)
  const [user,setUser]=useState({profile:"",userName:''})

  const history =useHistory()
        const handleClick=e=>{
            console.log(e);
            // if(e.key==="2"){
            //    history.push('/forum/MyPage');
            //     //window.location.replace('/forum/MyPage')
            //    //window.location.reload()
            // }
             if(e.key<3){
              history.push('/forum/'+headerNavPage[e.key-1])
            }
            else{
              message.success('已安全退出')
              localStorage.clear();
              setTimeout(() => {
                history.push('/login')
              }, 200);
              
            }
        }
    useEffect(()=>{
      if(localStorage.getItem("token")){ 
        get_by_uid({uid:localStorage.getItem("token")}).then(res=>{
          if(res.state===200){
              setIsLog(true);
              setUser(res.data)

          }

        }
        )
      }
    },[])
  return(
    <div>
    <Header className="header">
      {isLog?(
        <div>
          <Avatar size={40} src={"http://localhost:8080/upload/"+user.profile}
        style={{position:"absolute",zIndex:"999",right:"120px",top:"10px"}}/>
          <span className='rightName'>{user.userName}</span>
        </div>
      ):(<div></div>)}
    
      <Menu onClick={handleClick} theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items1} />
      
    </Header>
    </div>
    
  )
}
