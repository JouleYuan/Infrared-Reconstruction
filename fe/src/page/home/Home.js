import React from 'react';
import { Layout, Table, Tag, Space, Button } from 'antd';
import Head from "../common/Head";
import Foot from "../common/Foot";
import GetWinSize from "../tool/GetWinSize";
import "../common/Content.css"
import "./Home.css"

const { Content } = Layout;

const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: status => {
        let color = 'grey';
        if (status === '运行') {
            color = 'green';
        } else if (status === '失败') {
            color = 'volcano'
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>进入</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: '项目1',
      status: '运行'
    },
    {
        key: '2',
        name: '项目2',
        status: '空闲'
      },
      {
        key: '3',
        name: '项目3',
        status: '失败'
      },
  ];

function Home() {
    const size = GetWinSize();

    return (
        <Layout style={{minHeight: size.height}}>
            <Head id={"123"}/>
            <Content className="content-layout">
                <Button type="primary" className='create-project-button'>创建项目</Button>
                <Table columns={columns} dataSource={data} />
            </Content>
            <Foot/>
        </Layout>
    )
}

export default Home;