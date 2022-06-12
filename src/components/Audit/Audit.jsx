//npm
import React, { useState, useEffect } from 'react';
import {useHistory,Route,Switch} from 'react-router-dom'
import { AudioOutlined } from '@ant-design/icons';
import { List, message, Avatar, Skeleton, Divider,Affix,
    Modal, Button,Input,Card,Comment, Tooltip ,Form,BackTop } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined,PlusOutlined } from '@ant-design/icons';

//import
import {getall,check_my_post,get_by_mid,get_by_uid2,mlike,flike,
    new_mpost,new_fpost,getM,get_by_uid,del_mpost,del_fpost} from "@/request/topicAPI";
import MyComment from "@/components/Comment/Comment"
const { TextArea } = Input;



//帖子内容以及回帖
export default function Audit(props){

    //data
    const [likes, setLikes] = useState(0);
    const [isAuthor, setIsAuthor] = useState(false);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState(null);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [toFollow,setToFollow]=useState(0);
    const [mPost,setMPost]=useState({});
    const [user,setUser]=useState({})
    let [value,setValue]=useState('');

    const history =useHistory();
    const myID=localStorage.getItem("token")

//methods

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} showCount maxLength={100}/>
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

//methods
const handleChange=(e)=>{
   // setValue(e.target.value)
    value=e.target.value;
    //console.log(value);
}
const handleSubmit=async()=>{
        // console.log(value)
    new_fpost({
        
            mpostID:props.match.params.mid,
            fpostContent:value,
            ffloor:toFollow
        
    }).then(res=>{
        if(res.state===200){
            message.success("跟帖成功");
            get_by_mid({mid:props.match.params.mid})
            .then(res => {
                if(res.state===200){
                    /*setData([...data, ...JSON.parse(res.data.data.adminInfo1) ]);*/
                    setData(res.data);
                }

            });

        }else{
            message.error(res.message)
        }
    })
}
    const like = () => {
        setLikes(1);
        setDislikes(0);
        setAction('liked');
        mlike({mid:props.match.params.mid}).then(res=>{
            if(res.state===200){
                message.success('点赞成功~')
            }else{
                message.error(res.message)
            }
        })
    };

    const dislike = () => {
        setLikes(0);
        setDislikes(1);
        setAction('disliked');
    };
    const createFollow=(ffloor)=>{
        //setVisible(true)
        window.scrollTo(0, document.documentElement.scrollHeight-document.documentElement.clientHeight);
        if(ffloor!=-1){
            setToFollow(ffloor)
        }else{setToFollow(0)}
    }

    const actions = [
        <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {React.createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
          <span className="comment-action">{likes}</span>
      </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
          <span className="comment-action">{dislikes}</span>
      </span>
        </Tooltip>

    ];
    // if(isAuthor===true){
    //     action.push(<span key="comment-basic-reply-to">删除帖子</span>)
    // }

    useEffect( () => {
        get_by_mid({mid:props.match.params.mid})
            .then(res => {
                if(res.state===200){
                    setData(res.data);
                }

            });
        //let res2=await check_my_post();

        check_my_post({mid:props.match.params.mid}).then(res=>{
                if(res.state===200){
                    if(res.data===true){
                        setIsAuthor(true)
                    }else {setIsAuthor(false)}
                }
            });
            getM({mid:props.match.params.mid}).then(res=>{
                if(res.state===200){
                    setMPost(res.data)
                    get_by_uid({uid:res.data.userID}).then(res=>{
                        if(res.state===200){
                            setUser(res.data)
                        }
                    })
                }else {message.error(res.message)}
            })
    }, []);

    //components


    
    


    return(
     <div>
         <>
             <BackTop />

         </>
         <Modal
             title="发帖"
             centered
             visible={visible}
             onOk={() => setVisible(false)}
             onCancel={() => setVisible(false)}
             width={700}
         >
             <MyComment />
         </Modal>

         <div  onClick={createFollow.bind(this,-1)}
             style={{position:'fixed',width:'43px',height:"43px",
             background:"#1890ff",borderRadius:"50%","bottom":"110px",
             right:"98px",zIndex:"999",textAlign:"center",lineHeight:"45px",fontSize:"20px",color:"white"}}>
             <PlusOutlined />
         </div>

         <div>
             <div style={{fontWeight:"bold",fontSize:"20px",marginLeft:"20px"}}>
             {mPost.mpostTitle}

             </div>
             <Comment
                 actions={actions}
                 author={<a style={{fontSize:"16px",fontWeight:"bold"}} onClick={()=>{
                     history.push('/forum/userPage/'+mPost.userID)
                 }}>{user.userName}</a>}
                 avatar={<a>
                     <Avatar src={"http://localhost:8080/upload/"+user.profile} alt="Han Solo" onClick={() => {
                                history.push('/forum/userPage/'+mPost.userID)
                             }}/>
                     </a>}
                 content={mPost.mpostContent}
                 datetime={
                     <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                         <span>{mPost.mpostTime?(mPost.mpostTime.slice(0,10)):("暂无时间")}</span>
                     </Tooltip>
                 }
             />
             {isAuthor?(<a key="comment-basic-reply-to"
                style={{fontSize:"12px",display:'block',position:"relative",bottom:"37px",left:"150px"}}
                onClick={()=>{
                    del_mpost({mid:props.match.params.mid}).then(res=>{
                        if(res.state===200){
                            message.success("删除成功");
                            history.push('/forum/posts/'+mPost.topicID)
                        }else message.error(res.message)
                    })
                }}
             >删除帖子</a>):(<div></div>)}
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
                             avatar={<a>
                                 <Avatar src={"http://localhost:8080/upload/"+item.profile} onClick={() => {
                                history.push('/forum/userPage/'+item.userID)
                             }}/>
                             </a>}
                             title={
                                 <a  onClick={() => {
                                    history.push('/forum/userPage/'+item.userID)
                                 }}>
                                     {item.userName}
                                 </a>
                             }
                             description={item.fpostTime?(item.ffloor+'楼  '+' '+'  '+item.fpostTime.slice(0,10)):('暂无时间')}
                         />
                         <Button style={{position:"relative",bottom:'45px',left:"90%",width:"70px"}} onClick={createFollow.bind(this,item.ffloor)}>回复</Button>
                           { item.userID==myID?
                               (  <a key="comment-basic-reply-to"
                               style={{fontSize:"12px",display:'block',position:"relative",bottom:"70px",left:"180px"}}
                               onClick={()=>{
                                del_fpost({fid:item.fpostID}).then(res=>{
                                       if(res.state===200){
                                           message.success("删除成功");
                                           get_by_mid({mid:props.match.params.mid})
                                            .then(res => {
                                                if(res.state===200){
                                                    setData(res.data);
                                                }

                                            });

                                           
                                       }else message.error(res.message)
                                   })
                               }}
                           >删除</a>):(<div></div>)
                           } 
                         <div style={{width:'90%',margin:"0 auto"}}>
                         {item.fpostContent}
                             </div>
                     </List.Item>

                 )}
             />
         </div>
         <div style={{marginTop:"20px"}}>
             <div>
                 <span style={{fontWeight:"bold"}}>
                 回复{toFollow}楼:

                 </span>
             <Comment
                avatar={<Avatar src={"http://localhost:8080/upload/"+user.profile} alt="Han Solo" />}
                content={
                    <Editor
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        //submitting={submitting}
                        //value={value}
                    />
                }
            />
             </div>
             <MyComment />

         </div>

     </div>
    )
}