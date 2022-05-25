import {React} from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Layout, Button, Upload, Row, Col, Typography, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Head from "../common/Head";
import Foot from "../common/Foot";
import GetWinSize from "../tool/GetWinSize";
import "../common/Content.css"
import "./Project.css"

const { Content } = Layout;
const { Title } = Typography

const upload_props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    }
}

const test_data = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    },
    defaultFileList: [
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/xxx.png',
      },
      {
        uid: '2',
        name: 'yyy.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
      },
      {
        uid: '3',
        name: 'zzz.png',
        status: 'error',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/zzz.png',
      },
    ],
  };

function Project() {
    const { userid, id } = useParams();
    const [visible, setVisible] = useState([]);
    const [infrared, setInfrared] = useState([]);
    const [model, setModel] = useState([]);
    const [title, setTitle] = useState("")

    function getUploadData(data) {
        let fl = []
        for (let i = 0; i < data.length; i++) {
            fl.push({
                uid: (i + 1).toString(),
                name: data[i],
                status: 'done',
                url: 'http://www.baidu.com/xxx.png',
            })
        }
        return fl
    }

    useEffect(()=>{
        axios({
            method: 'post',
            baseURL: "http://124.221.118.117:8080",
            url: '/project/get_meta',
            data: {
                'userid': parseInt(userid),
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            for (let i = 0; i < response.data.result.length; i++) {
                if (response.data.result[i].project_id == id) {
                    setTitle(response.data.result[i].project_name)
                }
            }
        })
    },[])

    useEffect(()=>{
        axios({
            method: 'post',
            baseURL: "http://65.52.163.88:8080",
            url: '/project/detail',
            data: {
                'project_id': parseInt(id),
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            console.log("h")
            setVisible(getUploadData(response.data.visible_image))
            setInfrared(getUploadData(response.data.infrared_image))
            setModel(getUploadData(response.data.model_list))
        })
    },[])

    const size = GetWinSize();

    return (
        <Layout style={{minHeight: size.height}}>
            <Head id={userid}/>
            <Content className="content-layout">
                <Row justify='center'>
                    <Col span={1}/>
                    <Col span={5}>
                        <Title level={1} className='project-title'>{title}</Title>
                    </Col>
                    <Col span={1}>
                        <Tag color="green" className='project-tag'>成功</Tag>
                    </Col>
                </Row>
                <Row justify='center' className='project-row'>
                    <Col span={4} className='project-col'>
                        <Button type="primary">生成稀疏点云</Button>
                    </Col>
                    <Col span={4} className='project-col'>
                        <Button type="primary">生成三维模型</Button>
                    </Col>
                    <Col span={4} className='project-col'>
                        <Button type="primary">生成红外纹理</Button>
                    </Col>
                </Row>
                <Row justify="space-around" className='project-row'>
                    <Col span={5} className='project-col'>
                        <Title level={3}>可见光图片</Title>
                        <Upload {...upload_props} fileList={visible}>
                            <Button icon={<UploadOutlined />}>上传</Button>
                        </Upload>
                    </Col>
                    <Col span={5} className='project-col'>
                        <Title level={3}>红外光图片</Title>
                        <Upload {...upload_props} fileList={infrared}>
                            <Button icon={<UploadOutlined />}>上传</Button>
                        </Upload>
                    </Col>
                    <Col span={5} className='project-col'>
                        <Title level={3}>模型文件</Title>
                        <Upload {...upload_props} fileList={model} />
                    </Col>
                </Row>
            </Content>
            <Foot/>
        </Layout>
    )
}

export default Project;
