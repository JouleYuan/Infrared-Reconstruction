import React from 'react';
import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { DownOutlined, UserOutlined, PoweroffOutlined, LoginOutlined } from '@ant-design/icons';
import "./Head.css";
import axios from "axios";

const { Header } = Layout;
const { SubMenu
 } = Menu;

function Head(props) {
    const [username, setUsername] = useState("");

    useEffect(()=>{
        axios({
            method: 'post',
            baseURL: "http://124.221.118.117:8080",
            url: '/account/get_user',
            data: {
                'userid': parseInt(props.id),
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            setUsername(response.data.result.username)
        })
    },[])

    const onExit = () => {
        window.location.href = "/login";
    };

    const MenuItems = (isLogin) => {
        if(isLogin) return (
            <Menu.Item key="exit" icon={<PoweroffOutlined/>} onClick={onExit}>退出登录</Menu.Item>
        );
        else return (
            <Menu.Item key="login" icon={<LoginOutlined/>} onClick={onExit}>登录</Menu.Item>
        )
    };

    return(
        <Header className="header-layout">
            <Menu theme="light" mode="horizontal">
                <a href={"/home/" + props.id}>
                    <Avatar className="header-avatar" size="large" icon={<UserOutlined/>}/>
                </a>
                <SubMenu key="SubMenu" icon={<DownOutlined/>} title={username} className="header-username">
                    {MenuItems(!(props.id === null || props === undefined))}
                </SubMenu>
            </Menu>
        </Header>
    )
}

export default Head;