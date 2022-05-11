import React from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { DownOutlined, UserOutlined, PoweroffOutlined, LoginOutlined } from '@ant-design/icons';
import "./Head.css";

const { Header } = Layout;
const { SubMenu
 } = Menu;

function Head(props) {
    const MenuItems = (isLogin) => {
        if(isLogin) return (
            <Menu.Item key="exit" icon={<PoweroffOutlined/>}>退出登录</Menu.Item>
        );
        else return (
            <Menu.Item key="login" icon={<LoginOutlined/>}>登录</Menu.Item>
        )
    };

    return(
        <Header className="header-layout">
            <div className="header-logo" onClick={()=>{window.location.href='/'}}/>
            <Menu theme="light" mode="horizontal">
                <a href={"/"}>
                    <Avatar className="header-avatar" size="large" icon={<UserOutlined/>}/>
                </a>
                <SubMenu key="SubMenu" icon={<DownOutlined/>} title={"JouleYuan"} className="header-username">
                    {MenuItems(!(props.id === null || props === undefined))}
                </SubMenu>
            </Menu>
        </Header>
    )
}

export default Head;