import { Menu } from 'antd';
import React, { useState } from 'react';
import { getItem } from '../../utils';
import {
    DashboardOutlined,
    HomeOutlined,
    UserOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    PoweroffOutlined,
} from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderCompoent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
import Dashboard from '../../components/Dashboard/Dashboard';
import HomePage from '../HomePage/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
const AdminPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const handleLogout = async () => {
        setLoading(true);
        await UserService.logoutUser();
        dispatch(resetUser());
        navigate('/');
        setLoading(false);
    };
    const items = [
        getItem('Dashboard', 'dashboard', <DashboardOutlined />),
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Đơn hàng', 'order', <ShoppingCartOutlined />),
        // getItem('Đăng xuất', 'logout', <PoweroffOutlined />),
    ];

    const [keySelected, setKeySelected] = useState('');

    const renderPage = (key) => {
        switch (key) {
            case 'dashboard':
                return <Dashboard />;
            case 'user':
                return <AdminUser />;
            case 'product':
                return <AdminProduct />;
            case 'order':
                return <OrderAdmin />;
            case 'logout':
                handleLogout();
                return <HomePage />;
            default:
                return <></>;
        }
    };

    const handleOnCLick = ({ key }) => {
        setKeySelected(key);
    };
    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex', overflowX: 'hidden' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        minHeight: '80vh',
                    }}
                    items={items}
                    // items={[
                    //     {
                    //         label: 'Dashboard',
                    //         key: 'dashboard',
                    //         icon: <DashboardOutlined />,
                    //     },
                    //     {
                    //         label: 'Người dùng',
                    //         key: 'user',
                    //         icon: <UserOutlined />,
                    //     },
                    //     {
                    //         label: 'Sản phẩm',
                    //         key: 'product',
                    //         icon: <AppstoreOutlined />,
                    //     },
                    //     {
                    //         label: 'Đơn hàng',
                    //         key: 'order',
                    //         icon: <ShoppingCartOutlined />,
                    //     },
                    //     {
                    //         label: 'Đăng xuất',
                    //         key: 'logout',
                    //         icon: <PoweroffOutlined />,
                    //         danger: true,
                    //     },
                    // ]}
                    onClick={handleOnCLick}
                />
                <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>{renderPage(keySelected)}</div>
            </div>
        </>
    );
};

export default AdminPage;
