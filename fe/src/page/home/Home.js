import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Layout, Table, Tag, Space, message} from 'antd';
import Head from "../common/Head";
import Foot from "../common/Foot";
import GetWinSize from "../tool/GetWinSize";
import { useParams } from 'react-router-dom';
import "../common/Content.css"
import "./Home.css"
import AddProjectButton from "./component/AddProjectButton";

const { Content } = Layout;

function Home() {
    const [data, setData] = useState([]);
    const { id } = useParams();

    useEffect(()=>{
        axios({
            method: 'post',
            baseURL: "http://124.221.118.117:8080",
            url: '/project/get_meta',
            data: {
                'userid': parseInt(id),
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            setData(response.data.result)
        })
    },[])

    const size = GetWinSize();

    const onDelete = (project_id) => {
        axios({
            method: 'post',
            baseURL: "http://124.221.118.117:8080",
            url: '/project/delete_meta',
            data: {
                'project_id': parseInt(project_id),
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            if (response.data.ok === true) {
                message.success("删除项目成功");
                axios({
                    method: 'post',
                    baseURL: "http://124.221.118.117:8080",
                    url: '/project/get_meta',
                    data: {
                        'userid': parseInt(id),
                    },
                    header:{
                        'Content-Type':'application/json',
                    },
                }).then(function(response){
                   setData(response.data.result)
                })
            } else {
                message.error("删除项目失败");
            }
        })
    }

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'project_name',
            key: 'name',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: status => {
                let color = 'grey';
                let word = '空闲';
                if (status === 'Success') {
                    color = 'green'
                    word = '成功'
                } else if (status === 'Running') {
                    color = 'blue';
                    word = '运行'
                } else if (status === 'Failed') {
                    color = 'volcano'
                    word = '失败'
                }
                if (status === 'Pending') {
                    color = 'yellow';
                    word = '等待'
                }
                return (
                    <Tag color={color} key={status}>
                        {word}
                    </Tag>
                );
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (record) => {
                console.log(record)
                return (
                    <Space size="middle">
                        <a href={"http://localhost:3000/project/" + record.userid + "/" +record.project_id}>进入</a>
                        <a onClick={()=>onDelete(record.project_id)}>删除</a>
                    </Space>
                )
            },
        },
    ];

    return (
        <Layout style={{minHeight: size.height}}>
            <Head id={id}/>
            <Content className="content-layout">
                <AddProjectButton userid={id} setData={setData}/>
                <Table columns={columns} dataSource={data} />
            </Content>
            <Foot/>
        </Layout>
    )
}

export default Home;