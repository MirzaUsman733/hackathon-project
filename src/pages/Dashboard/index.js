import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {PiStudentFill,PiUsersFourDuotone} from 'react-icons/pi'
import {FaGraduationCap} from 'react-icons/fa'
import {AiFillHome} from 'react-icons/ai'
import {
  Layout,
  Menu,
  Button,
} from 'antd';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Students from './Students';
import Attendance from './Attendance';
import Courses from './Courses';
import { useEffect } from 'react';
const { Sider, Content } = Layout;
export default function Hero() {
  const [collapsed, setCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  const handleScreenWidthChange = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleScreenWidthChange);
    return () => {
      window.removeEventListener('resize', handleScreenWidthChange);
    };
  }, []);

  useEffect(() => {
    if (screenWidth < 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [screenWidth]);

  return (
    <>
      <Layout>
        <Sider
          className="ps-2 bg-white"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ position: 'fixed', left: 0, height: '100vh' }}
        >
          <div className="demo-logo-vertical pt-3 ps-3 mt-3" />
          <div className="toggleDiv">
            <h3 className="tsk">Tasks</h3>
            <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: 'flex',
                fontSize: '16px',
              }}
            />
            </div>
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '/',
                icon: <AiFillHome />,
                label: (
                  <Link to="/" className="text-decoration-none">
                    Dashboard
                  </Link>
                ),
              },
              {
                key: '/today',
                icon: <PiStudentFill />,
                label: (
                  <Link to="/students" className="text-decoration-none">
                    Student
                  </Link>
                ),
              },
              {
                key: '4',
                icon: <FaGraduationCap />,

                label: (
                  <Link to="/courses" className="text-decoration-none">
                    Courses
                  </Link>
                ),
              },
              {
                key: '/attendance',
                icon: <PiUsersFourDuotone />,
                label: (
                  <Link to="/attendance" className="text-decoration-none">
                    Attendance
                  </Link>
                ),
              },
            ]}
          />

        </Sider>
        <Layout
          className="site-layout"
          style={{ marginLeft: collapsed ? 80 : 200 }}
        >
        
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/students" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
