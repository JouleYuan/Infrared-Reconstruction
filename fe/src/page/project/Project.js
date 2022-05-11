import {React} from 'react';
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

const data = {
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
    const size = GetWinSize();

    const { id } = useParams();

    return (
        <Layout style={{minHeight: size.height}}>
            <Head id={id}/>
            <Content className="content-layout">
                <Row justify='center'>
                    <Col span={1}/>
                    <Col span={5}>
                        <Title level={1} className='project-title'>Project Title</Title>
                    </Col>
                    <Col span={1}>
                        <Tag color="green" className='project-tag'>运行中</Tag>
                    </Col>
                </Row>
                <Row justify='center' className='project-row'>
                    <Col span={3} className='project-col'>
                        <Button type="primary">生成稀疏点云</Button>
                    </Col>
                    <Col span={3} className='project-col'>
                        <Button type="primary">生成三维模型</Button>
                    </Col>
                    <Col span={3} className='project-col'>
                        <Button type="primary">生成红外纹理</Button>
                    </Col>
                </Row>
                <Row justify="space-around" className='project-row'>
                    <Col span={5} className='project-col'>
                        <Title level={3}>可见光图片</Title>
                        <Upload {...data}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Col>
                    <Col span={5} className='project-col'>
                        <Title level={3}>红外光图片</Title>
                        <Upload {...data}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Col>
                    <Col span={5} className='project-col'>
                        <Title level={3}>模型文件</Title>
                        <Upload {...data} />
                    </Col>
                </Row>
            </Content>
            <Foot/>
        </Layout>
    )
}

export default Project;
