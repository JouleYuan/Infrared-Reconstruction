import React from 'react';
import { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import axios from 'axios';
import FormItemLayout from "../../tool/FormItemLayout";

function AddProjectButton(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        form.submit();
    };

    const onFinish = (values) => {
        axios({
            method: 'post',
            baseURL: "http://124.221.118.117:8080",
            url: '/project/create_meta',
            data: {
                'userid': parseInt(props.userid),
                'project_name': values.name,
                'status': 'Idle',
            },
            header:{
                'Content-Type':'application/json',
            },
        }).then(function(response){
            if(response.data.ok === true){
                message.success("创建项目成功");
                axios({
                    method: 'post',
                    baseURL: "http://124.221.118.117:8080",
                    url: '/project/get_meta',
                    data: {
                        'userid': parseInt(props.userid),
                    },
                    header:{
                        'Content-Type':'application/json',
                    },
                }).then(function(response){
                    props.setData(response.data.result)
                })
            }
            else{
                message.error("创建项目失败");
            }
        });
        form.setFieldsValue({
            name: "",
        });
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button type="primary" className='create-project-button' onClick={showModal}>创建项目</Button>
            <Modal title="创建项目" visible={isModalVisible} onCancel={handleCancel} onOk={handleOk}>
                <Form {...FormItemLayout(24, 4, 24, 20)}
                      onFinish={onFinish}
                      form={form}
                >
                    <Form.Item
                        name="name"
                        label="项目名称"
                        rules={[
                            {
                                whitespace: true,
                                message: '请输入项目名称',
                            },
                            {
                                validator: (_, value) => {
                                    if (value) return Promise.resolve();
                                    return Promise.reject(new Error('请输入项目名称'));
                                }
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AddProjectButton