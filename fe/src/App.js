import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './App.css';
import Home from './page/home/Home';
import Login from './page/login/Login';
import Project from './page/project/Project';

function App() {
  return (
    <div className="App">
        <ConfigProvider locale={zhCN}>
            <Router>
                <Routes>
                    <Route exact path="/home/:id" element={<Home/>}/>
                    <Route path="/project/:userid/:id" element={<Project/>}/>
                    <Route exact path="/login" element={<Login card="login"/>}/>
                    <Route exact path="/registration" element={<Login card="registration"/>}/>
                </Routes>
            </Router>
        </ConfigProvider>
    </div>
  )
}

export default App;
