import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import "./LoginCard.css"

function LoginCard(){

    return(
        <>
            <Card className="login-card" title="红外三维重建平台" >
                <Form
                    name="normal_login"
                    className="login-form"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: '请输入正确的邮箱格式',
                            },
                            {
                                required: true,
                                message: '请输入邮箱',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="邮箱" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        或者 <a href={"/registration"}>现在注册！</a>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}

export default LoginCard;