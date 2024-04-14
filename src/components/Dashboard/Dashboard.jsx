import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Card, Space, Statistic, Table, Typography } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as ProductService from '../../services/ProductService';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import Loading from '../LoadingComponent/Loading';

function Dashboard() {
    const user = useSelector((state) => state?.user);
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct('', 20);
        return res;
    };
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts });
    const { isLoading: isLoadingProducts, data: products } = queryProduct;

    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token);
        return res;
    };
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers });
    const { isLoading: isLoadingUsers, data: users } = queryUser;

    const getAllOrders = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;
    console.log('orders: ', orders);
    console.log('products: ', products);
    console.log('users: ', users);
    return (
        <div>
            <Typography.Title level={4}>Dashboard</Typography.Title>
            <Loading isLoading={isLoadingUsers || isLoadingProducts || isLoadingOrders}>
                <Space direction="horizontal">
                    <DashboardCard
                        icon={
                            <UserOutlined
                                style={{
                                    color: 'purple',
                                    backgroundColor: 'rgba(0,255,255,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Người dùng'}
                        value={users?.data.length}
                    />
                    <DashboardCard
                        icon={
                            <ShoppingOutlined
                                style={{
                                    color: 'green',
                                    backgroundColor: 'rgba(0,255,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Sản phẩm'}
                        value={products?.data.length}
                    />
                    <DashboardCard
                        icon={
                            <ShoppingCartOutlined
                                style={{
                                    color: 'blue',
                                    backgroundColor: 'rgba(0,0,255,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Đơn hàng'}
                        value={orders?.data.length}
                    />
                </Space>
                {/* <Space direction="horizontal">
                    <RecentOrders />
                </Space> */}
            </Loading>
        </div>
    );
}

const DashboardCard = ({ title, value, icon }) => {
    return (
        <Card>
            <Space direction="horizontal">
                {icon}
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    );
};
const RecentOrders = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    return (
        <Table
            columns={[
                {
                    title: 'title',
                    dataIndex: 'title',
                },
                {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                },
                {
                    title: 'Price',
                    dataIndex: 'price',
                },
            ]}
        ></Table>
    );
};

export default Dashboard;
