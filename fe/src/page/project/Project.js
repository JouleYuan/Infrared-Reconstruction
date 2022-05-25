import {React} from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Layout, Button, Upload, Row, Col, Typography, Tag, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Head from "../common/Head";
import Foot from "../common/Foot";
import GetWinSize from "../tool/GetWinSize";
import "../common/Content.css"
import "./Project.css"

const { Content } = Layout;
const { Title } = Typography;

function Project() {
    const { userid, id } = useParams();
    const [visible, setVisible] = useState([]);
    const [infrared, setInfrared] = useState([]);
    const [model, setModel] = useState([]);
    const [title, setTitle] = useState("")
    const [status, setStatus] = useState("Idle")

    function getUploadData(data, url) {
        let fl = []
        for (let i = 0; i < data.length; i++) {
            fl.push({
                uid: (i + 1).toString(),
                name: data[i],
                status: 'done',
                url: 'http://65.52.163.88/' + url + '/' + id + '/' + data[i],
            })
        }
        return fl
    }

    useEffect(()=>{
        const updateMeta = () => {
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
                    if (response.data.result[i].project_id === parseInt(id)) {
                        setTitle(response.data.result[i].project_name)
                        setStatus(response.data.result[i].status)
                        break
                    }
                }
            })
        }

        updateMeta();
        const interval = setInterval(
            updateMeta,
            10 * 1000
        );
        return () => {
            clearInterval(interval);
        };
    },[])

    useEffect(()=>{
        const updateDetail = () => {
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
                setVisible(getUploadData(response.data.visible_image, 'image/visible'))
                setInfrared(getUploadData(response.data.infrared_image, 'image/infrared'))
                setModel(getUploadData(response.data.model_list, 'MVS'))
            })
        }

        updateDetail();
        const interval = setInterval(
            updateDetail,
            10 * 1000
        );
        return () => {
            clearInterval(interval);
        };
    },[])

    const size = GetWinSize();

    const onUpload = (file, cmd) => {
        let body = new FormData();
        body.append('file', file)
        body.append('project_id', id)
        axios({
            method: 'post',
            baseURL: "http://65.52.163.88:8080",
            url: '/file/' + cmd,
            data: body,
            header:{
                'Content-Type':'multipart/form-data',
            },
        }).then(function(response){
            if(response.data.ok===true) {
                message.success("上传成功")
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
                    if (cmd === 'visible') setVisible(getUploadData(response.data.visible_image, 'image/visible'))
                    if (cmd === 'infrared') setInfrared(getUploadData(response.data.infrared_image, 'image/infrared'))
                })
            } else {
                message.error("上传失败")
            }
        })
    }

    const uploadVisible = (options) => {
        const {file} = options
        onUpload(file, 'visible')
    }

    const uploadInfrared = (options) => {
        const {file} = options
        onUpload(file, 'infrared')
    }

    const onRemove = (file, type, url) => {
        axios({
            method: 'post',
            baseURL: "http://65.52.163.88:8080",
            url: '/file/remove',
            data: {
                'path': 'data/' + url + "/" + id + '/' + file.name,
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            if(response.data.ok===true){
                message.success("删除成功")
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
                    if(type === "visible") setVisible(getUploadData(response.data.visible_image, 'image/visible'))
                    if(type === "infrared") setInfrared(getUploadData(response.data.infrared_image, 'image/infrared'))
                    if(type === "model") setModel(getUploadData(response.data.model_list, 'MVS'))
                })
            }else{
                message.error("删除失败")
            }
        })
    }

    const onRemoveVisible = (file) => onRemove(file, "visible", "image/visible")
    const onRemoveInfrared = (file) => onRemove(file, "infrared", "image/infrared")
    const onRemoveModel = (file) => onRemove(file, "model", "MVS")

    const StatusTag = (props) => {
        let color = 'grey';
        let word = '空闲';
        if (props.status === 'Success') {
            color = 'green'
            word = '成功'
        } else if (props.status === 'Running') {
            color = 'blue';
            word = '运行'
        } else if (props.status === 'Failed') {
            color = 'volcano'
            word = '失败'
        }
        if (props.status === 'Pending') {
            color = 'yellow';
            word = '等待'
        }
        return (
            <Tag className='project-tag' color={color} key={props.status}>
                {word}
            </Tag>
        );
    }

    const onCmd = (cmd, msg) => {
        axios({
            method: 'post',
            baseURL: "http://124.221.118.117:8080",
            url: '/project/' + cmd,
            data: {
                'project_id': parseInt(id),
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            if(response.data.ok === true){
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
                        if (response.data.result[i].project_id === parseInt(id)) {
                            setStatus(response.data.result[i].status)
                        }
                    }
                })
                message.success("开始"+msg+"成功")
            } else {
                message.error("开始"+msg+"失败")
            }
        })
    }

    const onSfM = ()=>onCmd('sfm', '生成稀疏点云')
    const onMVS = ()=>onCmd('mvs', '生成三维模型')
    const onTexture = ()=>onCmd('texture', '生成红外纹理')

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
                        <StatusTag status={status}/>
                    </Col>
                </Row>
                <Row justify='center' className='project-row'>
                    <Col span={4} className='project-col'>
                        <Button type="primary" onClick={onSfM}>生成稀疏点云</Button>
                    </Col>
                    <Col span={4} className='project-col'>
                        <Button type="primary" onClick={onMVS}>生成三维模型</Button>
                    </Col>
                    <Col span={4} className='project-col'>
                        <Button type="primary" onClick={onTexture}>生成红外纹理</Button>
                    </Col>
                </Row>
                <Row justify="space-around" className='project-row'>
                    <Col span={5} className='project-col'>
                        <Title level={3}>可见光图片</Title>
                        <Upload customRequest={uploadVisible} onRemove={onRemoveVisible} fileList={visible} multiple={true} accept={".jpg"}>
                            <Button icon={<UploadOutlined />}>上传</Button>
                        </Upload>
                    </Col>
                    <Col span={5} className='project-col'>
                        <Title level={3}>红外光图片</Title>
                        <Upload customRequest={uploadInfrared} onRemove={onRemoveInfrared} fileList={infrared} multiple={true} accept={".jpg"}>
                            <Button icon={<UploadOutlined />}>上传</Button>
                        </Upload>
                    </Col>
                    <Col span={5} className='project-col'>
                        <Title level={3}>模型文件</Title>
                        <Upload fileList={model} onRemove={onRemoveModel} />
                    </Col>
                </Row>
            </Content>
            <Foot/>
        </Layout>
    )
}

export default Project;
