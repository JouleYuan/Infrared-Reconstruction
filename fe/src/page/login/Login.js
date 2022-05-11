import React from 'react';
import GetWinSize from "../tool/GetWinSize";
import LoginCard from "./card/LoginCard";
import RegistrationCard from "./card/RegistrationCard";
import "./Login.css";

function Login(props){
    const size = GetWinSize();

    const selector = (key) => {
        if(key==="login") return <LoginCard/>;
        else if(key==="registration") return <RegistrationCard/>;
        else return <div/>;
    };

    return(
        <div className="site-login-background" style={{ height: size.height }}>
            <div className="site-login-card">
                {selector(props.card)}
            </div>
            <div className="site-login-footer">Infrared Reconstruction PlatForm ©2022 Created by Yuan Haoran</div>
        </div>
    )
}

export default Login;