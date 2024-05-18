import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, Rate, Space, Statistic, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as ProductService from '../../services/ProductService';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import Loading from '../LoadingComponent/Loading';
import { convertPrice } from '../../utils';
import TableComponent from '../TableComponent/TableComponent';
import './Dashboard.css';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    let total = 0;
    let totalSold = 0;
    for (let i = 0; i < orders?.data.length; i++) {
        total += orders?.data[i]?.totalPrice;
        // if (typeof totalSold !== NaN) {
        //     totalSold += Number(products?.data[i]?.sold);
        // }
        if (!isNaN(products?.data[i]?.sold)) {
            totalSold += Number(products?.data[i]?.sold);
        }
    }

    // const columns = [
    //     {
    //         title: 'Username',
    //         // dataIndex: 'shippingAddress',
    //         // sorter: (a, b) => a.shippingAddress.fullName.length - b.shippingAddress.fullName.length,
    //         dataIndex: 'shippingAddress.fullName', // Sử dụng 'shippingAddress.fullName' làm dataIndex
    //         sorter: (a, b) => a['shippingAddress.fullName'].localeCompare(b['shippingAddress.fullName']), // Sắp xếp theo fullName
    //     },
    //     {
    //         title: 'Phone',
    //         dataIndex: 'phone',
    //         sorter: (a, b) => a.phone.length - b.phone.length,
    //     },
    //     {
    //         title: 'Address',
    //         dataIndex: 'address',
    //         sorter: (a, b) => a.address - b.address,
    //     },
    //     {
    //         title: 'Total price',
    //         dataIndex: 'totalPrice',
    //         sorter: (a, b) => a.totalPrice - b.totalPrice,
    //     },
    //     // (dataSourceOrder = { dataSourceOrder }),
    // ];
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (link) => {
                return <Avatar src={link} />;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (value) => <span>{convertPrice(value)}</span>,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            render: (rating) => {
                return <Rate value={rating} allowHalf disabled />;
            },
        },
    ];
    // const dataTable =
    //     orders?.data?.length &&
    //     orders?.data
    //         .slice(Math.max(orders.data.length - 5, 0)) // Lấy 5 sản phẩm cuối cùng
    //         .map((order) => {
    //             return { ...order, key: order._id };
    //         });
    const dataTable =
        products?.data?.length &&
        products?.data
            .sort((a, b) => b.rating - a.rating) // Sắp xếp sản phẩm theo rating giảm dần
            .slice(0, 3) // Lấy 3 sản phẩm đầu tiên
            .map((product) => {
                return { ...product, key: product._id };
            });
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
                    <DashboardCard
                        icon={
                            <ShoppingCartOutlined
                                style={{
                                    color: 'yellow',
                                    backgroundColor: 'rgba(0,0,255,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Sản phẩm đã bán'}
                        value={Number(totalSold)}
                    />
                    <DashboardCard
                        icon={
                            <DollarCircleOutlined
                                style={{
                                    color: 'red',
                                    backgroundColor: 'rgba(255,0,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Doanh thu'}
                        value={convertPrice(total)}
                        // value={total}
                    />
                </Space>
                {/* <div className="mt-24">
                    <h5 className="rating_product">Sản phẩm xếp hạng tốt nhất</h5>
                    <TableComponent
                        columns={columns}
                        isLoading={isLoadingProducts}
                        data={dataTable}
                        pagination={{ pageSize: 5 }}
                    />
                </div> */}
                {/* <Space direction="horizontal">
                    <RecentOrders />
                </Space> */}
                <div className="mt-24">
                    <h3 className="rating_product">Thống kê doanh thu</h3>
                    <DashboardChart />
                </div>
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

export function DashboardChart() {
    const [revenueData, setRevenueData] = useState({
        labels: [],
        datasets: [],
    });
    useEffect(() => {
        OrderService.getAllOrder().then((res) => {
            const labels = res?.data.map((order) => {
                return order?.shippingAddress?.fullName;
            });
            const data = res?.data.map((order) => {
                // return `User-${order.totalPrice}`
                return order.totalPrice;
            });
            const dataSource = {
                labels,
                datasets: [
                    {
                        label: 'Doanh thu',
                        data: data,
                        backgroundColor: 'rgba(255, 0, 0, 1)',
                    },
                ],
            };
            setRevenueData(dataSource);
        });
    }, []);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Doanh thu đơn hàng',
            },
        },
        scales: {
            y: {
                ticks: {
                    // Định dạng số liệu trên trục tung
                    callback: function (value, index, values) {
                        return convertPrice(value); // Định dạng số liệu hiển thị với dấu $
                        // return value.toFixed(2); // Định dạng số liệu hiển thị với 2 chữ số sau dấu thập phân
                        // return value.toString(); // Định dạng số liệu hiển thị dưới dạng chuỗi
                    },
                    // Các tùy chọn khác cho số liệu trên trục tung
                    fontSize: 12, // Cỡ chữ của số liệu
                    fontColor: '#aaaaaa', // Màu của số liệu
                    padding: 10, // Khoảng cách giữa số liệu và trục tung
                },
            },
        },
    };

    return (
        <Card>
            <Bar options={options} data={revenueData} />;
        </Card>
    );
}

export default Dashboard;
